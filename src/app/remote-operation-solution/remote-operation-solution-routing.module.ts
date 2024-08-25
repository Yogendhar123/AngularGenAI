import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageBaseComponent } from '../core/page-base/page-base.component';
import { RouteResolverService } from '../services/route-resolver.service';
import { ControlPumpComponent } from './control-pump/control-pump.component';
import { DemandSupplySchedulerComponent } from './ds-scheduler/ds-scheduler.component';
import { RemoteOperationHomeComponent } from './remote-operation-home/remote-operation-home.component';
import { DemandSupplyComponent } from './demand-supply/demand-supply.component';

const routes: Routes = [
  {
    path: '',
    component: PageBaseComponent,
    resolve: { UserData: RouteResolverService },
    children: [
      {
        path: '',
        component: RemoteOperationHomeComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'control_wp',
        component: ControlPumpComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'dsscheduler',
        component: DemandSupplyComponent,
        resolve: { UserData: RouteResolverService },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemoteOperationSolutionRoutingModule {}
