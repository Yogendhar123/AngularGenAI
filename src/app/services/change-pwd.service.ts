import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ChangePwdService {

  constructor(private dataService: DataService) { }

  verifyCurrPwd(username:any,password:any, newpwd:any): Observable<any>{
    const data = {
      USER_NAME: username,
      CLIENT_API_KEY: environment.API_KEY,
      USER_PASSWORD: password,
      NEW_PASSWORD: newpwd
    };
    return this.dataService.ChangePwd('token/key_gen_res', data)
}
}
