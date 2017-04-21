import { CastLightBootstraper } from './castlight.bootstraper';
import { Component, ElementRef } from '@angular/core';

declare var angular: any;
declare var SystemJS: any;
declare var clSaturnExport: any;

@Component({
    moduleId: module.id,
    selector: 'cm-castlight-component',
    template: `<div>test page <a [routerLink]="[ '/castlight' ]">go to castlight page</a></div>`
})
export class TestComponent {

    constructor() { }
}
