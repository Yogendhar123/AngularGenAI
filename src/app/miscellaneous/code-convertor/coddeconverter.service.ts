import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CoddeconverterService {
  constructor(private http: HttpClient) {}

  SendConvert(
    input_lang: string,
    input_code: string,
    language: string
  ): Observable<any> {
    const url = environment.API_URL + 'codeconv/convert'; // Replace with your actual endpoint path
    const body = { input_lang, input_code, language };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(url, body, { headers });
  }



  SendCheck(
    input_lang: string,
    input_code: string,
    language: string
  ): Observable<any> {
    const url = environment.API_URL + 'codeconv/check'; // Replace with your actual endpoint path
    const body = { input_lang, input_code, language };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(url, body, { headers });
  }
}
