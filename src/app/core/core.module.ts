import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { HomeComponent } from './home/home.component';
import { HelpComponent } from './help/help.component';
import { PageBaseComponent } from './page-base/page-base.component';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BaseModule } from '../base.module';
import { LoginComponent } from './login/login.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    HomeComponent,
    HelpComponent,
    PageBaseComponent,
    LoginComponent,
    UnauthorizedComponent,
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CoreRoutingModule,
    BaseModule,
    FormsModule,
    BrowserAnimationsModule
  ]
})
export class CoreModule { }
