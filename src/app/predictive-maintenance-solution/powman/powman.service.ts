import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class PowmanService {

  constructor(private dataService: DataService) { }

  getPOWData(): Observable<any>{
    return this.dataService.getAll('powman/powmanmodeldata');
}


deletePOWData(): Observable<any>{
    return this.dataService.deleteTable('powman/powmanclear');
}
}
