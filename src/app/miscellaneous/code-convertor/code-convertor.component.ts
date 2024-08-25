import {
  Component,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { Location } from '@angular/common';
import { CoddeconverterService } from './coddeconverter.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'code-convertor-scheduler',
  templateUrl: './code-convertor.component.html',
  styleUrls: ['./codeConvertor.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class CodeConvertorComponent implements AfterViewInit {
  @ViewChild('iframeElement')
  iframeElement!: ElementRef;
  inputLanguage: string = '';
  Languagewant: string = '';
  inputText: string = '';
  Output: string = '';
  loader: boolean = false;
  Report:string=""
  Debugging:string=""

  constructor(
    private location: Location,
    private renderer: Renderer2,
    private apiservice: CoddeconverterService,
    private snackBar: MatSnackBar
  ) {}

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

  showSnackbar(message: string, panelClass: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [panelClass],
    });
  }

  onSelectInputLanguge(event: Event) {
    this.inputLanguage = (event.target as HTMLSelectElement).value;
    console.log('Selected Value1:', this.inputLanguage);
  }

  onSelectLanguage(event: Event) {
    this.Languagewant = (event.target as HTMLSelectElement).value;
    console.log('Selected Value2:', this.Languagewant);
  }
  inputTextChange(event: Event) {
    this.inputText = (event.target as HTMLTextAreaElement).value;
    console.log('Textarea Value:', this.inputText);
  }

  OnReset() {
    this.Languagewant = '';
    this.inputLanguage = '';
    this.inputText = '';
    this.Output = '';
    this.Debugging=''
    this.Report=''
    console.log(this.Languagewant);
  }

  coverter() {
    if (this.inputLanguage === '') {
      this.showSnackbar('Please Select Input Laguage', 'error-snackbar');
    } else if (this.Languagewant === '') {
      this.showSnackbar('Please Select  Laguage', 'error-snackbar');
    } else if (this.inputText === '') {
      this.showSnackbar(
        'Please Give Input Before Converting',
        'error-snackbar'
      );
    } else {
      this.loader = true;
      const input_lang = this.inputLanguage;
      const input_code = this.inputText;
      const language = this.Languagewant;

      this.apiservice.SendConvert(input_lang, input_code, language).subscribe(
        (response) => {
          console.log('Response:', response.generated_code);
          this.Output = response.generated_code;
          this.loader = false;
        },
        (error) => {
          console.error('Error:', error);
          this.loader = false;
        }
      );
    }
  }

  check() {
    this.loader = true;
    const input_lang = this.inputLanguage;
    const input_code = this.inputText;
    const language = this.Languagewant;

    this.apiservice.SendCheck(input_lang, input_code, language).subscribe(
      (response) => {
        console.log('Response:', response);
        this.Report = response.summary;
        this.Debugging=response.errors
        this.loader = false;
      },
      (error) => {
        console.error('Error:', error);
        this.loader = false;
      }
    );
  }
}
