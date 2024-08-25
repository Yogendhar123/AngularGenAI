import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisionSolutionRoutingModule } from './vision-solution-routing.module';
import { VisionHomeComponent } from './vision-home/vision-home.component';
import { SteelSurfaceInspectionComponent } from './steel-surface-inspection/steel-surface-inspection.component';
import { PistonProfileInspectionComponent } from './piston-profile-inspection/piston-profile-inspection.component';
import { RouterModule } from '@angular/router';
import { BaseModule } from '../base.module';
import { PCBInspectionComponent } from './pcb-inspection/pcb-inspection.component';
import { PotatoChipInspectionComponent } from './potato-chip-inspection/potato-chip-inspection.component';
import { IOLInspectionComponent } from './iol-inspection/iol-inspection.component';
import { FatigueInspectionComponent } from './fatigue-inspection/fatigue-inspection.component';
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
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { WebcamComponent, WebcamInitError } from 'ngx-webcam';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
// import { NgxGaugeModule } from 'ngx-gauge';
import { VgAPI } from 'ngx-videogular';






@NgModule({
  declarations: [
    VisionHomeComponent,
    SteelSurfaceInspectionComponent,
    PistonProfileInspectionComponent,
    PCBInspectionComponent,
    IOLInspectionComponent,
    PotatoChipInspectionComponent,
    FatigueInspectionComponent,
    
    
   
   
  ],
  imports: [
    BaseModule,
    CommonModule,
    RouterModule,
    VisionSolutionRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CanvasJSAngularChartsModule,
  
   
   
    
    
    
  ],
  exports:[MatProgressSpinnerModule]
})
export class VisionSolutionModule {}
