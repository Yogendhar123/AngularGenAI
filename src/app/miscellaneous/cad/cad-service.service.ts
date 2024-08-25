import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

 
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CadServiceService {

  constructor(private dataService: DataService,private http:HttpClient) { }

  getAnswer(requestData:any): Observable<any>{
    return this.dataService.submitquestion('cad1/enggchat', requestData)
  }


  
  getAnswer1(requestData:any): Observable<any>{
    return this.dataService.submitquestion1('cad/chat', requestData)
  }

  getAnswer2(requestData:any): Observable<any>{
    return this.dataService.submitquestion1('schematics/chat', requestData)
  }

  BOM(response:any): Observable<any>{
    return this.dataService.BOMM('schematics/bom',response)
  }

  Bomcall(data:any):Observable<any>{
    return this.http.post<any>(environment.API_URL+"schematics/bom",data)
  }
  


  uploadcadSechamtics(file: any, videoName: string,): Observable<any> {
    const formData = new FormData();
    // formData.append("video_name", videoName);
    // formData.append("video_url", videoUrl);
    formData.append("file0", file, file.name); // Assuming 'file' is the actual video file
   
  return this.dataService.postUpload('schematics/insert', formData);
  }

  uploadcad(file: any, videoName: string,): Observable<any> {
    const formData = new FormData();
    // formData.append("video_name", videoName);
    // formData.append("video_url", videoUrl);
    formData.append("file0", file, file.name); // Assuming 'file' is the actual video file
   
  return this.dataService.postUpload('cad/insert', formData);
  }

  uploadcadMechanicalInsert(file: any, videoName: string,): Observable<any> {
    const formData = new FormData();
    // formData.append("video_name", videoName);
    // formData.append("video_url", videoUrl);
    formData.append("file0", file, file.name); // Assuming 'file' is the actual video file
   
  return this.dataService.postUpload('cad1/insertfile', formData);
  }


  uploadMechanicalText(file: any, videoName: string,): Observable<any> {
    const formData = new FormData();
    // formData.append("video_name", videoName);
    // formData.append("video_url", videoUrl);
    formData.append("file0", file, file.name); // Assuming 'file' is the actual video file
   
  return this.dataService.postUpload('cad1/inserttext', formData);
  }
}
