import { Injectable } from '@angular/core';
import {interval, Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

 
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FatigueSService {

  constructor(private dataService: DataService,private http:HttpClient) { }
  
  getFTdata(): Observable<any>{
    return this.dataService.getAll('fatigue/allfatiguedata')
  }
 

  getFTHistorydata(): Observable<any>{
    return this.dataService.getAll('fatigue/gethistory')
  }

  postFTdata(vidFormData: FormData): Observable<any>{
    return this.dataService.postVideoData('fatigue/insert', vidFormData)
  }
  // upload(file: any,  videoUrl: string): Observable<any> {
  //   const formData = new FormData();
  //   // formData.append("video_name", videoName);
  //   formData.append("video_url", videoUrl);
  //   formData.append("file", file, file.name); // Assuming 'file' is the actual video file
   
  // return this.dataService.postVideoData('fatigue/insert', formData);
  // }
  getFTtimedata(file:any): Observable<any> {
    const formData = new FormData();
    // formData.append("video_name", videoName);
    // formData.append("video_url", videoUrl);
    formData.append("file0", file, file.name); // Assuming 'file' is the actual video file
   
  return this.dataService.postUpload('fatigue/insert', formData);
  }



  upload(file: any, videoName: string,): Observable<any> {
    const formData = new FormData();
    // formData.append("video_name", videoName);
    // formData.append("video_url", videoUrl);
    formData.append("file0", file, file.name); // Assuming 'file' is the actual video file
   
  return this.dataService.postUpload('fatigue/uploadvideo', formData);
  }
 
 
  

}
