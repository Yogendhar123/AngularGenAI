import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mantaince-engineer',
  templateUrl: './mantaince-engineer.component.html',
  styleUrls: ['./mantaince-engineer.component.scss']
})
export class MantainceEngineerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.location.href="https://genai-tire-mfg-app.azurewebsites.net/"
  }

}
