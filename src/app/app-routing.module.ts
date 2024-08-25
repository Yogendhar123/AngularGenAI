import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactUsComponent } from './core/contact-us/contact-us.component';
import { HelpComponent } from './core/help/help.component';
import { HomeComponent } from './core/home/home.component';
import { LoginComponent } from './core/login/login.component';
import { PageBaseComponent } from './core/page-base/page-base.component';
import { UnauthorizedComponent } from './core/unauthorized/unauthorized.component';
import { RouteResolverService } from './services/route-resolver.service';
import { CadComponent } from './miscellaneous/cad/cad.component';
import { FatigueInspectionComponent } from './vision-solution/fatigue-inspection/fatigue-inspection.component';

import { ControlPumpComponent } from './remote-operation-solution/control-pump/control-pump.component';
import { } from '@angular/material/progress-spinner';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: '',
    component: PageBaseComponent,
    resolve: { UserData: RouteResolverService },
    children: [
      {
        path: 'home',
        component: HomeComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'help',
        component: HelpComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'contactus',
        component: ContactUsComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'cad',
        component: CadComponent,
        resolve: { UserData: RouteResolverService },
      },
    
      {
        path: 'control_wp',
        component: ControlPumpComponent,
        resolve: { UserData: RouteResolverService },
      },
    ],
  },
  {
    path: 'vision',
    loadChildren: () =>
      import('./vision-solution/vision-solution.module').then(
        (m) => m.VisionSolutionModule
      ),
  },
  {
    path: 'predictive',
    loadChildren: () =>
      import(
        './predictive-maintenance-solution/predictive-maintenance-solution.module'
      ).then((m) => m.PredictiveMaintenanceSolutionModule),
  },
  {
    path: 'remote',
    loadChildren: () =>
      import(
        './remote-operation-solution/remote-operation-solution.module'
      ).then((m) => m.RemoteOperationSolutionModule),
  },
  {
    path: 'miscellaneous',
    loadChildren: () =>
      import('./miscellaneous/miscellaneous.module').then(
        (m) => m.MiscellaneousModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, ],
})
export class AppRoutingModule {}
