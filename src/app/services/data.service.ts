import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  public getAll(url: string): any {
    return this.http.get<any>(environment.API_URL + url, httpOptions);
}

public postAnalyses(url: string, model: FormData): Observable<any> {
    return this.http.post<any>(environment.API_URL + url, model);
}


public getspecific(url: string): any {
    return this.http.get<any>(url, httpOptions);
}

public getVideoDataAll(url: string): any {
    return this.http.get(environment.API_URL + url, {headers: httpOptions.headers, withCredentials: true, responseType: 'blob' });
}



public getZipFileData(url: string): any {
    return this.http.get(environment.API_URL + url, {headers: httpOptions.headers, withCredentials: true, reportProgress: true, observe: 'events', responseType: 'blob' });
}

public getZipFile(url: string): any {
    return this.http.get(environment.API_URL + url, {headers: httpOptions.headers, withCredentials: true, observe: 'response', responseType: 'blob' });
}

public getData(url: string, model: any): Observable<any> {
    return this.http.get(environment.API_URL + url, model, );
}

public postData(url: string, model: any): Observable<any> {
    return this.http.post<any>(environment.API_URL + url, model, { headers: httpOptions.headers, withCredentials: true });
}

public postVideoData(url: string, model: FormData): Observable<any> {
    return this.http.post<any>(environment.API_URL + url, model, httpOptions);
}

public putData(url: string, model: any): Observable<any> {
    return this.http.put<any>(environment.API_URL + url, model, { headers: httpOptions.headers, withCredentials: true });
}

public deleteData(url: string, model: any): Observable<any> {
    const models = {
        headers: httpOptions.headers, 
        withCredentials: true,
        body: model
    };
    return this.http.delete<any>(environment.API_URL + url, models);
}

public deleteTable(url: string): Observable<any> {
  
    return this.http.delete<any>(environment.API_URL + url, httpOptions);
}

public downloadFile(url: string, model: any): Observable<Blob> {
    return this.http.post(environment.API_URL + url, model, { headers: httpOptions.headers, withCredentials: true, responseType: 'blob' });
}

public postfileData(url: string, model: FormData): Observable<any> {
    return this.http.post<any>(environment.API_URL + url, model, httpOptions);
}

public ChangePwd(url: string, model: any): Observable<any> {
    return this.http.post<any>(environment.API_URL + url, model, httpOptions);
}

public getIOTDeviceData(url: string): any {
    return this.http.get<any>(environment.HUBCALL_API_URL + url, httpOptions);
}


public submitquestion(url: string,requestData:any): Observable<any> {
    return this.http.post<any>(environment.API_URL + url,requestData, httpOptions);
}
public submitquestion1(url: string, requestData:any): Observable<any> {
    return this.http.post<any>(environment.API_URL+ url, requestData,httpOptions);
}

public BOMM(url: string, requestData:any): Observable<any> {
    return this.http.post<any>(environment.API_URL+ url, requestData);
}



public postUpload(url: string, model: FormData): Observable<any> {
    return this.http.post<any>(environment.API_URL + url, model);
}

public postUploadCad(url: string, model: FormData): Observable<any> {
    return this.http.post<any>(environment.API_URL + url, model);
}


public WorkorderUpload(url: string, model: FormData): Observable<any> {
    return this.http.post<any>(environment.API_URL + url, model);
}

// public grtKPI(url: string):Observable<any> {
//     return this.http.get<any>(environment.HUBCALL_API_URL + url, httpOptions);
// }






}
