import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { interval, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true, //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
};

@Injectable({
  providedIn: 'root',
})
export class KpiService {
  private apiUrl = 'kpi/allkpidata';
  private apiUrlFYP = 'kpi/allfpydata';
  private apiAverages = 'kpi/calculate_total_averages';
  private apiShiftwise = 'kpi/calculate_shift_averages';
  private FYPD="kpi/calculate_fpy"

  constructor(private http: HttpClient) { }

  getKPI(): any {
    return this.http.get<any>(environment.API_URL + this.apiUrl, httpOptions);
  }

  getKPIFYP(): any {
    return this.http.get<any>(
      environment.API_URL + this.apiUrlFYP,
      httpOptions
    );
  }

  postDataOEE(
    startDate: string,
    endDate: string,
    machineName: string
  ): Observable<any> {
    const data = {
      start_date: startDate,
      end_date: endDate,
      machine_name: machineName,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Add any other headers if needed
    });

    return this.http.post<any>(environment.API_URL + this.apiAverages, data, {
      headers,
    });
  }

  postDataOEE1(
    startDate: string,
    endDate: string,
    machineName: string
  ): Observable<any> {
    const data = {
      start_date: startDate,
      end_date: endDate,
      machine_name: machineName,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Add any other headers if needed
    });

    return this.http.post<any>(environment.API_URL + this.apiShiftwise, data, {
      headers,
    });
  }
  postFYPD(
    caseID: string,
   
  ): Observable<any> {
    const data = {
      case_id: caseID,     
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Add any other headers if needed
    });

    return this.http.post<any>(environment.API_URL + this.FYPD, data, {
      headers,
    });
  }
}