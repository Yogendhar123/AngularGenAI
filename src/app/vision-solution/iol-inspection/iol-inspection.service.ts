import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root',
})
export class IOLInspectionService {
  constructor(private dataService: DataService) {}

  getIolData(): Observable<any> {
    return this.dataService.getAll('ioldetection/processedioldetectiondata');
  }
}
