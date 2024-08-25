import {
  Component,
  ViewEncapsulation,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { LoggerService } from 'src/app/services/logger.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { Sol, usec, UserData } from 'src/app/model/model';
import { environment } from 'src/environments/environment';
import { PistonProfileInspectionService } from './piston-profile-inspection.service';
import Swal from 'sweetalert2';
import * as Chart from 'chart.js';
import { removeToken } from 'src/app/model/user';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription, interval } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

// Define the type for the image object
interface Image {
  predclass: string[];
  processedimgurl: string;
}
 

@Component({
  selector: 'app-piston-profile-inspection',
  templateUrl: './piston-profile-inspection.component.html',
  styleUrls: ['./piston-profile-inspection.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PistonProfileInspectionComponent implements OnInit {
  public uid: number = 0;

  @ViewChild('barCanvas') barCanvas: any;
  @ViewChild('pieCanvas') pieCanvas: any;

  barChart: any;
  pieChart: any;

  public milling_url: string = '';
  public wp_url: string = '';
  public rca_url: string = '';
  public piston_url = '';
  public eqp_url = '';
  public home_url: string = '';
  public steel_url: string = '';
  public vision_url: string = '';
  public predictive_url: string = '';
  public remote_url: string = '';
  public help_url: string = '';
  public contact_url: string = '';

  public timer: any;
  public timer1: any;

  public piston_list: any = [];

  public uname: string = '';
  public fname: string = '';
  public lname: string = '';
  public userrole: string = '';
  public sessiontoken: string = '';

  public pdata: any;
  public counter = 0;

  public message: string = '';
  public UserID: any;

  public sch_focus: any = false;

  intSolutions: any = [];
  extSolutions: any = [];
  solutions = new Array<Sol>();

  public logout_timer: any;
  public ucases: any = [];
  // public images: string[] = [];

  public info = [];
  public pop_disp = '';
  public cam1p = '';
  public cam2p = '';
  public cam3p = '';
  public cam4p = '';

  public sch_serial = '';
  public sch_defect = '';
  public sch_acc = '';
  public sch_acc_color = '';
  public src_file = '';

  public piston_id = '';
  public search_string = '';

  public acc = 0;
  public rck = 0;
  public rej = 0;

  public dam = 0;
  public grs = 0;
  public norm = 0;
  public tot = 0;

  public srl = '';
  public srl_stat = '';
  public srl_def = '';
  public srl_font = '14px';

  public pi_src = '';
  public img_no = '';

  public id = '';
  public cam1 = this.sanitizer.bypassSecurityTrustUrl(
    './assets/img/nopreview.png'
  );
  public cam2 = this.sanitizer.bypassSecurityTrustUrl(
    './assets/img/nopreview.png'
  );
  public cam3 = this.sanitizer.bypassSecurityTrustUrl(
    './assets/img/nopreview.png'
  );
  public cam4 = this.sanitizer.bypassSecurityTrustUrl(
    './assets/img/nopreview.png'
  );

  public timeline_child = '';

  public status_no = '';

  public serial1 = '';
  public defect1 = '';
  public action1 = '';
  public action_color1 = '';
  public dt_type1 = '';
  public act1 = '';

  public serial2 = '';
  public defect2 = '';
  public action2 = '';
  public action_color2 = '';
  public dt_type2 = '';
  public act2 = '';

  public serial3 = '';
  public defect3 = '';
  public action3 = '';
  public action_color3 = '';
  public dt_type3 = '';
  public act3 = '';

  public timeline_list = '';
  public q: any;

  public i = -1;

  public serials = [
    14, 41, 13, 36, 25, 41, 27, 36, 34, 43, 37, 29, 8, 17, 34, 38, 16, 45, 20,
    1, 9, 22, 18, 6, 12, 3, 31, 33, 42, 2, 39, 19, 7, 26, 5, 4, 43, 40, 44, 21,
    24, 37, 10, 35, 32, 28, 15, 38, 30, 23, 11,
  ];

  public serial_id = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '02',
    '06',
    '04',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '07',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '08',
    '34',
    '35',
    '36',
    '37',
    '09',
    '38',
    '39',
    '40',
    '41',
    '42',
    '13',
    '43',
    '44',
    '45',
  ];

  public sidenav_margin = '0px';
  public main_margin = '0px';

  public mytime: any;
  public hours = '';
  public min = '';
  public secs = '';
  public day = '';
  public year = '';
  public mon = 0;
  public ym = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  public date_time = '';
  public date_time2 = '';

  constructor(
    private sanitizer: DomSanitizer,
    private location: Location,
    private logger: LoggerService,
    private pistonService: PistonProfileInspectionService,
    private router: Router,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    const userInfo = <UserData>this.route.snapshot.data.UserData;
    this.uid = userInfo.UserId;
    this.uname = userInfo.UserName;
    this.fname = userInfo.FirstName;
    this.lname = userInfo.LastName;
    this.userrole = userInfo.Role;
    this.sessiontoken = userInfo.SessionToken;
    this.ucases = userInfo.Usecases;
    this.checkAccessForUsecase();
    this.intSolutions = commonService.intSolutions;
    this.extSolutions = commonService.extSolutions;

    if (this.intSolutions.length == 0 && this.extSolutions.length == 0) {
      this.commonService.getSolutionList(this.uid).subscribe((data) => {
        data.forEach((a: any) => {
          if (
            this.solutions.findIndex((b) => b.SolutionId === a.SolutionId) > -1
          ) {
            let obj = this.solutions.filter(
              (b) => b.SolutionId === a.SolutionId
            )[0].Usecases;
            let usecObj = <usec>{};
            usecObj.UsecaseId = a.UsecaseId;
            usecObj.UsecaseName = a.UsecaseName;
            usecObj.UsecaseUrl = a.UsecaseUrl;
            obj.push(usecObj);
          } else {
            let solObj = <Sol>{};
            solObj.SolutionId = a.SolutionId;
            solObj.SolutionName = a.SolutionName;
            solObj.SolutionUrl = a.SolutionUrl;
            solObj.SolutionType = a.SolutionType;
            let usecObj = <usec>{};
            usecObj.UsecaseId = a.UsecaseId;
            usecObj.UsecaseName = a.UsecaseName;
            usecObj.UsecaseUrl = a.UsecaseUrl;
            solObj.Usecases = new Array<usec>();
            solObj.Usecases.push(usecObj);
            this.solutions.push(solObj);
          }
        });
        this.intSolutions = this.solutions.filter(
          (a) => a.SolutionType == 'Internal'
        );
        this.extSolutions = this.solutions.filter(
          (a) => a.SolutionType == 'External'
        );
      });
      commonService.intSolutions = this.intSolutions;
      commonService.extSolutions = this.extSolutions;
    }

    //Browser closing on Azure
    window.onbeforeunload = () => {
      this.commonService.logout(this.sessiontoken).subscribe();
    };
  }

  goback(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.logout_timer = environment.logout_timer;
    this.logger.info(this.uname, 'Piston Usecase Page has Opened');
    // Initialize with default values
    this.images = [
      { predclass: ['NA'], processedimgurl: this.defaultImageUrl },
      { predclass: ['NA'], processedimgurl: this.defaultImageUrl },
      { predclass: ['NA'], processedimgurl: this.defaultImageUrl }
    ];
    this.imageIndices = [0, 1, 2];
  }


  piston_start() {
    Swal.fire({
      text: 'Piston Profile Inspection Operation has started',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    this.piston_timer();
    console.log(this.UserID);
    var x = document.getElementById('btnstart') as HTMLButtonElement;
    var y = document.getElementById('btnstop') as HTMLButtonElement;
    x.disabled = true;
    y.disabled = false;
    y.style.backgroundColor = '#343378';
    x.style.backgroundColor = '#0b66bb94';
  }

  piston_stop() {
    Swal.fire({
      text: 'Piston Profile Inspection Operation has stopped',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    clearTimeout(this.timer);
    var x = document.getElementById('btnstart') as HTMLButtonElement;
    var y = document.getElementById('btnstop') as HTMLButtonElement;
    y.disabled = true;
    x.disabled = false;
    x.style.backgroundColor = '#343378';
    y.style.backgroundColor = '#0b66bb94';
  }

  public sch_box_focus() {
    this.sch_focus = true;
    (<HTMLInputElement>document.getElementById('sch_label')).value = 'PI_';
  }

  public sch_box_nfocus() {
    this.sch_focus = false;
  }

  checkAccessForUsecase(): any {
    if (!(this.ucases.indexOf('Piston Profile Inspection') > -1)) {
      this.router.navigate(['/unauthorized']);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (
      event.key == 'Enter' &&
      (this.sch_focus == true ||
        (<HTMLInputElement>document.getElementById('sch_label')).value != '')
    ) {
      this.openModel();
    }
  }

  @HostListener('click', ['$event'])
  onButtonClickHandler(event: KeyboardEvent) {
    if (
      (<HTMLInputElement>document.getElementById('popupModal')).className ==
      'modal fade show'
    ) {
      this.closeModel();
    }
  }

  openModel() {
    var el = <HTMLInputElement>document.getElementById('popupModal');
    el.className = 'modal fade show';
    el.style.display = 'block';
    el.style.paddingRight = '17px';

    this.openpopup();
  }

  closeModel() {
    var el = <HTMLInputElement>document.getElementById('popupModal');
    el.style.display = 'none';
    el.className = 'modal fade';
  }

  public computedt() {
    this.hours = new Date().getHours().toString();
    this.min = new Date().getMinutes().toString();
    this.secs = new Date().getSeconds().toString();
    this.day = new Date().getDate().toString();
    this.mon = new Date().getMonth();
    this.year = new Date().getFullYear().toString();

    if (this.hours.length < 2) {
      this.hours = '0' + this.hours;
    }
    if (this.min.length < 2) {
      this.min = '0' + this.min;
    }
    if (this.secs.length < 2) {
      this.secs = '0' + this.secs;
    }
    if (this.day.length < 2) {
      this.day = '0' + this.day;
    }

    this.date_time =
      this.hours +
      ':' +
      this.min +
      ':' +
      this.secs +
      ', ' +
      this.ym[this.mon] +
      ' ' +
      this.day +
      ', ' +
      this.year;
  }

  public computedt2() {
    this.hours = new Date().getHours().toString();
    this.min = new Date().getMinutes().toString();
    this.secs = new Date().getSeconds().toString();
    this.day = new Date().getDate().toString();
    this.mon = new Date().getMonth();
    this.year = new Date().getFullYear().toString();

    if (this.hours.length < 2) {
      this.hours = '0' + this.hours;
    }
    if (this.min.length < 2) {
      this.min = '0' + this.min;
    }
    if (this.secs.length < 2) {
      this.secs = '0' + this.secs;
    }
    if (this.day.length < 2) {
      this.day = '0' + this.day;
    }

    this.date_time2 =
      this.hours +
      ':' +
      this.min +
      ':' +
      this.secs +
      ', ' +
      this.ym[this.mon] +
      ' ' +
      this.day +
      ', ' +
      this.year;

    this.logout_timer -= 1;

    if (this.logout_timer == 60) {
      Swal.fire({
        text: 'Press any key or click anywhere to continue or you will be logged out in 1 minute',
        showCancelButton: false,

        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok',
      });
    }

    if (this.logout_timer <= 0) {
      this.logger.info(this.uname, 'Logged Out');
      this.commonService.logout(this.sessiontoken).subscribe();
      removeToken();
      this.router.navigate(['login']);
      Swal.fire({
        text: 'You have been logged out, please login again to continue',
        showCancelButton: false,
        showConfirmButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok',
      });
    }
  }

  public openNav() {
    if (this.sidenav_margin != '135px') {
      this.sidenav_margin = '135px';
      this.main_margin = '135px';
    } else {
      this.closeNav();
    }
  }
  public closeNav() {
    this.sidenav_margin = '0px';
    this.main_margin = '0px';
  }

  barChartMethod() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Normal', 'Greasy', 'Damaged', 'Total'],
        datasets: [
          {
            data: [0, 0, 0, 0],
            backgroundColor: ['#4bc0c0', '#ff6384', '#ff9f40', '#36a2eb'],
            // borderColor: [
            //   '#9724F1',
            //   '#69CCBA',
            //   '#5477F6',
            //   '#2643C2'
            // ],
            borderWidth: 1,

            // hoverBackgroundColor: [
            //   '#B85EFF',
            //   '#69CCBA',
            //   '#708EFF',
            //   '#2643C2'
            // ]
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'No. of Pistons',
              },
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 6,
              },
            },
          ],
        },
      },
    });
  }
  pieChartMethod() {
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: ['#4bc0c0', '#ff6384', '#ff9f40'],
            // hoverBackgroundColor: [
            //   '#095908',
            //   '#E93030',
            //   '#E7EB2B'
            // ]
          },
        ],
        labels: ['Accepted', 'Rejected', 'Recheck'],
      },
      options: {
        // title: { display: true, fontSize: 14, text: "Piston Statistics", position: 'right' },
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          position: 'left',
          align: 'end',
          labels: {
            padding: 20,
            fontSize: 13,
          },
        },
      },
    });
  }

  public create_graphs() {
    this.barChartMethod();
    this.pieChartMethod();
  }

  public piston_timer() {
    this.pistonService.getPistonData().subscribe(
      (data) => {
        this.pdata = data;
        console.log(this.pdata);
        this.piston_list = this.pdata;

        this.counter += 1;

        this.i = this.i + 1;

        if (this.i == 0) {
          this.logger.info(this.uname, 'Piston Usecase Started');
          this.barChartMethod();
          this.pieChartMethod();
        }
        this.computedt();
        let sr1 = 0;
        let sr2 = 0;
        let sr3 = 0;

        if (this.i == 0) {
        }

        let n = 0,
          g = 0,
          d = 0;

        let pistontype1 = 'Normal';

        if (this.pdata[this.i]['PistonSetType'] == 'Damaged') {
          d += 1;
        } else if (this.pdata[this.i]['PistonSetType'] == 'Greasy') {
          g += 1;
        } else if (this.pdata[this.i]['PistonSetType'] == 'Normal') {
          n += 1;
        }

        if (d > 0) {
          pistontype1 = 'Damaged';
        } else if (g > 0) {
          pistontype1 = 'Greasy';
        }
        if (this.i == 0) {
          this.cam1 = this.pdata[this.i]['PistonProcessedImagePath'];
        } else if (this.i == 1) {
          this.cam1 = this.pdata[this.i]['PistonProcessedImagePath'];
          this.cam2 = this.pdata[this.i - 1]['PistonProcessedImagePath'];

          this.serial2 = this.serial1;
          this.defect2 = this.defect1;
          this.action2 = this.action1;
          this.action_color2 = this.action_color1;
          this.dt_type2 = this.dt_type1;
          this.act2 = this.act1;
        } else if (this.i >= 2) {
          this.cam1 = this.pdata[this.i]['PistonProcessedImagePath'];
          this.cam2 = this.pdata[this.i - 1]['PistonProcessedImagePath'];
          this.cam3 = this.pdata[this.i - 2]['PistonProcessedImagePath'];

          this.serial3 = this.serial2;
          this.defect3 = this.defect2;
          this.action3 = this.action2;
          this.action_color3 = this.action_color2;
          this.dt_type3 = this.dt_type2;
          this.act3 = this.act2;

          this.serial2 = this.serial1;
          this.defect2 = this.defect1;
          this.action2 = this.action1;
          this.action_color2 = this.action_color1;
          this.dt_type2 = this.dt_type1;
          this.act2 = this.act1;
        }

        this.serial1 = this.pdata[this.i]['PistonSetName'];

        this.status_no = ': 1st Inspection';

        this.srl = this.serial1;

        this.srl_stat = '';
        this.srl_def = '';

        if (pistontype1 == 'Damaged') {
          this.defect1 = 'Damaged';
          this.action1 = 'Rejected';
          this.action_color1 = 'red';
          this.dt_type1 = ': Damaged';
          this.act1 = ': Rejected';

          this.srl_stat = 'Rejected';
          this.srl_def = 'Damaged';
          this.rej = this.rej + 1;
          this.tot = this.tot + 1;
          this.dam = this.dam + 1;
        } else if (pistontype1 == 'Greasy') {
          this.srl_def = 'Greasy';

          this.defect1 = 'Greasy';
          this.action1 = 'Recheck';
          this.action_color1 = '#ff9f40';
          this.dt_type1 = ': Greasy';
          this.act1 = ': Clean and Recheck';

          this.srl_stat = 'Recheck';
          this.rck = this.rck + 1;

          this.tot = this.tot + 1;
          this.grs = this.grs + 1;
        } else if (pistontype1 == 'Normal') {
          this.defect1 = 'Normal';
          this.action1 = 'Accepted';
          this.action_color1 = '#34A300';
          this.dt_type1 = ': Normal';
          this.act1 = ': Accepted';

          this.srl_stat = 'Accepted';
          this.srl_def = 'Normal';
          this.acc = this.acc + 1;
          this.tot = this.tot + 1;
          this.norm = this.norm + 1;
        }

        if (
          this.srl_stat == 'Recheck-Accepted' ||
          this.srl_stat == 'Recheck-Rejected'
        ) {
          this.timeline_child =
            '<li class="event">\
    <div class="card" id ="' +
            this.srl +
            this.srl_stat +
            '"\
    data-toggle="modal" data-target="#popupSearch1"\
    onclick="open_timeline_popup(\'' +
            [
              pistontype1,
              this.srl,
              this.srl_stat,
              this.srl_def,
              this.cam1,
              this.cam2,
              this.cam3,
              this.cam4,
            ] +
            '\')">\
    <div class="card-body" style="padding:0px;"><p style="font-size:14px;">Serial  # <a>' +
            this.srl +
            '</a></p><p style="font-size:12px;margin:1px">' +
            this.srl_stat +
            '</p></div></div></li>';
        } else {
          this.timeline_child =
            '<li class="event">\
    <div class="card" id ="' +
            this.srl +
            this.srl_stat +
            '"\
    data-toggle="modal" data-target="#popupSearch1"\
    onclick="open_timeline_popup(\'' +
            [
              pistontype1,
              this.srl,
              this.srl_stat,
              this.srl_def,
              this.cam1,
              this.cam2,
              this.cam3,
              this.cam4,
            ] +
            '\')">\
    <div class="card-body" style="padding:0px;"><p style="font-size:14px;">Serial  # <a>' +
            this.srl +
            '</a></p><p style="font-size:14px;">' +
            this.srl_stat +
            '</p></div></div></li>';
        }

        let p = <HTMLUListElement>document.getElementById('tmline');

        if (p.innerHTML != null) {
          let x = p.innerHTML;
          p.innerHTML = this.timeline_child;
          p.innerHTML += x;
        }

        this.pieChart.data.datasets[0].data[0] = this.acc;
        this.pieChart.data.datasets[0].data[1] = this.rej;
        this.pieChart.data.datasets[0].data[2] = this.rck;
        this.pieChart.update();

        this.barChart.data.datasets[0].data[0] = this.norm;
        this.barChart.data.datasets[0].data[1] = this.grs;
        this.barChart.data.datasets[0].data[2] = this.dam;
        this.barChart.data.datasets[0].data[3] = this.tot;
        this.barChart.update();

        if (this.counter < this.pdata.length) {
          this.timer = setTimeout(() => {
            this.piston_timer();
          }, 5000);
        }
      },
      (error: any) => {
        this.logger.error(
          this.uname,
          'Piston API is not Working. Error: ' + JSON.stringify(error)
        );
      }
    );
  }

  public openpopup() {
    this.search_string = (<HTMLInputElement>(
      document.getElementById('sch_label')
    )).value;
    if (/[P][I][_][0-9]/.test(this.search_string) == true) {
      if (this.search_string.slice(0, 3) == 'PI_') {
        this.piston_id = this.search_string.slice(3);
        if (
          parseInt(this.piston_id) > 0 &&
          parseInt(this.piston_id) <= this.i + 1
        ) {
          this.sch_serial = this.search_string;
          let sid = this.piston_id;
          let pid = parseInt(this.piston_id) - 1;

          this.logger.info(
            this.uname,
            'Piston No. ' + this.search_string + ' is searched'
          );
          let n = 0,
            g = 0,
            d = 0;

          let pistontype = 'Normal';

          for (let j = pid; j < pid + 1; j++) {
            if (this.pdata[j]['PistonSetType'] == 'Damaged') {
              d += 1;
            } else if (this.pdata[j]['PistonSetType'] == 'Greasy') {
              g += 1;
            } else if (this.pdata[j]['PistonSetType'] == 'Normal') {
              n += 1;
            }
          }

          if (d > 0) {
            pistontype = 'Damaged';
          } else if (g > 0) {
            pistontype = 'Greasy';
          }

          this.cam1p = this.pdata[pid]['PistonProcessedImagePath'];
          this.cam2p = this.pdata[pid + 1]['PistonProcessedImagePath'];
          this.cam3p = this.pdata[pid + 2]['PistonProcessedImagePath'];
          this.cam4p = this.pdata[pid + 3]['PistonProcessedImagePath'];

          if (pistontype == 'Damaged') {
            this.sch_defect = 'Damaged';
            this.sch_acc = 'Rejected';
            this.sch_acc_color = 'red';
          } else if (pistontype == 'Greasy') {
            this.sch_defect = 'Greasy';
            this.sch_acc = 'Recheck';
            this.sch_acc_color = '#ff9f40';
          }

          if (pistontype == 'Normal') {
            this.sch_defect = 'Normal';
            this.sch_acc = 'Accepted';
            this.sch_acc_color = '#29FC08';
          }

          this.pop_disp = 'block';
        } else {
          window.alert(
            'Piston with Serial ' +
              this.search_string +
              ' is not available till now'
          );
          this.pop_disp = 'none';
        }
      } else {
        window.alert(
          'Invalid Serial Number, Please Enter in correct Format e.g. PI_<Number>'
        );
        this.pop_disp = 'none';
      }
    } else {
      window.alert(
        'Invalid Serial Number, Please Enter in correct Format e.g. PI_<Number>'
      );
      this.pop_disp = 'none';
    }
  }

  public info_pop() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        closeButton: 'swal-cross',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons.fire({
      html: '\
    <img src=".\\assets\\img\\pop_piston.png" alt="Pop-up-Piston" style="width:966px;height: 500px;">\
    ',
      showClass: {
        popup: 'animated fadeIn',
        icon: 'animated heartBeat delay-1s',
      },
      hideClass: {
        popup: 'animated fadeOut',
      },
      confirmButtonColor: '#3085d6',
      showCloseButton: true,
      showConfirmButton: false,
      width: 1100,
    });
  }

  public timeline_click() {
    this.logger.info(this.uname, 'Timeline is clicked');
  }

  public consts_show() {
    var x = document.getElementById('passw') as HTMLDivElement;
    x.style.display = 'block';
  }
  public consts_hide() {
    var x = document.getElementById('passw') as HTMLDivElement;

    x.style.display = 'none';
  }

  @HostListener('document:keyup', ['$event'])
  onKeyupHandler(event: KeyboardEvent) {
    this.logout_timer = environment.logout_timer;
  }

  @HostListener('document:click', ['$event'])
  onClickHandler(event: MouseEvent) {
    this.logout_timer = environment.logout_timer;
  }

  // images: { url: string; predclass: string[] }[] = [];

  // Variables for displaying images and statuses
  imageUrls: string[] = [
    './assets/img/nopreview.png',
    './assets/img/nopreview.png',
    './assets/img/nopreview.png',
  ];
  images: Image[] = [];
  imageIndices = [0, 1, 2]; // Display three images at a time
  latestResponse: Image[] = [];
  private apiSubscription: Subscription | null = null;
  private apiCallInterval: Subscription | null = null;
  private rotationInterval: any;
  selectedImageIndex: number | null = null;
 
  defaultImageUrl = './assets/img/nopreview.png'; // Provide the path to your default image

  startPiston() {
    const apiUrl = environment.API_URL + '/pistonnew/pistoncheck';
    const payload = { sym: '' };

    this.http.post<any>(apiUrl, { '': '' }).subscribe(
      (response) => {
        console.log('Response from startPiston:', response);
        this.startApiCalls();
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  startPolling() {
    const apiUrl = environment.API_URL + 'pistonnew/getresults';
    this.apiSubscription = this.http.post<any[]>(apiUrl, {"":""}).subscribe(
      data => {
        this.latestResponse = data; // Update the latest response
        if (data.length > 0) {
          this.images = [...data]; // Update images
          if (!this.rotationInterval) {
            this.startRotation(); // Start rotation if not already started
          }
        } else {
          // Handle empty response
          this.images = [
            { predclass: ['NA'], processedimgurl: this.defaultImageUrl },
            { predclass: ['NA'], processedimgurl: this.defaultImageUrl },
            { predclass: ['NA'], processedimgurl: this.defaultImageUrl }
          ];
        }
      },
      error => {
        console.error('Error fetching images:', error);
        this.images = [
          { predclass: ['NA'], processedimgurl: this.defaultImageUrl },
          { predclass: ['NA'], processedimgurl: this.defaultImageUrl },
          { predclass: ['NA'], processedimgurl: this.defaultImageUrl }
        ];
      }
    );
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
 
  startApiCalls(): void {
    this.apiCallInterval = interval(1000).subscribe(() => {
      this.startPolling();
    });
  }
  startRotation(): void {
    let currentIndex = 0;
    this.rotationInterval = setInterval(() => {
      if (this.latestResponse.length > 0) {
        this.updateImageIndices(currentIndex);
        currentIndex = (currentIndex + 1) % this.latestResponse.length;
      }
    }, 3000); // Change image every 3 seconds
  }
 
  stopApiCalls(): void {
    this.cleanup();
    if (this.selectedImageIndex !== null) {
      this.updateImageIndices(this.selectedImageIndex); // Show selected image
    }
  }
 
  clearImages(): void {
    this.latestResponse = [];
    this.images = [
      { predclass: ['NA'], processedimgurl: this.defaultImageUrl },
      { predclass: ['NA'], processedimgurl: this.defaultImageUrl },
      { predclass: ['NA'], processedimgurl: this.defaultImageUrl }
    ];
    this.imageIndices = [0, 1, 2];
    this.selectedImageIndex = null;
    const apiUrl = environment.API_URL + '/pistonnew/clear';
    const payload = { sym: '' };

    this.http.post<any>(apiUrl, { '': '' }).subscribe(
      (response) => {
        console.log('Response from startPiston:', response);
        // this.startApiCalls();
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
 
  cleanup(): void {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
      this.rotationInterval = null; // Clear the interval
    }
    if (this.apiCallInterval) {
      this.apiCallInterval.unsubscribe(); // Stop API calls
      this.apiCallInterval = null; // Clear the subscription
    }
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe(); // Cancel the ongoing API call
      this.apiSubscription = null; // Clear the subscription
    }
  }
 
  updateImageIndices(index: number): void {
    this.imageIndices = [index, (index + 1) % this.latestResponse.length, (index + 2) % this.latestResponse.length];
  }
 
  logDisplayedImages(): void {
    if (this.latestResponse[this.imageIndices[0]]) {
      const imgUrl = this.latestResponse[this.imageIndices[0]].processedimgurl;
      console.log('Displayed Image URL:', imgUrl);
    } else {
      console.error('No image found at index', this.imageIndices[0]);
    }
  }
 
  getStatus(predclass?: string[]): string {
    if (predclass && predclass.includes('Greasy')) {
      return 'Rejected';
    }
    return 'Accepted';
  }
 
  getStatusColor(status: string): string {
    switch (status) {
      case 'Rejected':
        return 'red';
      case 'Accepted':
        return 'green';
      default:
        return 'gray';
    }
  }
 
  selectImage(index: number): void {
    this.selectedImageIndex = index;
    this.updateImageIndices(index); // Display the selected image in all slots
    this.logDisplayedImages(); // Log the URL of the selected image
    this.cleanup(); // Stop API calls and rotation
  }
 
  getPredClass(index: number): string {
    const predclass = this.latestResponse[index]?.predclass || ['NA'];
    return predclass.includes('Greasy') ? 'Greasy' : 'NA';
  }
  
  getImageUrl(index: number): string {
    return this.latestResponse[index]?.processedimgurl || this.defaultImageUrl;
  }
}