import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { LogConsole, LogFuentd, LogLocalStorage, LogPublisher, LogPublisherConfig } from '../model/log-model';
import { DataService } from './data.service';
import { catchError } from 'rxjs/operators';
import { map } from "rxjs/operators";

const PUBLISHERS_FILE = ".\\assets\\LogStorage.json";

@Injectable({
  providedIn: 'root'
})
export class LogPublisherService {

  constructor(private http: HttpClient, private dataService: DataService) { 
    this.buildPublishers();
  }

  getLoggers(): Observable<LogPublisherConfig[]> {
    return this.http.get(PUBLISHERS_FILE).pipe(map((response: any) => response)).pipe(catchError(this.handleErrors));
}

// Public properties
publishers: LogPublisher[] = [];

    
// Build publishers array
buildPublishers(): void {
    let logPub: LogPublisher;
   
    this.getLoggers().subscribe(response => {
        for (let pub of response.filter(p => p.isActive)) {
            switch (pub.loggerName.toLowerCase()) {
                case "console":
                    logPub = new LogConsole();
                    break;
                case "localstorage":
                    logPub = new LogLocalStorage();
                    break;
                case "fluentd":
                    logPub = new LogFuentd(this.dataService);
                    break;
            }
            
            // Set location of logging
            logPub.location = pub.loggerLocation;
            
            // Add publisher to array
            this.publishers.push(logPub);
        }
    });
}




private handleErrors(error: any):Observable<any> 
{
    let errors: string[] = [];
    let msg: string = "";
    
    msg = "Status: " + error.status;
    msg += " - Status Text: " + error.statusText;
    if (error) {
        msg += " - Exception Message: " + error.exceptionMessage;
    }
    errors.push(msg);
    console.error('An error occurred', errors);
    return throwError(errors);
}
}
