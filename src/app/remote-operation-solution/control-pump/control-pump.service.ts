import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ControlPumpService {

  constructor(private dataService: DataService) { }

  getWPData(d: any, rr: any): Observable<any> {
    return this.dataService.getAll('waterpump/alldata/' + d.toString() + '/' + rr)
  }

  getIOTDeviceData(on_or_off:any): Observable<any> {
    return this.dataService.getIOTDeviceData(on_or_off.toString())
  }

  // getRealData(data: any): Observable<any> {
  //   return this.dataService.getAll('https://smartfacdemo.eastus.cloudapp.azure.com/hubapi/hubcall/' + data.toString())
  // }

  // getReserveData(data: any): Observable<any> {
  //   return this.dataService.getAll('https://localhost:8080/hubapi/hubcall/reservenotworking/' + data.toString())
  // }

  getPumpDeleteData(): Observable<any> {
    return this.dataService.deleteTable('waterpump/pumpDelete')
  }
}
