import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true,
};

@Injectable({
  providedIn: 'root',
})
export class CopperServiceService {
  constructor(private http: HttpClient) {}
  prediturl='commodity/predict'


  public postUpload(url: string, model: FormData): Observable<any> {
    return this.http.post<any>(environment.API_URL + url, model);
}

  // getAllWithSym(symValue: string): Observable<any> {
  //   const url = 'symbol'; // Assuming this is the endpoint for the Flask API
  //   const body = { sym: symValue }; // Construct the request body with 'sym' parameter
  //   return this.http.post<any>(environment.API_URL + url, body);
  // }





  // getPredictData(symValue: string): Observable<any> {
  //   const url = "commodity/predict"; // Assuming this is the endpoint for getting all data
  //   return this.http.get<any>(environment.API_URL + url);
  // }

  getActualData(): Observable<any> {
    const url = "commodity/actual"; // Assuming this is the endpoint for getting all data
    return this.http.post<any>(environment.API_URL + url,{});
  }

  getACCData(sym:string): Observable<any> {
    const url = "commodity/accuracy"; // Assuming this is the endpoint for getting all data
    const formData = new FormData();
 
    formData.append("sym", sym);
    return this.http.post<any>(environment.API_URL + url,{formData});
  }



  predictApicall(num_period:any, sym:string): Observable<any> {
    const formData = new FormData();
    formData.append("num_periods", num_period);
    formData.append("sym", sym);
    
   
  return this.postUpload(this.prediturl, formData);
  }
}
