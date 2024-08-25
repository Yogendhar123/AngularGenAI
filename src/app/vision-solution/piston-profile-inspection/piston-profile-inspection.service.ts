import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class PistonProfileInspectionService {

  constructor(private dataService: DataService) { }

  getPistonData(): Observable<any>{
    return this.dataService.getAll('pistons/processedpistondata')
}
}
