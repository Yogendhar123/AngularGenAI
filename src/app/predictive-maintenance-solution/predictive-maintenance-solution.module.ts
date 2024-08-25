import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PredictiveMaintenanceSolutionRoutingModule } from './predictive-maintenance-solution-routing.module';
import { PredictiveMaintenanceHomeComponent } from './predictive-maintenance-home/predictive-maintenance-home.component';
import { MillingCutterRulComponent } from './milling-cutter-rul/milling-cutter-rul.component';
import { FrictionStirWeldingComponent } from './friction-stir-welding/friction-stir-welding.component';
import { PowmanComponent } from './powman/powman.component';
import { AccousticPredictionMaintenanceComponent } from './accoustic-prediction-maintenance/accoustic-prediction-maintenance.component';
import { BaseModule } from '../base.module';
import { GearboxMonitoringComponent } from './gearbox-monitoring/gearbox-monitoring.component';
import { ReflowOvenComponent } from './reflow-oven/reflow-oven.component';
import { ConvectionOvenComponent } from './convection-oven/convection-oven.component';
import { VibrationMeterComponent } from './vibration-meter/vibration-meter.component';
import { KpiComponentComponent } from './kpi-component/kpi-component.component';
import { KpiService } from './kpi-component/kpi.service';
import { DatePipe } from '@angular/common';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { FormsModule } from '@angular/forms';








@NgModule({
  declarations: [
    PredictiveMaintenanceHomeComponent,
    MillingCutterRulComponent,
    FrictionStirWeldingComponent,
    PowmanComponent,
    AccousticPredictionMaintenanceComponent,
    GearboxMonitoringComponent,
    ReflowOvenComponent,
    ConvectionOvenComponent,
    VibrationMeterComponent,
    KpiComponentComponent,
  ],
  imports: [
    CommonModule,
    BaseModule,
    PredictiveMaintenanceSolutionRoutingModule,
    CanvasJSAngularChartsModule,
    FormsModule
   
  
   
   
   
    
  ],
  providers:[DatePipe]
})
export class PredictiveMaintenanceSolutionModule {}
