import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageBaseComponent } from '../core/page-base/page-base.component';
import { RouteResolverService } from '../services/route-resolver.service';
import { PCBInspectionComponent } from './pcb-inspection/pcb-inspection.component';
import { PistonProfileInspectionComponent } from './piston-profile-inspection/piston-profile-inspection.component';
import { PotatoChipInspectionComponent } from './potato-chip-inspection/potato-chip-inspection.component';
import { SteelSurfaceInspectionComponent } from './steel-surface-inspection/steel-surface-inspection.component';
import { VisionHomeComponent } from './vision-home/vision-home.component';
import { IOLInspectionComponent } from './iol-inspection/iol-inspection.component';
import { FatigueInspectionComponent } from './fatigue-inspection/fatigue-inspection.component';

const routes: Routes = [
  {
    path: '',
    component: PageBaseComponent,
    resolve: { UserData: RouteResolverService },
    children: [
      {
        path: '',
        component: VisionHomeComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'piston',
        component: PistonProfileInspectionComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'steel',
        component: SteelSurfaceInspectionComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'pcb',
        component: PCBInspectionComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'chipsquality',
        component: PotatoChipInspectionComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'iol',
        component: IOLInspectionComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'fatigue',
        component: FatigueInspectionComponent,
        resolve: { UserData: RouteResolverService },
      },
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisionSolutionRoutingModule {}
