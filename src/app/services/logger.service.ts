import { Injectable } from '@angular/core';
import { LogEntry, LogLevel, LogPublisher } from '../model/log-model';
import { LogPublisherService } from './log-publisher.service';



@Injectable({
  providedIn: 'root'
})
export class LoggerService {
    publishers: LogPublisher[];

  constructor(private publishersService: LogPublisherService) { 
      // Set publishers
      this.publishers = this.publishersService.publishers;
  }

  level: LogLevel = LogLevel.Info;
    logWithDate: boolean = true;


    debug(user:string,msg: string, ...optionalParams: any[]) {
        this.writeToLog(user,msg, LogLevel.Debug, optionalParams);
    }
    
    info(user:string,msg: string, ...optionalParams: any[]) {
        this.writeToLog(user,msg, LogLevel.Info, optionalParams);
    }
    
    warn(user:string,msg: string, ...optionalParams: any[]) {
        this.writeToLog(user,msg, LogLevel.Warn, optionalParams);
    }
    
    error(user:string,msg: string, ...optionalParams: any[]) {
        this.writeToLog(user,msg, LogLevel.Error, optionalParams);
    }
    
    fatal(user:string,msg: string, ...optionalParams: any[]) {
        this.writeToLog(user,msg, LogLevel.Fatal, optionalParams);
    }


    private writeToLog(user:string,msg: string, level: LogLevel, params: any[]) {
        let entry: LogEntry = new LogEntry();
        entry.user=user
        entry.message = msg;
        entry.level = level;
        entry.extraInfo = params;
        entry.logWithDate = this.logWithDate;
        for (let logger of this.publishers) {
            logger.log(entry).subscribe((response: any) => console.log(response));
        }
    }
}


