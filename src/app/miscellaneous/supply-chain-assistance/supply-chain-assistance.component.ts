import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supply-chain-assistance',
  templateUrl: './supply-chain-assistance.component.html',
  styleUrls: ['./supply-chain-assistance.component.scss']
})
export class SupplyChainAssistanceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.location.href="https://genai-tire-mfg-app.azurewebsites.net/"
  }

}
