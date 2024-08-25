import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Chart } from 'chart.js';
import { LoggerService } from 'src/app/services/logger.service';
import { ChangePwdService } from 'src/app/services/change-pwd.service';
import { HomeService } from './home.service';
import {
  ELEMENT_DATA,
  PeriodicElement,
  Sol,
  usec,
  UserData,
} from 'src/app/model/model';
import { CommonService } from 'src/app/services/common.service';
import '../../../assets/bootstrap.css'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public uid: number = 0;
  public uname: string = '';
  public fname: string = '';
  public lname: string = '';
  public userrole: string = '';
  public sessiontoken: string = '';

  intSolutions: any = [];
  extSolutions: any = [];
  solutions = new Array<Sol>();
  newsolutionid:any=[]

  displayedColumns: string[] = [
    'tasks',
    'machineid',
    'parts',
    'action',
    'datetime',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  public bar_dial: any;
  public pieChart1: any;
  public pieChart2: any;
  public pieChart3: any;
  public pieChart4: any;

  public logout_timer: any;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private route: ActivatedRoute,
    public changePwdService: ChangePwdService,
    private logger: LoggerService
  ) {
    const userInfo = <UserData>this.route.snapshot.data.UserData;
    this.uid = userInfo.UserId;
    this.uname = userInfo.UserName;
    this.fname = userInfo.FirstName;
    this.lname = userInfo.LastName;
    this.userrole = userInfo.Role;
    this.sessiontoken = userInfo.SessionToken;
    console.log('SessionToken:' + this.sessiontoken);

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
            if (solObj.SolutionId == 1) {
              solObj.solutionIcon = '.\\assets\\solution\\vision.png';
            }
            if (solObj.SolutionId == 2) {
              solObj.solutionIcon = '.\\assets\\solution\\predictive.png';
            }
            if (solObj.SolutionId == 3) {
              solObj.solutionIcon = '.\\assets\\solution\\remote.png';
            }
            if (solObj.SolutionId == 5) {
              solObj.solutionIcon = '.\\assets\\solution\\ai.png';
            }

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

        const listUsecases = [
          'Computer Vision Use Cases',
          'Condition Monitoring of Assets',
          'Remote Control of Operations',
          'GenAI Usecases',
        ];
        const sortedArray = [...commonService.intSolutions];

        // Sort the array in descending order based on SolutionId
        sortedArray.sort(
          (a, b) => parseInt(a.SolutionId) - parseInt(b.SolutionId)
        )

        this.intSolutions=sortedArray

        this.newsolutionid=sortedArray

        // Log the sorted array to the console
        console.log(sortedArray);

        // commonService.intSolutions = this.intSolutions;
        commonService.extSolutions = this.extSolutions;
        // console.log('$$', this.intSolutions);
      });
    }

    //Browser closing on Azure
    window.onbeforeunload = () => {
      this.commonService.logout(this.sessiontoken).subscribe();
    };
  }
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.logout_timer = environment.logout_timer;
    setTimeout(() => {
      this.logger.info(this.uname, 'Home Screen Has Opened');
    }, 100);
    this.graph_setup();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  @HostListener('document:keyup', ['$event'])
  onKeyupHandler(event: KeyboardEvent) {
    this.logout_timer = environment.logout_timer;
  }

  @HostListener('document:click', ['$event'])
  onClickHandler(event: MouseEvent) {
    this.logout_timer = environment.logout_timer;
  }

  public graph_setup() {
    this.bar_dial = new Chart('BarDial', {
      type: 'line',
      data: {
        labels: [
          '10:00',
          '11:00',
          '12:00',
          '13:00',
          '14:00',
          '15:00',
          '16:00',
          '17:00',
          '18:00',
          '19:00',
          '20:00',
          '21:00',
        ],
        datasets: [
          {
            data: [1, 2, 4, 5, 10, 12, 16, 16, 16, 16, 16, 16],
            backgroundColor: ['#aad8f7'],
            borderColor: ['#64b7ef'],
            borderWidth: 2,
            label: 'Total machines working normally',
          },
          {
            data: [0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0],
            backgroundColor: ['#f8bdcc'],
            borderColor: ['#fc95ac'],
            borderWidth: 2,
            label: 'Total machines under breakdown',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        title: {
          display: true,
          text: 'Machines Health Statistics',
          fontSize: 15,
        },
        legend: { display: true },
        scales: {
          yAxes: [
            {
              gridLines: { display: false },
              scaleLabel: { display: true, labelString: 'Frequency' },
              ticks: { display: true, maxTicksLimit: 3 },
            },
          ],
          xAxes: [
            {
              gridLines: { display: false },
              scaleLabel: { display: true, labelString: 'Time' },
              ticks: { display: true },
            },
          ],
        },
      },
    });

    this.pieChart1 = new Chart('piecanvas1', {
      type: 'pie',
      data: {
        datasets: [
          {
            data: [0],
            backgroundColor: ['#24AF0D'],
            // hoverBackgroundColor: ['#095908']
          },
        ],
        labels: ['Safety Incidents'],
      },
      options: {
        // title: { display: true, fontSize: 14, text: "Piston Statistics" },
        maintainAspectRatio: false,
        responsive: true,
        legend: { display: false, position: 'left', align: 'end' },
        tooltips: { enabled: false },
      },
    });

    this.pieChart2 = new Chart('piecanvas2', {
      type: 'pie',
      data: {
        datasets: [
          {
            data: [3, 27],
            backgroundColor: ['#E57A7A', '#aad8f7'],
            // hoverBackgroundColor: ['#E93030','#E7EB2B']
          },
        ],
        labels: ['Critical', 'Normal'],
      },
      options: {
        // title: { display: true, fontSize: 14, text: "Piston Statistics" },
        maintainAspectRatio: false,
        responsive: true,
        legend: { display: false, position: 'left', align: 'end' },
        tooltips: { enabled: false },
      },
    });

    this.pieChart3 = new Chart('piecanvas3', {
      type: 'pie',
      data: {
        datasets: [
          {
            data: [11, 19],
            backgroundColor: ['#E57A7A', '#aad8f7'],
            // hoverBackgroundColor: ['#E93030','#E7EB2B']
          },
        ],
        labels: ['Critical', 'Normal'],
      },
      options: {
        // title: { display: true, fontSize: 14, text: "Piston Statistics" },
        maintainAspectRatio: false,
        responsive: true,
        legend: { display: false, position: 'left', align: 'end' },
        tooltips: { enabled: false },
      },
    });

    this.pieChart4 = new Chart('piecanvas4', {
      type: 'pie',
      data: {
        datasets: [
          {
            data: [16, 14],
            backgroundColor: ['#E57A7A', '#aad8f7'],
            // hoverBackgroundColor: ['#E93030','#E7EB2B']
          },
        ],
        labels: ['Critical', 'Normal'],
      },
      options: {
        // title: { display: true, fontSize: 14, text: "Piston Statistics" },
        maintainAspectRatio: false,
        responsive: true,
        legend: { display: false, position: 'left', align: 'end' },
        tooltips: { enabled: false },
      },
    });
  }
}
