import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageBaseComponent } from '../core/page-base/page-base.component';
import { RouteResolverService } from '../services/route-resolver.service';
import { CodeConvertorComponent } from './code-convertor/code-convertor.component';
import { MiscellaneousHomeComponent } from './miscellaneous-home/miscellaneous-home.component';
import { CadComponent } from './cad/cad.component';
import { FormsModule } from '@angular/forms';
import { CopperComponent } from './copper/copper.component';
import { SupplyChainAssistanceComponent } from './supply-chain-assistance/supply-chain-assistance.component';
import { MantainceEngineerComponent } from './mantaince-engineer/mantaince-engineer.component';
import { ProductionOperatorComponent } from './production-operator/production-operator.component';
import '../../assets/bootstrap.css'
import { WorkOrderSequenceComponent } from './work-order-sequence/work-order-sequence.component';
const routes: Routes = [
  {
    path: '',
    component: PageBaseComponent,
    resolve: { UserData: RouteResolverService },
    children: [
      {
        path: '',
        component: MiscellaneousHomeComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'modernApplication',
        component: CodeConvertorComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'cad',
        component: CadComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'commodity',
        component: CopperComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'supplychain',
        component: SupplyChainAssistanceComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'mantainceengineer',
        component: MantainceEngineerComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'productionoperator',
        component: ProductionOperatorComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'fieldservicetechnician',
        component: WorkOrderSequenceComponent,
        resolve: { UserData: RouteResolverService },
      },
      {
        path: 'force',
        component: WorkOrderSequenceComponent,
        resolve: { UserData: RouteResolverService },
      },
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes),FormsModule],
  exports: [RouterModule],
})
export class MiscellaneousRoutingModule {}
