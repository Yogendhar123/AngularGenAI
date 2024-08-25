import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class PCBInspectionService {

  constructor(private dataService: DataService) { }

  getPcbData(): Observable<any>{
    return this.dataService.getAll('pcb/processedpcbdata')
}
}
