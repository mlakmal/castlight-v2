import { Injectable, ElementRef, Injector, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';

declare var clSaturnExport: any;
declare var angular: any;
declare var tcpV2Module: any;
declare var SystemJS: any;
declare var $: any;

//declare let emulationId: any;
//istanbul ignore next
@Injectable()
export class CastLightBootstraper {
  private _parentAppElement: any;
  private _widgetElement: any;
  private _appScope: any;
  private _ngModule: any;
  private _appConfigToCast: any;
  private _dentalRedirectUrl: any;
  private _visionRedirectUrl: any;
  private _pharmacyRedirectUrl: any;
  private _devMode: boolean = true;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private _inj: Injector) {
    this.setConfig();
  }

  initialize(eleRef: ElementRef, samlAssert: string) {
    this.destroy();

    this.loadCastlightV2(eleRef, samlAssert);
  }

  destroy() {
    if (this._appScope) {
      this._appScope.$destroy();
      this._appScope = undefined;
    }

    if (this._widgetElement) {
      this._widgetElement.remove();
      this._widgetElement = undefined;
    }

    if (this._parentAppElement) {
      this._parentAppElement.remove();
      this._parentAppElement = undefined;
    }

  }

  private setConfig() {
    SystemJS.config({
      packages: {
        'saturn': { main: 'saturn.min.js', defaultExtension: 'js' },
        'angular-cache': { main: '../assets/scripts/external/clNgCache.js', defaultExtension: 'js' },
        'mixpanel': { main: '../assets/scripts/external/clNgMixPanel.js', defaultExtension: 'js' },
        'angular': { main: '../assets/scripts/external/clAngular.js', defaultExtension: 'js' },
        'lodash': { main: '../assets/scripts/external/clLodash.js', defaultExtension: 'js' },
        'jQueryMask': { main: '../assets/scripts/external/clJQMask.js', defaultExtension: 'js' },
        'jquery': { main: '../assets/scripts/external/clJQuery.js', defaultExtension: 'js' }
      },
      map: {
        'saturn': this._appCon.web.castlight.baseUrl + this._appCon.web.castlight.version,
        'googlemaps': 'https://maps.googleapis.com/maps/api/js?v=3&client=gme-ventana'
      }
    });


    let s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?v=3&client=gme-ventana';
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  loadCastlightV2(eleRef: ElementRef, samlAssert: string) {
    Promise.all([
      SystemJS.import('../assets/scripts/internal_packages/angular/angular.js')
    ]).then(() => {
      Promise.all([
        SystemJS.import('../assets/scripts/internal_packages/angular-animate/angular-animate.js'),
        SystemJS.import('../assets/scripts/internal_packages/angular-sanitize/angular-sanitize.js'),
        SystemJS.import('../assets/scripts/internal_packages/angular-cookies/angular-cookies.js')
      ]).then(() => {
        Promise.all([
          SystemJS.import('../assets/scripts/internal_packages/aaf/core/coreUtils.js'),
          SystemJS.import('angular-cache'),
          SystemJS.import('saturn')
        ]).then((p: any) => {
          // Remove the spinner
          $(".anthem-spinner").remove();

          let cu = p[0];

          if (!this._ngModule) {
            let modules: any = [];
            clSaturnExport.modules.forEach((moduleName: any) => {
              if (moduleName !== 'ngStorage' &&
                moduleName !== 'ngCookies') {
                modules.push(moduleName);
              }
            });
            this._ngModule = angular.module('tcpV2Module', modules);
            this._ngModule.config([
              '$sceDelegateProvider',
              ($sceDelegateProvider: any) => {
                $sceDelegateProvider.resourceUrlWhitelist([
                  'self',
                  'https://m.den-signoff08.castlighthealth.com/**', 
                  'https://api.den-signoff08.castlighthealth.com/**', 
                  'https://saturn.us.castlighthealth.com/**', 
                  'https://api.us.castlighthealth.com/**']);
              }
            ]);
          }

          this._widgetElement = this.getCastlightWidget(samlAssert);
          let element = angular.element(eleRef.nativeElement);
          this._parentAppElement = angular.element('<div id="myApp" ng-app="tcpV2Module" ng-strict-di></div>');
          this._parentAppElement.append(this._widgetElement);
          element.append(this._parentAppElement);

          this._parentAppElement.bind('click', (e: any) => {
            let elm = $(e.target);

            while (this.nodeName(elm[0]) !== 'a') {

              // ignore rewriting if no A tag (reached root element, or no parent - removed from document)
              //tslint:disable:no-conditional-assignment
              if (elm[0] === (this._parentAppElement[0]) || !(elm = elm.parent())[0]) {
                break;
              }

              //tslint:enable:no-conditional-assignment
            }
            let absHref = elm.prop('href') || elm.attr('href') || elm.attr('xlink:href');

            if (this.nodeName(elm[0]) === 'a') {
              elm.attr('href', 'javascript:void(0)');
              return true;
            }
            return true;
          });

          let inj = angular.bootstrap(this._parentAppElement[0], ['tcpV2Module']);
          this._appScope = inj.get('$rootScope');
        });
      });
    });
  }
  private getCastlightWidget(samlAssert: string) {
    let isEmulated = 'N';
    let widget = angular.element('<div cl-saturn-bootstrap></div>');
    widget.attr('cl-saturn-app-config', '"{dentalRedirectUrl:' + '\'' + this._dentalRedirectUrl + '\'' + ',visionRedirectUrl:' + '\'' + this._visionRedirectUrl + '\'' + ',pharmacyRedirectUrl:' + '\'' + this._pharmacyRedirectUrl + '\'' + ',Emulated:' + '\'' + isEmulated + '\'' + ',BrandId:' + '\'' + 'ABCBS' + '\'' + '}"');

    //alert(this._appCon.web.castlight.baseUrl);
    widget.attr('cl-saturn-static-url', '\'' + this._appCon.web.castlight.baseUrl + this._appCon.web.castlight.version + '/\'');
    widget.attr('cl-saturn-api-url', '\'' + this._appCon.web.castlight.baseApiUrl + '\'');

    // put the SAML assertion in the middle below
    widget.attr('cl-saturn-saml', '\'' + samlAssert + '\'');
    widget.attr('cl-saturn-dev-mode', this._devMode);
    widget.attr('cl-saturn-skin', '\'clh-anthem.css\'');
    return widget;
  }

  nodeName(element: any = {}): string {
    return (element.nodeName || (element.length && element[0] && element[0].nodeName) || '').toLowerCase();
  }

  private get _appCon(): any {
    return {
      web: {
        castlight: {
          baseUrl: 'https://m.den-signoff08.castlighthealth.com/version/',
          baseApiUrl: 'https://api.den-signoff08.castlighthealth.com/',
          version: 'saturn-2017-03-current'
        }
      }
    };

    /*return {
      web: {
        castlight: {
          baseUrl: 'https://saturn.us.castlighthealth.com/version/',
          baseApiUrl: 'https://api.us.castlighthealth.com/',
          version: 'saturn-2017-03-current'
        }
      }
    };*/
  }
}
