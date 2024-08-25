import { Injectable } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { interval, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root',
})
export class WorkorderService {
  constructor(private dataService: DataService,private http:HttpClient) {}

  upload(file: File): Observable<any> {
    const formData = new FormData();

    formData.append('file0', file, file.name); // Assuming 'file' is the actual video file

    return this.http.post(environment.API_URL+'workorder/insert', formData);
  }


  chat(question: string): Observable<any> {
    const formData = new FormData();
    const headers =new HttpHeaders({'content-Type':'application/json'})
    const body ={question}

  

    return this.http.post(environment.API_URL+'workorder/wochat', body,{headers});
  }

}
