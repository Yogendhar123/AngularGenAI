import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'smart-factory-sandbox-ui';

  private dataSource = new BehaviorSubject<string>("Username");
  currentData = this.dataSource.asObservable();

  changeData(value:string){
    this.dataSource.next(value);
  }
}
