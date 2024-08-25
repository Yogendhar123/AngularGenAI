import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageBaseComponent } from '../core/page-base/page-base.component';
import { RouteResolverService } from '../services/route-resolver.service';
import { AccousticPredictionMaintenanceComponent } from './accoustic-prediction-maintenance/accoustic-prediction-maintenance.component';
import { FrictionStirWeldingComponent } from './friction-stir-welding/friction-stir-welding.component';
import { MillingCutterRulComponent } from './milling-cutter-rul/milling-cutter-rul.component';
import { PowmanComponent } from './powman/powman.component';
import { PredictiveMaintenanceHomeComponent } from './predictive-maintenance-home/predictive-maintenance-home.component';
import { GearboxMonitoringComponent } from './gearbox-monitoring/gearbox-monitoring.component';
import { ReflowOvenComponent } from './reflow-oven/reflow-oven.component';
import { ConvectionOvenComponent } from './convection-oven/convection-oven.component';
import { VibrationMeterComponent } from './vibration-meter/vibration-meter.component';

import { KpiComponentComponent } from './kpi-component/kpi-component.component';
const routes: Routes = [
  {
    path: '',
    component: PageBaseComponent,
    resolve: { UserData: RouteResolverService },
    children: [
      { 
        path: '', 
        component: PredictiveMaintenanceHomeComponent, 
        resolve: { UserData: RouteResolverService }
      },
      { 
        path: 'milling', 
        component: MillingCutterRulComponent, 
        resolve: { UserData: RouteResolverService }
      },
      { 
        path: 'fswelding', 
        component: FrictionStirWeldingComponent , 
        resolve: { UserData: RouteResolverService }
      },
      { 
        path: 'powman', 
        component: PowmanComponent , 
        resolve: { UserData: RouteResolverService }
      },
      { 
        path: 'acoustic', 
        component: AccousticPredictionMaintenanceComponent , 
        resolve: { UserData: RouteResolverService }
      },
      { 
        path: 'gearbox', 
        component: GearboxMonitoringComponent , 
        resolve: { UserData: RouteResolverService }
      },
      { 
        path: 'reflow', 
        component: ReflowOvenComponent , 
        resolve: { UserData: RouteResolverService }
      },
      { 
        path: 'convection', 
        component: ConvectionOvenComponent , 
        resolve: { UserData: RouteResolverService }
      },
      { 
        path: 'vibration', 
        component: VibrationMeterComponent , 
        resolve: { UserData: RouteResolverService }
      },
      { 
        path: 'kpi', 
        component: KpiComponentComponent , 
        resolve: { UserData: RouteResolverService }
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PredictiveMaintenanceSolutionRoutingModule { }
