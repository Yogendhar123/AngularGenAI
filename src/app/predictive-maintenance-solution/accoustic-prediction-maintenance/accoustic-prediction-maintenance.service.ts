import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class AccousticPredictionMaintenanceService {

  constructor(private dataService: DataService) { }

  getAcousticRealData(): Observable<any> {
    return this.dataService.getAll('acoustic/acousticReal')
  }

  getAcousticReserveData(): Observable<any> {
    return this.dataService.getAll('acoustic/acousticReserve')
  }

  deleteAcousticRealData(): Observable<any> {
    return this.dataService.deleteTable('acoustic/acousticDelete')
  }
}
