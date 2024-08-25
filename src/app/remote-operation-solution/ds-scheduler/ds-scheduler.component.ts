import {
  Component,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ds-scheduler',
  templateUrl: './ds-scheduler.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DemandSupplySchedulerComponent implements AfterViewInit {
  @ViewChild('iframeElement')
  iframeElement!: ElementRef;

  constructor(private location: Location, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.setIframeHeight();
  }

  setIframeHeight() {
    console.log(this.iframeElement);
    const iframe = this.iframeElement.nativeElement;
    const parentDiv = iframe.parentElement;
    console.log(parentDiv);
    const parentHeight = parentDiv.clientHeight;
    console.log(parentHeight);

    this.renderer.setStyle(iframe, 'height', parentHeight + 'px');
  }

  goback(): void {
    this.location.back();
  }
}
