import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class GearboxMonitoringService {

  constructor(private dataService: DataService) { }

  get_geardata(): Observable<any>{
    return this.dataService.getAll('gearbox/getGeardata');
}


}
