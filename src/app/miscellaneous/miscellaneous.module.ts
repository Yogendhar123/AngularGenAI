import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CodeConvertorComponent } from './code-convertor/code-convertor.component';

import { BaseModule } from '../base.module';
import { MiscellaneousRoutingModule } from './miscellaneous-routing.module';
import { MiscellaneousHomeComponent } from './miscellaneous-home/miscellaneous-home.component';
import { RouterModule } from '@angular/router';
import { CadComponent } from './cad/cad.component';
import { FormsModule } from '@angular/forms';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import { ReactiveFormsModule } from '@angular/forms';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { CopperComponent } from './copper/copper.component';
import { SupplyChainAssistanceComponent } from './supply-chain-assistance/supply-chain-assistance.component';
import { MantainceEngineerComponent } from './mantaince-engineer/mantaince-engineer.component';
// import { PlantOperatorComponent } from './plant-operator/plant-operator.component';
import { ProductionOperatorComponent } from './production-operator/production-operator.component';
import { WorkOrderSequenceComponent } from './work-order-sequence/work-order-sequence.component';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { SafePipe } from './work-order-sequence/safe.pip';




@NgModule({
  declarations: [MiscellaneousHomeComponent, CodeConvertorComponent, CadComponent, CopperComponent, SupplyChainAssistanceComponent, MantainceEngineerComponent, ProductionOperatorComponent, WorkOrderSequenceComponent],
  imports: [ReactiveFormsModule,IvyCarouselModule,CommonModule, BaseModule, RouterModule, MiscellaneousRoutingModule,FormsModule, MatTableModule,MatPaginatorModule,],
  exports:[MatProgressSpinnerModule,MatTabsModule]
})
export class MiscellaneousModule {}
