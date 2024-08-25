import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { getToken } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private jwtHelper: JwtHelperService) { }

  getUserData() {
    let userInfo: any = null as any;
    let test = getToken();
    if (test == null) {
      return userInfo;
    }
    const decodedObj = this.jwtHelper.decodeToken(test).user_data;
    userInfo = {
      UserId: decodedObj.userid,
      UserName: decodedObj.username,
      FirstName: decodedObj.firstname,
      LastName: decodedObj.lastname,
      Role: decodedObj.role,
      Usecases: decodedObj.usecases,
      Solutions: decodedObj.solutions,
      SessionToken: decodedObj.sessiontoken
    };

    return userInfo;
  }
}
