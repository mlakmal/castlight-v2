'use strict';

define(['internal_packages/aaf/common/commonModule'], function (mod) {

  var injectParams = ['$sce', '$parse', '$compile'];

  //istanbul ignore next
  var aafBindHtmlCompile = function ($sce, $parse, $compile) {
    return {
      restrict: 'A',
      compile: function (tElement, tAttrs) {
        var aafBindHtmlCompileGetter = $parse(tAttrs.aafBindHtmlCompile);
        var aafBindHtmlCompileWatch = $parse(tAttrs.aafBindHtmlCompile, function sceValueOf(val) {
          // Unwrap the value to compare the actual inner safe value, not the wrapper object.
          return $sce.valueOf(val);
        });
        $compile.$$addBindingClass(tElement);

        return function aafBindHtmlCompileLink(scope, element, attr) {
          $compile.$$addBindingInfo(element, attr.aafBindHtmlCompile);

          scope.$watch(aafBindHtmlCompileWatch, function aafBindHtmlCompileWatchAction() {
            // The watched value is the unwrapped value. To avoid re-escaping, use the direct getter.
            var value = aafBindHtmlCompileGetter(scope);
            element.html(value || '');
            $compile(element.contents())(scope);
          });
        };
      }
    };
  };

  aafBindHtmlCompile.$inject = injectParams;

  mod.register('directive', 'aafBindHtmlCompile', aafBindHtmlCompile);

});
