import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class FrictionStirWeldingService {

  constructor(private dataService: DataService) { }

  getFSWReserveData(): Observable<any>{
    return this.dataService.getAll('fsw/fswReserve');
}

getFSWReserveDataPageNumber(pagenum: number): Observable<any>{
    return this.dataService.getAll('fsw/fswReserve/' + String(pagenum));
}

getFSWRealData(): Observable<any>{
    return this.dataService.getAll('fsw/fswReal');
}

getFSWDeleteData(): Observable<any>{
    return this.dataService.deleteTable('fsw/fswDelete');
}
}
