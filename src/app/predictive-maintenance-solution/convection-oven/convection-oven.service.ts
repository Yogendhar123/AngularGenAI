import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ConvectionOvenService {

  constructor(private dataService: DataService) { }

  getMilData(d:any): Observable<any>{
    return this.dataService.getAll('convectionoven/convection/'+d.toString())
}

getMilDataPageNumber(): Observable<any>{
    return this.dataService.getAll('convectionoven/convection/paging');
}
}
