import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy {
  goback(): void { this.location.back() }

  constructor(private location: Location) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
