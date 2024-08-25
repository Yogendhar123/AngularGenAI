import {
  Component,
  ViewEncapsulation,
  HostListener,
  OnInit,
  Injectable,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { LoggerService } from 'src/app/services/logger.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { VgAPI } from 'ngx-videogular';

import * as Chart from 'chart.js';

import { FatigueSService } from './fatigue-s.service';
import { empList } from 'src/app/model/empList.model';
import { FatigueHistory } from 'src/app/model/history.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { interval, Subscription } from 'rxjs';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsAccessibility from 'highcharts/modules/accessibility';

HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);
HighchartsAccessibility(Highcharts);

import { HttpClient } from '@angular/common/http';




interface Point {
  x: number;
  y: number;
}

interface DataPoint {
  x: number;
  y: number;
}

@Component({
  selector: 'app-fatigue-inspection',
  templateUrl: './fatigue-inspection.component.html',
  styleUrls: ['./fatigue-inspection.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
@Injectable({
  providedIn: 'root',
})
export class FatigueInspectionComponent implements OnInit {
  [x: string]: any;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @ViewChild('media') media: any;

 

  private subscription!: Subscription;

  video1!: SafeResourceUrl;
  video2!: SafeResourceUrl;

  selectedShift: number = 1;
  dateValue = '';
  timeValue = '';
  showHistoryFatigue = false;
  timelinelist: any = [];
  shortLink: string = '';

  file?: File | null; // Variable to store file
  // value = 90;
  employees: empList[] = []; // List of employees
  shifts: any[] = []; // List of shifts
  fatigueRecords: FatigueHistory[] = []; // Fatigue records by range
  records: any[] = []; // Processed records for display
  shiftSelected = new EventEmitter<number>();
  addedIds: any[] = [];
  errmsg: any;
  alertType: 'success' | 'danger' | 'warning' | null = null;
  loader: boolean = false;
  heartBeat=90
  temperature=35
  hunidity=70
  spo2=95
  person1: number;
  person2: number;
  // data: number[] = [10, 20, 70, 90];
  index: number = 0;
  index2:number=0
 

  // apicall data values

  public logout_timer = 0;
  public proc_vid_1 = './assets/solution/Getimage.jpg';
  public proc_vid_2 = './assets/solution/Getimage.jpg';
  public gauge_fati: any;
  public line_fati: any;
  public fat_prev_ind = 0;
  public fat_curr_ind = 0;
  public fatigue_timer: any;
  public videonames: any;
  public Empy_ID101: any[] = [];
  public Empy_ID102: any[] = [];
  private destroy$ = new Subject();

 
  additionalDataPointsCount: number = 10; // Number of additional data points to load
  scrollSpeed: number = 3000; // Time interval for each scroll in milliseconds
  chart: Highcharts.Chart | undefined;

  constructor(
    private sanitizer: DomSanitizer,
    private location: Location,
    private logger: LoggerService,
    private ftservice: FatigueSService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private http: HttpClient
  ) {
    // this.chart=Highcharts.chart('chattest', this.chartOptions)
    

  }


  
  private mediaStream!: MediaStream;
  private mediaRecorder!: MediaRecorder;
  private recordedChunks: Blob[] = [];

  updateValue() {
    setInterval(() => {
      this.person1 = this.Empy_ID101[this.index];
      this.index = (this.index + 1) % this.Empy_ID101.length;


      this.person2 = this.Empy_ID101[this.index2];
      this.index2 = (this.index2+ 1) % this.Empy_ID102.length;
      console.log(this.person1)
    }, 1000); // Change value every second
  }
 
  getColor(value: number): string {
    if (value < 50) {
      return 'red';
    } else if (value >= 50 && value < 70) {
      return 'yellow';
    } else {
      return 'green';
    }
  }

  foods1 = [
    { value: 'Morning', viewValue: 'Morning' },
    { value: 'Afternoon', viewValue: 'Afternoon' },
    { value: 'Evening', viewValue: 'Evening' },
  ];
  foods2 = [
    { value: 'E101', viewValue: 'E101' },
    { value: 'E102', viewValue: 'E102' },
    { value: 'E103', viewValue: 'E103' },
  ];

  // Function to simulate loading

  private getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onChange(event: any) {
    this.file = event.target.files[0];
  }
  showAlert: boolean = false;
  showAnalyse: boolean = false;
  toggleAlert() {
    this.showAlert = !this.showAlert;

    if (this.showAlert) {
      // Set a timeout to close the alert after 3000 milliseconds (adjust as needed)
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
    }
  }
  toggleAnalyse() {
    this.showAnalyse = !this.showAnalyse;

    if (this.showAnalyse) {
      // Set a timeout to close the alert after 3000 milliseconds (adjust as needed)
      setTimeout(() => {
        this.showAnalyse = false;
      }, 3000);
    }
  }

  private setAutoHide() {
    setTimeout(() => {
      this.alertType = null;
    }, 3000);
  }

  onShiftChange() {
    this.shiftSelected.emit(this.selectedShift);
  }

  // Navigation to employee's history page
  onEmployeeSelect(event: Event): void {
    const employeeId = (event.target as HTMLSelectElement).value;
    this.router.navigate(['/history', employeeId]);
  }
  // Toggle visibility of history fatigue
  toggleHistoryFatigue() {
    this.showHistoryFatigue = !this.showHistoryFatigue;
  }
  // Close history fatigue view
  closeHistory() {
    this.showHistoryFatigue = false;
  }

  onFilechange(event: any) {
    console.log(event.target.files[0]);
    this.file = event.target.files[0];
  }

  ngOnInit(): void {
  
    // this.startIntervalalldata()
   
    // this.graphdata();
    this.graph_fatigue_setup();
    this.playFatigue()    
    this.BeginFatigueProc();
    this.generaterandomdata()
    
    
    
  }

  goback(): void {
    this.location.back();
  }

  


  getBorderColorForValue(value: number): string {
    if (value >= 0 && value <= 50) {
      return '#B42318';
    } else if (value > 50 && value <= 70) {
      return '#DC6803';
    } else if (value >= 70 && value <= 100) {
      return '#027A48';
    } else {
      return '1px solid rgb(208, 213, 221)';
    }
  }

  ngOnDestroy() {
    this.stopInterval();
  }



 
  stopInterval() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  graphdata() {
    this.ftservice.getFTHistorydata().subscribe((data: any) => {
      this.Empy_ID101 =
        data.filter((x: any) => x.EMP_ID === 'R101').length > 0 &&
        data
          .filter((x: any) => x.EMP_ID === 'R101')
          .map((i: any) => i.FATIGUE_INDEX);
      this.Empy_ID102 =
        data.filter((x: any) => x.EMP_ID === 'R102').length > 0 &&
        data
          .filter((x: any) => x.EMP_ID === 'R102')
          .map((i: any) => i.FATIGUE_INDEX);
      this.graph_fatigue_setup();
      this.updateValue();
      console.log(this.Empy_ID101,'allemp')
      console.log(this.Empy_ID102,'allemp')
    });
  }

  playFatigue() {
    this.toggleAnalyse();

    this.ftservice.getFTdata().subscribe((data: any) => {
      console.log('Fatigue Data >>>', data);
      // this.proc_vid_1 = data[0][2];
      // this.proc_vid_2 = data[0][3];
      this.timelinelist = [];

      data.forEach((element: any) => {
        let temp = new timelinevideo();
        temp.id = element[0];
        temp.name = element[1];
        temp.url1 = element[2];
        temp.url2 = element[3];
        this.timelinelist.push(temp);
        // this.proc_vid_1 = element[2];
        // this.proc_vid_2 = element[3];
        // console.log(this.proc_vid_1,"update3")
      });

      var videoNameElement = document.getElementById(
        'names123'
      ) as HTMLDivElement;

      // Assuming 'data' is the array you provided, and 'videoNameElement' is the container
      // Assuming 'data' is the array you provided, and 'videoNameElement' is the container

      // for (var ijk = 0; ijk < data.length; ijk++) {
      //   console.log(data,"testdata")
      //   var currentId = data[ijk]; // Assuming ID is at index 0

      //   console.log(this.addedIds, 'add');
      //   console.log(currentId, 'current');

      //   // Check if the current ID is not in the addedIds array
      //   if (!this.addedIds.includes(currentId)) {
      //     // console.log(addedIds,"add")
      //     // console.log(currentId,"current")
      //     console.log('cu');

      //     var newElement = document.createElement('div');
      //     newElement.textContent = data[ijk][1]; // Assuming name is at index 1
      //     newElement.style.marginBottom = '10px'; // Add your desired styles here
      //     newElement.style.cursor = 'pointer';

      //     // Use an arrow function to capture the correct value of ijk
      //     newElement.onclick = () => {
      //       console.log(data[ijk][0]); // Assuming URL is at index 2
      //     };

      //     var hrElement = document.createElement('hr');

      //     videoNameElement.appendChild(newElement);
      //     videoNameElement.appendChild(hrElement);

      //     // Add the current ID to the addedIds array
      //     this.addedIds.push(currentId);
      //     console.log(this.addedIds, 'add1');
      //   }
      // }
    });

    // console.log('Gauge change');
    this.gauge_fati.data.datasets[0].data[0] = 70;
    this.gauge_fati.data.datasets[0].data[1] = 0;
    this.gauge_fati.data.datasets[0].backgroundColor[0] = '#4bc0c0';
    this.gauge_fati.options.title.text = 'Heart Rate = ' + String(70);
    this.gauge_fati.update();

    // this.fatigue_timer = setInterval(() => { this.playcall(); }, 3000);
  }

  


 
   
    
   

 graph_fatigue_setup() {
    // console.log(this.Empy_ID101, 'allemp');
    //   console.log(this.Empy_ID102, 'allemp');
   const emp1 =this.Empy_ID101
   const emp2=this.Empy_ID102

    if (this.Empy_ID101 && this.Empy_ID102.length) {
   
      Highcharts.chart('timeChart', {
        chart: {
          type: 'spline',
          events: {
            load: function () {
              const xAxis = this.xAxis[0];
              const series1 = this.series[0]; // Series for emp1
             
              xAxis.setExtremes(0, 9);
              // Start timer to slide the chart left
              let dataIndex = 10;
              setInterval(function () {
                if (dataIndex < emp1.length) {
                  xAxis.setExtremes(dataIndex - 9, dataIndex);
                  series1.addPoint([emp1[dataIndex], Math.random() * 100], true, true);
                 
                  dataIndex++;
                }
              }, 1000);
            }
          }
        },
        title: {
          text: 'Trends',
        },
        exporting: {
          enabled: false,
        },
        xAxis: {
          labels: {
            enabled: false, // Disable x-axis labels
            overflow: 'justify'
          },
          lineWidth: 0, // Hide x-axis line
          tickLength: 0, // Hide x-axis ticks
          scrollbar:{
            enabled:true
          }
         
        },
        yAxis: {
          min: 0,
          max: 100,
          tickInterval: 20,
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          series: {
            lineWidth: 4,
          },
        },

        series: [
         
          {
            type: 'spline', // Specify the type of series (e.g., line, spline, etc.)
            name: 'Person1',
            data: emp1, // Sample data for R01
            color: '#36a2eb',
          },
          {
            type: 'spline', // Specify the type of series (e.g., line, spline, etc.)
            name: 'Person2',
            data:emp2, // Sample data for R02
            color: '#ff9f40',
          },
        ],
      });
    }
  }

  setvideo(temp: timelinevideo) {
    // console.log(temp.url1,temp.url2)

    this.proc_vid_1 = temp.url1;
    this.proc_vid_2 = temp.url2;
    console.log(this.proc_vid_1, 'updatev1');
    console.log(this.proc_vid_2, 'updatev12');
    this.graphdata()
    // console.log(temp.url1, temp.url2, temp.id, 'latest');
  }

  

  playcall(): void {
   
   
    if (this.file) {
      const formData = new FormData();
      // formData.append('file', this.file);
      formData.append('video_url', this.videoURL);
      formData.append('video_name', this.file.name);
      const videoName = 'testcase1';
    

      this.ftservice.getFTtimedata(this.file).subscribe(
        (response) => {
          // Handle success response
          this.proc_vid_1 = response.FTImagePath1;
          this.proc_vid_2 = response.FTImagePath2;
          this.timelinelist = [];

          response.forEach((element: any) => {
            let temp = new timelinevideo();
            temp.id = element[0];
            temp.name = element[1];
            temp.url1 = element[2];
            temp.url2 = element[3];
            this.timelinelist.push(temp);
            // this.proc_vid_1 = element[2];
            // this.proc_vid_2 = element[3];
            // console.log(this.proc_vid_1,"update3")
          });
          this.errmsg = response;

          console.log(response);
          this.alertType = 'success'; // Show green alert for success
          this.setAutoHide();
          this.graphdata();
          this.graph_fatigue_setup()
          this.loader=false
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
          this.loader = false;
        }
      );
    } else {
      this.alertType = 'warning'; // Show yellow alert if no file is selected
      this.setAutoHide();
    }
  }
 
  BeginFatigueProc() {
    this.ftservice.getFTHistorydata().subscribe((data: any) => {
      console.log('HISTORY Data >>>', data);
      // console.log(">> data.length", data.length)

      if (data.length == 0) {
        console.log('0 data');
      } else if (this.fat_prev_ind == data.length) {
        console.log('No new data');
      } else if (this.fat_prev_ind < data.length) {
        for (var ijk = this.fat_curr_ind; ijk < data.length; ijk++) {
          console.log('Num:', ijk);
          console.log('New row >>', data[ijk]);

          if (data[ijk]['EMP_ID'] == 'R101') {
            this.line_fati.data.datasets[0].data.push(
              data[ijk]['FATIGUE_INDEX']
            );
            this.line_fati.data.labels.push(ijk);
          } else {
            this.line_fati.data.datasets[1].data.push(
              data[ijk]['FATIGUE_INDEX']
            );
          }

          this.line_fati.update();

          this.fat_prev_ind++;
        }

        this.fat_curr_ind = this.fat_prev_ind - 1;
      }

      console.log('>> this.fat_prev_ind >>', this.fat_prev_ind);
    });
  }

  // public async startRecording(): Promise<void> {
  //   try {
  //     this.mediaStream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //     });

  //     if (this.videoElement) {
  //       // this.videoElement.nativeElement.srcObject = this.mediaStream;
  //     }

  //     this.mediaRecorder = new MediaRecorder(this.mediaStream);
  //     this.mediaRecorder.ondataavailable = (event) => {
  //       if (event.data.size > 0) {
  //         this.recordedChunks.push(event.data);
  //       }
  //     };
  //     this.mediaRecorder.onstop = () => {
  //       this.saveVideoLocally();
  //       this.uploadVideoToApi('recorded_video.webm'); // Set the default video name here
  //       this.recordedChunks = [];
  //     };

  //     this.mediaRecorder.start();
  //   } catch (error) {
  //     console.error('Error accessing camera:', error);
  //   }
  // }

  // public stopRecording(): void {
  //   if (
  //     this.mediaRecorder &&
  //     this.mediaRecorder.state !== 'inactive' &&
  //     this.mediaStream
  //   ) {
  //     this.mediaRecorder.stop();
  //     this.mediaStream.getTracks().forEach((track) => track.stop());
  //   }
  // }

  // private saveVideoLocally(): void {
  //   const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
  //   const url = URL.createObjectURL(blob);

  //   const a = document.createElement('a');
  //   a.style.display = 'none';
  //   document.body.appendChild(a);

  //   // Prompt user to choose download location
  //   a.href = url;
  //   a.download = 'recorded_video.webm';
  //   a.click();

  //   // Cleanup
  //   URL.revokeObjectURL(url);
  //   document.body.removeChild(a);
  // }

  private uploadVideoToApi(videoName: string): void {
    const formData = new FormData();
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    formData.append('video', blob, videoName);

    // Adjust the API endpoint URL accordingly
    const apiUrl = 'http://localhost:8080/insert';

    // Make an HTTP POST request to the API
    this.http.post(apiUrl, formData).subscribe(
      (response) => {
        console.log('Video uploaded successfully:', response);
      },
      (error) => {
        console.error('Error uploading video:', error);
      }
    );
  }



 
 











}

class timelinevideo {
  id!: number;
  name!: string;
  url1!: string;
  url2!: string;
}





