import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class SteelSurfaceInspectionService {

  constructor(private dataService: DataService) { }
  getSteelData(): Observable<any>{
    return this.dataService.getAll('steels/processedsteeldata')
}
}
