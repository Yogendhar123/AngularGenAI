import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemoteOperationSolutionRoutingModule } from './remote-operation-solution-routing.module';
import { RemoteOperationHomeComponent } from './remote-operation-home/remote-operation-home.component';
import { ControlPumpComponent } from './control-pump/control-pump.component';
import { DemandSupplySchedulerComponent } from './ds-scheduler/ds-scheduler.component';


import { BaseModule } from '../base.module';
import { DemandSupplyComponent } from './demand-supply/demand-supply.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RemoteOperationHomeComponent,
    ControlPumpComponent,
    DemandSupplySchedulerComponent,
    DemandSupplyComponent,
  ],
  imports: [CommonModule, BaseModule, RemoteOperationSolutionRoutingModule,FormsModule],
})
export class RemoteOperationSolutionModule {}
