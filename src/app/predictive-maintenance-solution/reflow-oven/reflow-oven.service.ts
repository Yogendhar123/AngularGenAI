import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ReflowOvenService {

  constructor(private dataService: DataService) { }

  getMilData(d:any): Observable<any>{
    return this.dataService.getAll('reflowoven/reflow/'+d.toString())
}

getMilDataPageNumber(): Observable<any>{
    return this.dataService.getAll('reflowoven/reflow/paging');
}
}
