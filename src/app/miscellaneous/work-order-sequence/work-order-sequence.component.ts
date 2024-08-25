import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  MatDialog,
 
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient  } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { WorkorderService } from './workorder.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { MatSnackBar } from '@angular/material/snack-bar';


export interface TableElement {
  pdfname: string;
  score: number;
  remarks: string;
  AcceptBtn?: boolean;
  rejectBtn?: boolean;
  AcceptandReject?: boolean;
}

@Component({
  selector: 'app-work-order-sequence',
  templateUrl: './work-order-sequence.component.html',
  styleUrls: ['./work-order-sequence.component.scss'],
})
export class WorkOrderSequenceComponent implements AfterViewInit {
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('fileInput', { static: false }) fileInput: any;
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;



  dataSource1!: MatTableDataSource<any> 
  dataSource2!: MatTableDataSource<any> 
 
  selectedFile: File | null = null;
  files: File[] = [];
  RanktableData: TableElement[] = [];

  tableData: TableElement[] = [];
  UploadedData: TableElement[] = [];
  filteredDataUpdated: any[] = [];
  filteredData: any[] = [];
  flaseselectfile = true;
  // trueselectfile=false
  loader = false;
  buttons = false;
  buttonText: string = 'Documents Status';
  buttonColor: string = 'gray';
  textColor: string = 'black';
  value: number | null | undefined = 85  ;
  fileUrl!: SafeResourceUrl;
  pdfSrc: SafeResourceUrl | undefined;
  docxContent: string | undefined;
  errorMesg = false;
  imageUrl!:SafeResourceUrl


  constructor(
    private http: HttpClient,
    public dialog: MatDialog,

    private location: Location,
    private wororderservice: WorkorderService,
    private cdr:ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) {}



  goback(): void {
    this.location.back();
  }

  ngAfterViewInit() {
    this.dataSource1 = new MatTableDataSource<TableElement>(this.RanktableData);
    this.dataSource2 = new MatTableDataSource<TableElement>(this.UploadedData);
  
    this.dataSource1.paginator=this.paginator1
  

  }
  ngOnInit() {
    this.updateButton();
  }

  openDialog() {
    this.dialog.open(this.dialogTemplate);
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  displayedColumns: string[] = ['pdfname', 'score', 'remarks','action'];
  displayedColumns2: string[] = ['pdfname', 'score', 'remarks'];

  updateButton(): void {
    if (this.value === null || this.value === undefined) {
      this.buttonText = 'Documents Status';
      this.buttonColor = '#212445';
      this.textColor = 'white';
    } else if (this.value >= 90 && this.value <= 100) {
      this.buttonText = 'Pass';
      this.buttonColor = 'green';
      this.textColor = 'white';
    } else if (this.value >= 80 && this.value < 90) {
      this.buttonText = 'User Description';
      this.buttonColor = 'yellow';
      this.textColor = 'black';
    } else if (this.value >= 0 && this.value < 80) {
      this.buttonText = 'Rejected';
      this.buttonColor = 'red';
      this.textColor = 'white';
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.flaseselectfile=false
      const reader = new FileReader();

      reader.onload = () => {
        // this.fileUrl = reader.result;
      };

      if (this.selectedFile.type.startsWith('image/')) {
        reader.readAsDataURL(this.selectedFile);
      } else if (
        this.selectedFile.type === 'application/pdf' ||
        this.selectedFile.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        this.selectedFile.type === 'application/msword'
      ) {
        reader.readAsDataURL(this.selectedFile);
      } else {
        // this.fileUrl = null;
      }
    }
  }
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    if (this.files.length === 0) {
      this.fileInput.nativeElement.value = '';
    }
  }

  deleteFile(): void {
    this.selectedFile = null;
    this.flaseselectfile = true;
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.loader = true;
      console.log(this.selectedFile);
      this.wororderservice.upload(this.selectedFile).subscribe(
        (response) => {
          this.loader = false;
          this.showSnackbar('Uploaded Successfully', 'success-snackbar');
          const responsedata=response[0]
          console.log(responsedata)
          this.fileUrl=this.sanitizer.bypassSecurityTrustResourceUrl(responsedata)

        },
        (error) => {
          console.error(error);
          this.loader = false;
          this.showSnackbar('Upload failed please check file format!', 'error-snackbar');
        }
      );
    }
  }

  sendTextareaValue() {
    this.loader = true;
    this.http
      .post<any[]>(environment.API_URL + 'workorder/wochat', {
        question: 'Give me only the score of the document',
      })
      .subscribe(
        (response) => {
          this.errorMesg=false
          this.loader = false;
          console.log('Textarea value sent successfully:', response);
     
          // Check if response is an array or a single object and normalize it to an array
          const responseData = Array.isArray(response) ? response : [response];
     
          this.UploadedData = responseData.map((item) => ({
            pdfname: item.filename? item.filename.replace(/_page/g,'') :"",
            score: item.score || '',
            remarks: item.reason ? item.reason.replace(/["()]/g, ''):'',
            AcceptBtn: false,
            rejectBtn: false,
            AcceptandReject: true
          }));
   
          console.log(this.UploadedData);
     
          this.filteredDataUpdated = [...this.UploadedData];
          this.dataSource2.data = this.UploadedData;
     
          setTimeout(() => {
            this.dataSource2.paginator = this.paginator2;
            this.cdr.detectChanges(); // Trigger change detection
          });
     
          this.cdr.detectChanges(); // Trigger change detection
        },
        (error) => {
          console.error(error);
          this.errorMesg=true
          this.loader = false;

        }
      );
  }

  acceptFun(element: TableElement): void {
    console.log("enterAcc");
    element.AcceptandReject = false;
    element.AcceptBtn = true;
    element.rejectBtn = false;
    this.cdr.detectChanges();
  }
 
  rejectFun(element: TableElement): void {
    console.log("enterRej");
    element.AcceptandReject = false;
    element.AcceptBtn = false;
    element.rejectBtn = true;
    this.cdr.detectChanges();
  }
 
  getButtonClass(score: number, type: 'accept' | 'reject' | 'pass'): string {
    if (type === 'pass' && score >= 90) {
      return 'btn-green';
    } else if (type === 'accept' && score >= 80 && score < 90) {
      return 'btn-green';
    } else if (type === 'reject' && score >= 80 && score < 90) {
      return 'btn-red';
    } else if (type === 'reject' && score < 80) {
      return 'btn-red';
    } else {
      return '';
    }
  }


  getScoreClass(score: number): string {
    if (score >= 90) {
      return 'score-green';
    } else if (score >= 80) {
      return 'score-yellow';
    } else {
      return 'score-red';
    }
  }
  Onclear() {
    this.loader = true;
    this.http
      .post<any[]>(environment.API_URL + 'workorder/woclear', {
        clear: '',
      })
      .subscribe(
        (response) => {
          console.log('Textarea value sent successfully:', response);
          this.loader = false;
          this.UploadedData=[]
          this.filteredDataUpdated=[]
          this.selectedFile=null
          this.flaseselectfile=true
          this.fileUrl=""
          this.errorMesg=false
          this.dataSource2.data = this.UploadedData;
          this.showSnackbar('Cleared', 'success-snackbar');

        },
        (error) => {
          console.error(error);
          this.loader = false;
        }
      );
  }

  Rank() {
    this.loader = true;
    this.http
      .post<any[]>(environment.API_URL + 'workorder/worank', {
        question: 'Give me only the score of the document',
      })
      .subscribe(
        (response) => {
          console.log('Textarea value sent successfully:', response);

          this.RanktableData = response.map((item) => ({
            pdfname: item.filename,            
            score: item.score || '',
            remarks: item.reason || '',
           
          }));
          this.loader = false;
          this.showSnackbar('Error while uploading', 'error-snackbar');
          this.openDialog()
          // this.dataSource1.paginator=this.paginator1
          console.log(this.RanktableData);
          this.filteredData = [...this.RanktableData];
          this.dataSource2.data = this.RanktableData;
                  // Use setTimeout to ensure the paginator is set after view update
         setTimeout(() => {
          this.dataSource1.paginator = this.paginator1;
          this.cdr.detectChanges(); // Trigger change detection
         
        });

         
    
          this.cdr.detectChanges()

        },
        (error) => {
          console.error(error);
          this.loader = false;
          this.showSnackbar('Uploaded Successfully', 'success-snackbar');
        }
      );
  }





  showSnackbar(message: string, panelClass: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [panelClass]
    });
  }
}
