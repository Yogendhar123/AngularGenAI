import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { getToken } from './model/user';
import { environment } from 'src/environments/environment';
import { RouteResolverService } from './services/route-resolver.service';
import { TranslationService } from './services/translation.service';
import { InterceptorService } from './services/interceptor.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BaseModule } from './base.module';
import '../assets/bootstrap.css'

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    CoreModule,
    BaseModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken,
        allowedDomains: environment.whitelistedDomains,
        authScheme: '',
      },
    }),
    FontAwesomeModule,
  ],
  providers: [
    RouteResolverService,
    TranslationService,
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: function (router: Router) {
        return new InterceptorService(router);
      },
      multi: true,
      deps: [Router],
    },
  ],
 
})
export class AppModule {}
