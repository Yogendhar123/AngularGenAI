import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserData } from '../model/model';
import { getToken } from '../model/user';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class RouteResolverService implements Resolve<UserData> {

  constructor(private jwtHelper: JwtHelperService, private appService: AppService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): UserData {
    let userInfo: UserData = null as any;
    let test = getToken();
    if (test == null || this.jwtHelper.isTokenExpired(test)) {
        this.router.navigate(['login']);
    } else {
        userInfo = this.appService.getUserData();
        
    }
    return userInfo;
}
}
