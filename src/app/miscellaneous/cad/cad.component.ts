import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { CadServiceService } from './cad-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cad',
  templateUrl: './cad.component.html',
  styleUrls: ['./cad.component.scss'],
})
export class CadComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  imgUrl: any;
  imageUrl: string | null = null;
  textAreaValue: string | null = null;
  showAlert: boolean = false;
  showAlert1: 'success' | 'danger' | 'warning' | null = null;
  selectedValue: string = 'P&ID Drawing';
  userQuestion: string = '';
  answer: string = '';
  url: any; //Angular 11, for stricter type
  url1: any; //Angular 11, for stricter type
  url2: any; //Angular 11, for stricter type
  msg = '';
  alertType: 'success' | 'danger' | 'warning' | null = null;
  alertMessage: string = '';
  alertColor: string = '';
  showAlertq: boolean = false;
  errmsg: any;
  loader: boolean = false;
  Ansloader: boolean = false;
  imageUrls: { name: string; url: SafeResourceUrl; rawUrl: string }[] = [];
  currentImageUrl: SafeResourceUrl | null = null;
  show = true;
  updateURL: string = '';
  excelUrl: string | null = null;

  hardcodedAnswers: { [key: string]: string } = {};
  window: any;
  questions: string[] = [
    'How are the components connected to each other? (series, parallel, etc.)',
    'Can you trace the flow of information or signal through the diagram? (for electronic circuits)',
    ' What is the overall purpose of the system represented in the schematic?',
    'What are the inputs and outputs of the system?',
    "Are there any specific components that play a critical role in the system's function?",
    'Can you identify any control mechanisms or feedback loops in the schematic?',
  ];

  selectQuestion(question: string): void {
    this.userQuestion = question;
  }

  constructor(
    private location: Location,
    private router: Router,
    private http: HttpClient,
    private cadservice: CadServiceService,
    private sanitizer: DomSanitizer
  ) {}

  goback(): void {
    this.location.back();
  }

  ngOnInit(): void {}

  foods = [
    { value: 'P&ID Drawing', viewValue: 'P&ID Drawing' },
    { value: 'Mechanical Drawing', viewValue: 'Mechanical Drawing' },
    { value: 'Schematic Drawing', viewValue: 'Schematic Drawing' },
  ];

  cleartext() {
    this.answer = '';
  }

  getExcelUrl(): void {
    this.loader = true;
    const url = 'schematics/bom';
    const data = {
      image_name: this.updateURL,
    };
    this.http.post<any>(environment.API_URL + url, data).subscribe(
      (response) => {
        this.loader = false;
        this.excelUrl = response.answer;
        const update = this.excelUrl;
        console.log(`Received Excel URL: ${this.excelUrl}`);
        if (this.excelUrl) {
          this.downloadExcel(this.excelUrl);
        } else {
          console.log('URL is null');
        }
      },
      (error) => {
        this.loader = false;
        console.error('Error fetching Excel URL:', error);
      }
    );
  }

  downloadExcel(url: string): void {
    this.http.get(url, { responseType: 'blob' }).subscribe(
      (blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = this.getFileNameFromUrl(url);
        link.click();
        window.URL.revokeObjectURL(link.href);
      },
      (error) => {
        console.error('Download error:', error);
      }
    );
  }

  private getFileNameFromUrl(url: string): string {
    return url.split('/').pop() || 'download.xlsx';
  }

  downloadFile() {
    const url =
      'https://smartfactorystrgaccdev.blob.core.windows.net/pcbexcel/image1.xlsx';
    const fileName = this.extractFileNameFromUrl(url);

    this.http.get(url, { responseType: 'blob' }).subscribe((blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  private extractFileNameFromUrl(url: string): string {
    return url.split('/').pop() ?? 'downloaded-file';
  }

  submitQuestion() {
    if (this.userQuestion.trim() === '') {
      this.showAlertq = true;
      this.setAlert('Please Ask Question', 'danger');
      setTimeout(() => {
        this.showAlertq = false;
      }, 3000);
    } else {
      if (this.selectedValue === 'P&ID Drawing') {
        this.Ansloader = true;

        const requestData = { question: this.userQuestion,image_name:this.selectedFile?.name};

        this.cadservice.getAnswer1(requestData).subscribe(
          (response) => {
            console.log('API Response:', response);
            if (response.hasOwnProperty('answer')) {
              this.answer = response.answer.answer;
              this.showAlertq = true;
              // this.setAlert('Message sent successfully.', 'success');
            } else {
              this.showAlertq = true;
              this.setAlert('No answer received from the API.', 'warning');
            }
            this.Ansloader = false;
            setTimeout(() => {
              this.showAlertq = false;
            }, 3000);
          },
          (error) => {
            console.error('API Error:', error);
            this.showAlertq = true;
            this.setAlert(
              'Error while sending message. Please try again.',
              'danger'
            );
            this.Ansloader = false;
            setTimeout(() => {
              this.showAlertq = false;
            }, 3000);
          }
        );
      } else if (this.selectedValue === 'Mechanical Drawing') {
        this.Ansloader = true;
        const requestData = {
          question: this.userQuestion,
          image_name: this.selectedFile?.name,
        };

        this.cadservice.getAnswer(requestData).subscribe(
          (response) => {
            console.log('API Response:', response);
            if (response.hasOwnProperty('answer')) {
              this.answer = response.answer.answer;
              this.showAlertq = true;
              // this.setAlert('Message sent successfully.', 'success');
            } else {
              this.showAlertq = true;
              this.setAlert('No answer received from the API.', 'warning');
            }
            this.Ansloader = false;
            setTimeout(() => {
              this.showAlertq = false;
            }, 3000);
          },
          (error) => {
            console.error('API Error:', error);
            this.showAlertq = true;
            this.setAlert(
              'Error while sending message. Please try again.',
              'danger'
            );
            this.Ansloader = false;
            setTimeout(() => {
              this.showAlertq = false;
            }, 3000);
          }
        );
      } else {
        this.Ansloader = true;
        this.answer = '';
        const requestData = {
          question: this.userQuestion,
          image_name: this.updateURL,
        };

        this.cadservice.getAnswer2(requestData).subscribe(
          (response) => {
            console.log('API Response:', response);
            if (response.hasOwnProperty('answer')) {
              this.answer = response.answer;
              this.showAlertq = true;
              // this.setAlert('Message sent successfully.', 'success');
            } else {
              this.showAlertq = true;
              this.setAlert('No answer received from the API.', 'warning');
            }
            this.Ansloader = false;
            setTimeout(() => {
              this.showAlertq = false;
            }, 3000);
          },
          (error) => {
            console.error('API Error:', error);
            this.showAlertq = true;
            this.setAlert(
              'Error while sending message. Please try again.',
              'danger'
            );
            this.Ansloader = false;
            setTimeout(() => {
              this.showAlertq = false;
            }, 3000);
          }
        );
      }
    }
  }

  private setAlert(message: string, color: string) {
    this.alertMessage = message;
    this.alertColor = color;
  }

  selectedModel: any;
  // onFileSelected(event: any): void {
  //   this.selectedFile = event.target.files[0];
  //   this.previewImage();
  // }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
    this.alertType = null; // Reset the alert when a file is selected
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';

      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Only images are supported';
      return;
    }

    if (this.selectedValue === 'P&ID Drawing') {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (_event) => {
        this.msg = '';
        this.url1 = reader.result;
      };
    } else if (this.selectedValue === 'Mechanical Drawing') {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (_event) => {
        this.msg = '';
        this.url2 = reader.result;
      };
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (_event) => {
        this.msg = '';
        this.url = reader.result;
      };
    }

    this.alertType = null; // Reset the alert when a file is selected
  }
  onUpload(): void {
    if (this.selectedFile === null) {
      this.showAlertq = true;
      this.setAlert('Please Upload Image', 'danger');
      setTimeout(() => {
        this.showAlertq = false;
      }, 3000);
    } else {
      if (this.selectedValue === 'P&ID Drawing') {
        this.loader = true;
        setTimeout(() => {
          this.loader = false;
        }, 30000);
        if (this.selectedFile) {
          const formData = new FormData();
          // formData.append('file', this.selectedFile);
          formData.append('video_url', this.selectedFile);
          formData.append('video_name', this.selectedFile);
          const videoName = 'testcase1';
          // const videoUrl = '/testcase/';
          this.cadservice.uploadcad(this.selectedFile, videoName).subscribe(
            (response) => {
              // Handle success response

              this.errmsg = response;
              console.log(response);
              this.alertType = 'success'; // Show green alert for success
              this.setAutoHide();
            },
            (error) => {
              // Handle error
              console.error(error);
              if (error.status === 500) {
                this.alertType = 'danger'; // Show red alert for internal server error
              } else if (error.status === 404) {
                this.alertType = 'danger';
              } else if (error.status === 400) {
                this.alertType = 'danger';
              } else {
                this.alertType = 'warning'; // Show yellow alert for other errors
              }
              this.setAutoHide();
            }
          );
        } else {
          this.alertType = 'warning'; // Show yellow alert if no file is selected
          this.setAutoHide();
        }
      } else if (this.selectedValue === 'Mechanical Drawing') {
        this.loader = true;
        setTimeout(() => {
          this.loader = false;
        }, 30000);
        if (this.selectedFile) {
          this.loader = true;
          const formData = new FormData();
          // formData.append('file', this.selectedFile);
          formData.append('video_url', this.selectedFile);
          formData.append('video_name', this.selectedFile);
          const videoName = 'testcase1';
          // const videoUrl = '/testcase/';
          this.cadservice
            .uploadcadMechanicalInsert(this.selectedFile, videoName)
            .subscribe(
              (response) => {
                // Handle success response

                this.errmsg = response;

                console.log(response);
                this.alertType = 'success'; // Show green alert for success
                this.setAutoHide();
              },
              (error) => {
                // Handle error
                console.error(error);
                if (error.status === 500) {
                  this.alertType = 'danger'; // Show red alert for internal server error
                } else if (error.status === 404) {
                  this.alertType = 'danger';
                } else if (error.status === 400) {
                  this.alertType = 'danger';
                } else {
                  this.alertType = 'warning'; // Show yellow alert for other errors
                }
                this.setAutoHide();
              }
            );
        } else {
          this.alertType = 'warning'; // Show yellow alert if no file is selected
          this.setAutoHide();
        }
      } else {
        if (this.selectedFile) {
          this.loader = true;
          console.log('Intial pass');
          // setTimeout(() => {
          //   this.loader = false;
          // }, 30000);
          const formData = new FormData();
          // formData.append('file', this.selectedFile);
          formData.append('video_url', this.selectedFile);
          formData.append('video_name', this.selectedFile);
          const videoName = 'testcase1';
          // const videoUrl = '/testcase/';
          this.cadservice
            .uploadcadSechamtics(this.selectedFile, videoName)
            .subscribe(
              (response) => {
                // Handle success response
                this.loader = false;
                this.show = false;

                this.errmsg = response;
                const url1 = response[0];
                const url2 = response[1];

                this.imageUrls = [
                  {
                    name: 'PCB0001',
                    rawUrl: url1,
                    url: this.sanitizer.bypassSecurityTrustResourceUrl(url1),
                  },
                  {
                    name: 'PCB0002',
                    rawUrl: url2,
                    url: this.sanitizer.bypassSecurityTrustResourceUrl(url2),
                  },
                ];

                console.log(url1, url2);
                this.alertType = 'success'; // Show green alert for success
                this.setAutoHide();
              },
              (error) => {
                this.loader = false;
                // Handle error
                console.error(error);
                if (error.status === 500) {
                  this.alertType = 'danger'; // Show red alert for internal server error
                } else if (error.status === 404) {
                  this.alertType = 'danger';
                } else if (error.status === 400) {
                  this.alertType = 'danger';
                } else {
                  this.alertType = 'warning'; // Show yellow alert for other errors
                }
                this.setAutoHide();
              }
            );
        } else {
          this.alertType = 'warning'; // Show yellow alert if no file is selected
          this.setAutoHide();
        }
      }
    }
  }

  displayImage(url: SafeResourceUrl, rawUrl: string): void {
    this.currentImageUrl = url;
    const urlUpdate = this.currentImageUrl;
    console.log(rawUrl);

    const fileName = this.getFileNameFromUrl(rawUrl);
    this.updateURL = fileName;

    console.log(fileName);

    // this.selectedFile=this.currentImageUrl
  }

  // Bomb(): void {
  //   const requestData = {
  //     'image_name': this.updateURL,
  //   };
  //   this.loader = true;
  //   this.cadservice.Bomcall(requestData).subscribe(
  //     (response) => {

  //       this.loader = false;
  //       this.excelUrl=response.answer
  //     },
  //     (error) => {
  //       this.loader=false
  //       console.error('API Error:', error);

  //       this.setAlert(
  //         'Error while sending message. Please try again.',
  //         'danger'
  //       );
  //       this.Ansloader = false;
  //       setTimeout(() => {
  //         this.showAlertq = false;
  //       }, 3000);
  //     }
  //   );
  // }

  onUploadText(): void {
    if (this.selectedFile === null) {
      this.showAlertq = true;
      this.setAlert('Please Upload Image', 'danger');
      setTimeout(() => {
        this.showAlertq = false;
      }, 3000);
    } else {
      if (this.selectedFile) {
        this.loader = true;
        setTimeout(() => {
          this.loader = false;
        }, 30000);
        const formData = new FormData();
        // formData.append('file', this.selectedFile);
        formData.append('video_url', this.selectedFile);
        formData.append('video_name', this.selectedFile);
        const videoName = 'testcase1';
        // const videoUrl = '/testcase/';
        this.cadservice
          .uploadMechanicalText(this.selectedFile, videoName)
          .subscribe(
            (response) => {
              // Handle success response

              this.errmsg = response;

              console.log(response);
              this.alertType = 'success'; // Show green alert for success
              this.setAutoHide();
            },
            (error) => {
              // Handle error
              console.error(error);
              if (error.status === 500) {
                this.alertType = 'danger'; // Show red alert for internal server error
              } else if (error.status === 404) {
                this.alertType = 'danger';
              } else if (error.status === 400) {
                this.alertType = 'danger';
              } else {
                this.alertType = 'warning'; // Show yellow alert for other errors
              }
              this.setAutoHide();
            }
          );
      } else {
        this.alertType = 'warning'; // Show yellow alert if no file is selected
        this.setAutoHide();
      }
    }
  }

  private setAutoHide() {
    setTimeout(() => {
      this.alertType = null;
    }, 3000);
  }

  cleardata(event: any): void {
    this.textAreaValue = null;
    this.answer = '';
    this.userQuestion = '';
    this.url = '';
    this.url1 = '';
    this.url2 = '';
  }
  onReset(): void {
    this.selectedFile = null;
    this.imageUrl = null;
    this.textAreaValue = null;
    this.clearFileInput();
    this.showAlert = false;
    // this.location.reload()

    window.location.reload();
  }
  onClear(): void {
    this.textAreaValue = null;
    this.answer = '';
    this.userQuestion = '';
  }

  clearFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onSend(): void {
    if (this.textAreaValue && this.imageUrl) {
      const dataToSend = {
        text: this.textAreaValue,
        imageUrl: this.imageUrl,
      };

      this.http.post('/chat', dataToSend).subscribe(
        (response) => {
          // Handle successful response from the server
          console.log('Server response:', response);
        },
        (error) => {
          // Handle error response from the server
          console.error('Error sending data: ', error);
        }
      );
    } else {
      // Show alert if either image or text is not present
      this.showAlert = true;

      // Set a timeout to hide the alert after 5 seconds
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    }
  }
}
