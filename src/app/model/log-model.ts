import { Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { DataService } from "../services/data.service"; 

export abstract class LogPublisher {
    location: string='';
    abstract log(record: LogEntry): Observable<boolean>
    abstract clear(): Observable<boolean>;
}


export class LogConsole extends LogPublisher {
    log(entry: LogEntry): Observable<boolean> {
        // Log to console
        console.log(entry.buildLogString());
        return of(true);
    }
    
    clear(): Observable<boolean> {
        console.clear();
        return of(true);
    }
}


export class LogFuentd extends LogPublisher {
    constructor(private dataService: DataService) {
        super();
    }
   
    log(entry: LogEntry): Observable<boolean> {
        return this.dataService.postData(environment.logging_url,entry.buildLogString())
    }
    
    clear(): Observable<boolean> {
        // clear all logs from fluentd server
        return of(true);
    }
}


export class LogLocalStorage extends LogPublisher {
    constructor() {
        // Must call `super()`from derived classes
        super();
        
        // Set location
        this.location = "logging";
    }
    
    // Append log entry to local storage
    log(entry: LogEntry): Observable<boolean> {
        let ret: boolean = false;
        let values: string[]=[];
        
        // Get previous values from local storage

        values = JSON.parse(localStorage.getItem(this.location)!) || [];
        // Add new log entry to array
        values.push(entry.buildLogString());
        
        // Store array into local storage
        localStorage.setItem(this.location, JSON.stringify(values));

        ret = true;
       
        
        return of(ret);
    }
    
    // Clear all log entries from local storage
    clear(): Observable<boolean> {
        localStorage.removeItem(this.location);
        return of(true);
    }
}

export class LogEntry {
    // Public Properties
    user:string=''
    entryDate: Date = new Date();
    message: string = "";
    level: LogLevel = LogLevel.Debug;
    extraInfo: any[] = [];
    logWithDate: boolean = true;
  
    public date_time = ''
    public computedt()
    {
        let hours=new Date().getHours().toString();
        let min=new Date().getMinutes().toString();
        let secs=new Date().getSeconds().toString();
        let day=new Date().getDate().toString();
        let mon=new Date().getMonth();
        let year=new Date().getFullYear().toString();
            if (hours.length<2){hours="0"+hours;}
            if (min.length<2){min="0"+min;}
            if (secs.length<2){secs="0"+secs;}
            if (day.length<2){day="0"+day;}
        this.date_time = hours+":"+min+":"+secs+", "+ new Date(Date.now()).toLocaleString('en-us', { month: 'short', year: 'numeric', day: 'numeric'});
    }
    
    buildLogString(): string {
        let ret: string = "";
        ret='{"AppName" : "SmartFactorySandboxUI", '
        ret+='"User" : '+ '"'+this.user+ '"' + ', ';
        if (this.logWithDate) 
        {
            this.computedt();
            ret = ret+'"Date and Time" : ' + '"'+ String(this.date_time)+ '"' + ", ";
        }
        
        ret += '"Type" : ' + '"' + LogLevel[this.level]+ '"' + ', ';
        ret += '"Message" : ' + '"' + this.message + '"';
  
        if (this.extraInfo.length) 
        {   var einfo = String(this.formatParams(this.extraInfo))
            ret += ', "Extra Info" : ' + einfo;
        }
        ret=ret+'}'
  
        return ret;
    }
    
    private formatParams(params: any[]): string {
        let ret: string = params.join(",");
        
        // Is there at least one object in the array?
        if (params.some(p => typeof p == "object")) {
            ret = "";
            
            // Build comma-delimited string
            for (let item of params) {
                ret += JSON.stringify(item) + ",";
            }
        }
        
        return ret;
    }
  }

export class LogPublisherConfig {
    loggerName: string='';
    loggerLocation: string='';
    isActive: boolean=true;
}

  export enum LogLevel {
    Debug = 0,
    Info = 1,
    Warn = 2,
    Error = 3,
    Fatal = 4,
  }