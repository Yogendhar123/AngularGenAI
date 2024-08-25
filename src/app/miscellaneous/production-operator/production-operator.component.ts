import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-production-operator',
  templateUrl: './production-operator.component.html',
  styleUrls: ['./production-operator.component.scss']
})
export class ProductionOperatorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.location.href="https://genai-mfg-app.azurewebsites.net/"
  }

}
