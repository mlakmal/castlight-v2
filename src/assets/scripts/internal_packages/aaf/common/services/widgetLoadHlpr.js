'use strict';

/**
 * @author Lakmal Molligoda
 * @description widget/directive service call prioritizing helper component
 * TODO: still under design/development Lakmal. test
 */
/* istanbul ignore next */
define(['internal_packages/aaf/common/commonModule'], function (mod) {

  var injectParams = [
    '$q',
    '$rootScope',
    '$interval',
    '$window',
    '$filter',
    '$document'
  ];

  //istanbul ignore next
  var aafWidgetLoadHelper = function (
    $q,
    $rootScope,
    $interval,
    $window,
    $filter,
    $document) {

    var maxHttpConnections = 5;
    var pageWidgets = [];
    var executingWidgets = [];
    var timer = null;
    var area = {
      top: 0,
      left: 0,
      bottom: window.innerHeight,
      right: window.innerWidth
    };
    var triggers = 'DOMMouseScroll.wload mousewheel.wload touchstart.wload touchmove.wload scroll.wload';

    init();

    this.registerWidget = function (name, priority, callback, element) {
      var widget = {
        name: name,
        priority: priority,
        callback: callback,
        element: element
      };

      if (priority === 1 && executingWidgets.length < maxHttpConnections) {
        console.log('start ' + widget.name);
        widget.callback();
        executingWidgets.push(widget);
      }
      else {
        pageWidgets.push(widget);
      }
    };

    this.unregisterWidget = function (name) {
      if (executingWidgets.length > 0) {
        executingWidgets.pop();
        console.log('cancel ' + name);
      }
    };

    function init() {

      $rootScope.$on('$routeChangeStart', function (event, next, current) {
        resetPageWidgets();
      });

      timer = $interval(function () {
        if (pageWidgets.length === 0 && executingWidgets.length === 0) {
          resetPageWidgets();
          console.log('cancel timer');
        }
        else {
          if (pageWidgets.length > 0 && executingWidgets.length < maxHttpConnections) {
            pageWidgets = $filter('orderBy')(pageWidgets, '-priority');
            var widget = pageWidgets.pop();
            console.log('start2 ' + widget.name);
            widget.callback();
            executingWidgets.push(widget);
          }
        }

      }, 1);

      $document.find('body').on(triggers, function () {
        if (pageWidgets.length > 0) {
          for (var index = 0; index < pageWidgets.length; index++) {
            var widget = pageWidgets[index];
            var targetArea = widget.element.getBoundingClientRect();
            var isVisible = !(targetArea.bottom < area.top || area.bottom < targetArea.top || targetArea.right < area.left || area.right < targetArea.left);
            if (widget.priority !== 1 && isVisible) {
              console.log('scroll ' + widget.name);
              pageWidgets[index].priority = 1;
            }
          }
        }
      });
    }

    function resetPageWidgets() {
      pageWidgets = [];
      executingWidgets = [];
      $document.find('body').off(triggers);
      if (timer != null && timer.$$state.status !== 2) {
        $interval.cancel(timer);
      }
    }

  };

  aafWidgetLoadHelper.$inject = injectParams;

  mod.register('service', 'aafWidgetLoadHelper', aafWidgetLoadHelper);

});
