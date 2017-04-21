import { CastLightBootstraper } from './castlight.bootstraper';
import { Component, ElementRef } from '@angular/core';

declare var angular: any;
declare var SystemJS: any;
declare var clSaturnExport: any;

@Component({
    moduleId: module.id,
    selector: 'cm-castlight-component',
    template: `<div>castlight page <a [routerLink]="[ '/test' ]">go to test page</a></div>`
})
export class CastlightComponent {

    constructor(private _eleRef: ElementRef,
        private _bootstraper: CastLightBootstraper) { }

    ngOnInit() {
        this._bootstraper.initialize(this._eleRef, '');
    }

    ngOnDestroy() {
        this._bootstraper.destroy();
    }
}
