'use strict';

/**
 * @author Lakmal Molligoda
 * @description this directive will load another directive dynamically.
 * Usage: <div data-widget-loader-dir data-widget-name="tcpWidgetName" data-widget-script-path="/feature/directives/xyzDir,path/directives/abcDir"></div>
 */
define(['internal_packages/aaf/common/commonModule'], function (mod) {

  var injectParams = ['$q',
    '$log',
    '$compile',
    'aafContentHlpr'];

  /* istanbul ignore next */
  var aafWidgetLoaderDir = function ($q, $log, $compile, aafContentHlpr) {
    return {
      transclude: true,
      restrict: 'A',
      scope: {
      },
      template: '<div class="ant-widget-loader" data-uxd-data-loader-dir>' +
      '<span>Loading widget</span>' +
      '</div>',
      link: function (scope, element, attrs, ctrl, transclude) {
        var widget = null;
        var transcludedContent, transcludedScope;

        init();

        function init() {
          transclude(function (clone, scope) {
            element.append(clone);
            transcludedContent = clone;
            transcludedScope = scope;
          });

          loadChildDirectiveScript();

          scope.$on('$destroy', function () {
            destroyChildWidget();
          });
        }

        function loadChildDirectiveScript() {
          if (attrs.widgetName.length !== 0) {
            if (attrs.widgetScriptPath.length !== 0) {
              var scriptDeps = attrs.widgetScriptPath.split(',');
              Promise.all(scriptDeps.map(function (f) {
                return System.import(f);
              })).then(function () {
                loadSuccess();
              }, function (error) {
                loadFail(error);
              });
              /*require(scriptDeps, function () {
                loadSuccess();
              }, function (error) {
                loadFail(error);
              });*/
            }
            else {
              //directive already included in pkg definition
              loadSuccess();
            }
          }
        }

        function loadSuccess() {
          appendChildWidget();
        }

        function loadFail(error) {
          element[0].innerHTML = '<div  class="ant-anthem-alert ant-negative negative" >' +
            '<div class="media-left media-middle">' +
            '<span class="fa fa-exclamation-circle"></span>' +
            '</div>' +
            '<div class="media-body">' +
            '<p>Error loading widget</p>' +
            '</div>' +
            '</div>';
          $log.error(error);
        }

        function appendChildWidget() {
          var contentEl = element.find('script');
          var isContentBlock = contentEl.length >= 1 && contentEl[0].type !== null && contentEl[0].type !== 'undefined' && contentEl[0].type.toLowerCase() === 'application/json' ? true : false;

          var content = isContentBlock ? contentEl[0].outerHTML : '';

          transcludedContent.remove();
          transcludedScope.$destroy();

          //convert cameCase widgetname to snake-case to be used in html
          var widgetName = convertToSnakeCase(attrs.widgetName);

          if (!angular.isDefined(attrs.uniqueIdNumber)) {
            widget = angular.element('<div data-' + widgetName + getHtmlAttrs() + '>' + content + '</div>');

            if (content.length) {
              aafContentHlpr.setWcsConent(attrs.widgetName, angular.fromJson(contentEl[0].innerHTML));
            }
          } else {
            var widgetNumber = attrs.uniqueIdNumber;
            var widgetId = widgetName + '-' + widgetNumber;
            widget = angular.element('<div data-' + widgetName + getHtmlAttrs() + ' data-widget-id="' + widgetId + '">' + content + '</div>');

            if (content.length) {
              aafContentHlpr.setWcsConent(widgetId, angular.fromJson(contentEl[0].innerHTML));
            }
          }

          //compile the directive and append it to current element
          element.append(widget);
          $compile(widget)(scope);
          element.find('.ant-widget-loader').html('');
        }

        //manually destroy the child element and its scope. stops memory leaks
        function destroyChildWidget() {
          if (widget !== null) {
            var widgetScope = widget.scope();
            widget.remove();

            if (widgetScope) {
              widgetScope.$destroy();
            }
          }
        }

        function convertToSnakeCase(attr) {
          return attr.replace(/([A-Z])/g, function ($1) { return '-' + $1.toLowerCase(); });
        }

        function getHtmlAttrs() {
          var object = attrs.$attr;
          var attrString = '';
          for (var key in object) {
            if (object.hasOwnProperty(key)) {
              if (!(key.indexOf('aaf') === 0 || key.indexOf('widget') === 0)) {
                attrString += ' data-' + convertToSnakeCase(key) + '="' + attrs[key] + '"';
              }
            }
          }

          return attrString;
        }
      }
    };
  };

  aafWidgetLoaderDir.$inject = injectParams;

  mod.register('directive', 'aafWidgetLoaderDir', aafWidgetLoaderDir);
});
