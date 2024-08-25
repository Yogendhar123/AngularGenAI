import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private dataService: DataService) { }

  getLoginVerification(username: any, password: any): Observable<any> {
    const data = {
      USER_NAME: username,
      CLIENT_API_KEY: environment.API_KEY,
      USER_PASSWORD: password
    };
    return this.dataService.postData('token/key_gen', data)
  }
  getUserVerification(username: any,): Observable<any> {
    const data = {
      USER_NAME: username,
      CLIENT_API_KEY: environment.API_KEY,
    };
    return this.dataService.postData('token/key_gen', data)
  }
}
