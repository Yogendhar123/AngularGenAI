import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public intSolutions: any = [];
  public extSolutions: any = [];
  constructor(private dataService: DataService) { 
    
  }

  getSolutionList(userid: number): Observable<any> {
    return this.dataService.getAll('solutions/solutionlists/' + userid)
  }
  getUseCaseList(userid: number, solnid: number): Observable<any> {
    return this.dataService.getAll('solutions/usecaselists/' + userid + '/' + solnid)
  }

  logout(userToken: string): Observable<any> {
    this.intSolutions = []
    this.extSolutions = []
    const data = {
      Token: userToken
    };
    return this.dataService.postData('usage/tracklogout', data)
  }
}
