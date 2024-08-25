import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VibrateComponentService {

  constructor(private http: HttpClient) { }



  getVibrate({}):Observable<any>{
    const url = environment.API_URL + 'pumpfail/realtime'; // Replace with your actual endpoint path
    const body = { };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(url, body, { headers });

  }
}
