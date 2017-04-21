'use strict';

/**
 * @author Lakmal Molligoda
 * @description this component allows other angular components to be registered for given module after angular bootstrap.
 * this helps angular components loaded asyc through requirejs to be registered easily without going through multiple if/else cases.
 */
define(function () {
  var CoreUtils = (function () {
    var aafCommonInjector = null;
    var aafAppBootUtil = null;

    //istanbul ignore next
    var getAppBootUtil = (function () {
      if (aafCommonInjector === null) {
        aafCommonInjector = angular.injector(['ng', 'aafCommonModule']);
      }

      if (aafAppBootUtil === null) {
        aafAppBootUtil = aafCommonInjector.get('aafAppBootUtil');
      }

      return aafAppBootUtil;
    });

    var initAngularModule = (function (mod) {

      //below code is to support AMD component registering when unit test runner is executed.
      if (typeof allTestFiles !== 'undefined') {
        mod.asyncRegister = mod;
      }

      var injectParams = ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$injector'];
      function config($controllerProvider, $compileProvider, $filterProvider, $provide, $injector) {
        mod.asyncRegister =
          {
            controller: $controllerProvider.register,
            directive: $compileProvider.directive,
            filter: $filterProvider.register,
            factory: $provide.factory,
            service: $provide.service,
            providers: {
              $controllerProvider: $controllerProvider,
              $compileProvider: $compileProvider,
              $filterProvider: $filterProvider,
              $provide: $provide,
              $injector: $injector
            }
          };
      }

      config.$inject = injectParams;

      mod.config(config);

      mod.register = function (cmpType, cmpName, component) {
        switch (cmpType) {
          case 'controller':
            if (typeof this.asyncRegister !== 'undefined') {
              this.asyncRegister.controller(cmpName, component);
            }
            else {
              this.controller(cmpName, component);
            }

            break;
          case 'directive':
            if (typeof this.asyncRegister !== 'undefined') {
              this.asyncRegister.directive(cmpName, component);
            }
            else {
              this.directive(cmpName, component);
            }

            break;
          case 'service':
            if (typeof this.asyncRegister !== 'undefined') {
              this.asyncRegister.service(cmpName, component);
            }
            else {
              this.service(cmpName, component);
            }

            //ng2UpgradeAdapter.upgradeNg1Provider(cmpName);

            break;
          case 'factory':
            if (typeof this.asyncRegister !== 'undefined') {
              this.asyncRegister.factory(cmpName, component);
            }
            else {
              this.factory(cmpName, component);
            }

            //ng2UpgradeAdapter.upgradeNg1Provider(cmpName);
            break;
          case 'filter':
            if (typeof this.asyncRegister !== 'undefined') {
              this.asyncRegister.filter(cmpName, component);
            }
            else {
              this.filter(cmpName, component);
            }

            break;
          case 'value':
            this.value(cmpName, component);

            //ng2UpgradeAdapter.upgradeNg1Provider(cmpName);
            break;
          case 'constant':
            this.constant(cmpName, component);

            //ng2UpgradeAdapter.upgradeNg1Provider(cmpName);
            break;
          case 'provider':
            if (typeof this.asyncRegister !== 'undefined') {
              if (typeof this.provider !== 'undefined') {
                this.provider(cmpName, component);
              }
              else {
                console.log('async registering is not supported for providers');
              }
            }
            else {
              this.provider(cmpName, component);
            }

            //ng2UpgradeAdapter.upgradeNg1Provider(cmpName);
            break;
        }
      };

      mod.lazyLoadModule = function (moduleName) {
        var moduleFn = angular.module(moduleName);
        var runBlocks = moduleFn._runBlocks;
        try {
          for (var invokeQueue = moduleFn._invokeQueue, i = 0, ii = invokeQueue.length; i < ii; i++) {
            var invokeArgs = invokeQueue[i];

            if (this.asyncRegister.providers.hasOwnProperty(invokeArgs[0])) {
              var provider = this.asyncRegister.providers[invokeArgs[0]];
            } else {
              return console.error('unsupported provider ' + invokeArgs[0]);
            }

            provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
          }
        } catch (e) {
          if (e.message) {
            e.message += ' from ' + moduleName;
          }

          console.error(e.message);
        }

        var injector = this.asyncRegister.providers.$injector;
        angular.forEach(runBlocks, function (fn) {
          injector.invoke(fn);
        });
      };
    });

    return {
      InitAngularModule: initAngularModule,
      GetAppBootUtil: getAppBootUtil
    };

  })();

  return CoreUtils;
});
