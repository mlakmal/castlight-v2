import { TestComponent } from './test.component';
import { CastlightComponent } from './castlight.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules, NoPreloading } from '@angular/router';

const app_routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'castlight' },
  { path: 'castlight', component: CastlightComponent },
  { path: 'test', component: TestComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(app_routes) ],
  exports: [ RouterModule, CastlightComponent, TestComponent ],
  declarations: [CastlightComponent, TestComponent],
  entryComponents: [CastlightComponent, TestComponent]
})
export class AppRoutingModule { }
