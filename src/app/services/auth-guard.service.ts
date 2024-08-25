import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { getToken } from '../model/user';
import { AppService } from './app.service';
import { UserData } from './route-resolver.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  userData!: UserData;
  constructor(private router: Router, private route : ActivatedRoute, private jwtHelper : JwtHelperService, private appService: AppService) { 

  }

  canActivate(route: ActivatedRouteSnapshot): boolean | Promise<boolean> {
    this.userData = (<UserData>this.route.snapshot.data.UserData); 
    if (this.userData === undefined || this.userData === null) {
      if (getToken() == null) {
        this.router.navigate(['login'], { queryParams: { redirectTo: route.queryParams['_routerState'].url } });
      } else {
        this.userData = this.appService.getUserData();
      }
    }
   
    if (this.userData) {
      var hasAdminAccess = this.userData.Role=== 'A' ? true : false;
      if (route.data.isAdmin && route.data.isAdmin !== hasAdminAccess) {
        // role not authorised so redirect to unauthorized`
        this.redirectToUnAuthorizedPage();
        return false;
      }
    }
    return true;
  }

  redirectToUnAuthorizedPage() {
    this.router.navigate(['/unauthorized']);
  }
}
