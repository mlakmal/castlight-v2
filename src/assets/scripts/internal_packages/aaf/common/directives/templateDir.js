'use strict';

define(['internal_packages/aaf/common/commonModule'], function (mod) {

  var injectParams = ['$templateCache'];

  //istanbul ignore next
  var aafTemplateDir = function ($templateCache) {
    return {
      priority: 100,
      restrict: 'A',
      transclude: true,
      template: '<div class="template-content"></div>',
      scope: {},
      link: function (scope, element, attrs, ctrl, transclude) {
        var transcludedContent, transcludedScope, ele;

        transclude(function (clone, scope) {
          ele = angular.element('<div class="template-inner-content"></div>');
          $(ele).append(clone.prevObject ? clone.prevObject[0].innerHTML : clone);
          transcludedContent = clone;
          transcludedScope = scope;
        });

        $templateCache.put(element[0].getAttribute('id'), ele[0].innerHTML);
        transcludedContent.remove();
        transcludedScope.$destroy();
        ele.remove();
      }
    };
  };

  aafTemplateDir.$inject = injectParams;

  mod.register('directive', 'aafTemplateDir', aafTemplateDir);

});
