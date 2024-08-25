import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as Chart from 'chart.js';
import {
  ELEMENT_DATA,
  PeriodicElement,
  Sol,
  usec,
  UserData,
} from 'src/app/model/model';
import { removeToken } from 'src/app/model/user';
import { ChangePwdService } from 'src/app/services/change-pwd.service';
import { CommonService } from 'src/app/services/common.service';
import { LoggerService } from 'src/app/services/logger.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HomeService } from '../home/home.service';
import { TranslationService } from 'src/app/services/translation.service';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/miscellaneous/copper/language.service';
import { Language } from 'src/app/miscellaneous/copper/language.enum';

declare var translateToJapanese: any;
declare var translateToEnglish: any;
declare var translateToKoraen: any;
declare var translateToGerman: any;
declare var translateToSwedish: any;
declare var translateToItalian: any;




declare const google: {
  translate: {
    TranslateElement: any;
  };
};

@Component({
  selector: 'app-page-base',
  templateUrl: './page-base.component.html',
  styleUrls: ['./page-base.component.scss'],
})
export class PageBaseComponent implements OnInit {
 
  public uid: number = 0;
  public uname: string = '';
  public fname: string = '';
  public lname: string = '';
  public userrole: string = '';
  public sessiontoken: string = '';

  public d1: any;
  public d2: any;
  public d3: any;
  public d4: any;
  public d5: any;
  public d6: any;
  public milling_url: string = '';
  public wp_url: string = '';
  public rca_url: string = '';
  public piston_url: string = '';
  public eqp_url: string = '';
  public home_url: string = '';
  public steel_url: string = '';
  public vision_url: string = '';
  public predictive_url: string = '';
  public remote_url: string = '';
  public help_url: string = '';
  public contact_url: string = '';

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
  public only_time = '';

  intSolutions: any = [];
  extSolutions: any = [];
  solutions = new Array<Sol>();

  displayedColumns: string[] = [
    'tasks',
    'machineid',
    'parts',
    'action',
    'datetime',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  selectedLanguage = 'en';

  refreshEventSubscription: Subscription;

  public bar_dial: any;
  public pieChart1: any;
  public pieChart2: any;
  public pieChart3: any;
  public pieChart4: any;
  public usecasesSuppluChain: any = [];

  public logout_timer: any;
  public usecases: any = [];
  usecaseIdsToSupply: number[] = [1,2,3,5];

  constructor(
    private router: Router,
    private commonService: CommonService,
    private route: ActivatedRoute,
    public changePwdService: ChangePwdService,
    private logger: LoggerService,
    private cdr: ChangeDetectorRef,
    private translationService: TranslationService,
    private languageService: LanguageService
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

        const sortedArray = this.intSolutions;

        // Sort the array in descending order based on SolutionId
        sortedArray.sort(
          (a: { SolutionId: string; }, b: { SolutionId: string; }) => parseInt(a.SolutionId) - parseInt(b.SolutionId)
        )

        this.intSolutions=sortedArray


        commonService.intSolutions = this.intSolutions;
        commonService.extSolutions = this.extSolutions;
        
        console.log('$$', this.usecasesSuppluChain);
      });
    }

    this.commonService.getSolutionList(this.uid,).subscribe((data) => {
      this.usecases = data.sort((a: { Enabled: string }, b: any) => {
        return a.Enabled === 'Y' ;
      });
      console.log(this.intSolutions,"usecase")
       this.usecasesSuppluChain = this.usecases.filter((usecase: { UsecaseId: number; }) => this.usecaseIdsToSupply.includes(usecase.UsecaseId));
    
    });


    //Browser closing on Azure
    window.onbeforeunload = () => {
      this.commonService.logout(this.sessiontoken).subscribe();
    };
  }

  ngOnInit(): void {
    this.logout_timer = environment.logout_timer;
    this.mytime = setInterval(() => {
      this.computedt();
    }, 1000);
    this.home_url = environment.home_url;
    this.help_url = environment.help_url;
    this.contact_url = environment.contact_url;

    this.d1 = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString(
      'en-us',
      { month: 'short', year: 'numeric', day: 'numeric' }
    );
    this.d2 = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(
      'en-us',
      { month: 'short', year: 'numeric', day: 'numeric' }
    );
    this.d3 = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString(
      'en-us',
      { month: 'short', year: 'numeric', day: 'numeric' }
    );
    this.d4 = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleString(
      'en-us',
      { month: 'short', year: 'numeric', day: 'numeric' }
    );
    this.d5 = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleString(
      'en-us',
      { month: 'short', year: 'numeric', day: 'numeric' }
    );
    this.d6 = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleString(
      'en-us',
      { month: 'short', year: 'numeric', day: 'numeric' }
    );

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

    const activeLanguage = this.selectedLanguage;
    console.log(activeLanguage,"lang")
    
    // Define translations for the various labels and titles
   
    const translations: { [key: string]: { [key: string]: string } } = {
        'Total machines under breakdown': {
            'ja': '故障中のマシンの合計',
            'ko': '고장 중인 기계의 총 수',
            'de': 'Gesamtzahl der Maschinen im Ausfall',
            'sv': 'Totalt antal maskiner under nedbrytning',
            'it': 'Numero totale di macchine in guasto',
            'en': 'Total machines under breakdown'
        },
        'Total machines working normally': {
            'ja': '正常に動作しているマシンの合計数',
            'ko': '정상적으로 작동하는 총 기계',
            'de': 'Gesamtzahl der normal arbeitenden Maschinen',
            'sv': 'Totalt antal maskiner som fungerar normalt',
            'it': 'Totale macchine funzionanti normalmente',
            'en': 'Total machines working normally'
        },
        'Machines Health Statistics': {
            'ja': 'マシンの正常性統計',
            'ko': '차트 컴퓨터 상태 통계',
            'de': 'Statistiken zum Maschinenzustand',
            'sv': 'Statistik om maskinernas hälsa',
            'it': 'Statistiche sull integrità delle macchine',
            'en': 'Machines Health Statistics'
        },
        'Time': {
            'ja': '時間',
            'ko': '시간',
            'de': 'Zeit',
            'sv': 'Tid',
            'it': 'Tempo',
            'en': 'Time'
        },
        'Frequency': {
            'ja': '周波数',
            'ko': '빈도',
            'de': 'Frequenz',
            'sv': 'Frekvens',
            'it': 'Frequenza',
            'en': 'Frequency'
        }
    };
 
    // Helper function to get translated text
    const getTranslatedLabel = (labelKey: string) => {
        return translations[labelKey][activeLanguage] || labelKey;
    };

    const lableTime=getTranslatedLabel('Time') as string
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
            label:getTranslatedLabel('Total machines working normally')
          },
          {
            data: [0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0],
            backgroundColor: ['#f8bdcc'],
            borderColor: ['#fc95ac'],
            borderWidth: 2,
            label:getTranslatedLabel('Total machines under breakdown')
          },
        ],
      },
      options: {
        title: {
          display: true,
          text:getTranslatedLabel('Machines Health Statistics'),
          fontSize: 15,
        },
        legend: { display: true },
        scales: {
          yAxes: [
            {
              gridLines: { display: false },
              scaleLabel: {
                display: true,
                labelString:getTranslatedLabel('Frequency'),
                    
              },
              ticks: { display: true, maxTicksLimit: 3 },
            },
          ],
          xAxes: [
            {
              gridLines: { display: false },
              scaleLabel: {
                display: true,
                labelString:getTranslatedLabel('Time'),
              },
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

  public change_pwd() {
    var curr_pwd = (document.getElementById('currPW') as HTMLInputElement)
      .value;

    var new_pwd = (document.getElementById('newPW') as HTMLInputElement).value;

    this.changePwdService
      .verifyCurrPwd(this.uname, curr_pwd, new_pwd)
      .subscribe(
        (res: any) => {
          if (res == 'success') {
            Swal.fire({
              text: 'Password Changed Successfully',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
            });

            this.logger.info(this.uname, 'Password Changed');
          } else {
            Swal.fire({
              text: 'Wrong Current Password Entered',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
            });
          }
        },
        (error: any) => {
          Swal.fire({
            text: 'Wrong Current Password Entered',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok',
          });
        }
      );
  }

  public consts_show() {
    var x = document.getElementById('passw') as HTMLDivElement;
    x.style.display = 'block';
  }
  public consts_hide() {
    var x = document.getElementById('passw') as HTMLDivElement;
    x.style.display = 'none';
  }
  public check_new_pwd() {
    var new_pwd = (document.getElementById('newPW') as HTMLInputElement).value;
    var len = document.getElementById('length') as HTMLElement;
    var cap = document.getElementById('capital') as HTMLElement;
    var num = document.getElementById('number') as HTMLElement;
    var spc = document.getElementById('spec') as HTMLElement;

    var curr_pwd = (document.getElementById('currPW') as HTMLInputElement)
      .value;
    var conf_pwd = (document.getElementById('confPW') as HTMLInputElement)
      .value;

    var currshow_user_input_error = document.getElementById(
      'currshow_user_input_error'
    ) as HTMLDivElement;
    var newshow_user_input_error = document.getElementById(
      'newshow_user_input_error'
    ) as HTMLDivElement;
    var cnfmshow_user_input_error = document.getElementById(
      'cnfmshow_user_input_error'
    ) as HTMLDivElement;

    if (/[A-Z]/.test(new_pwd) == true) {
      cap.style.color = 'green';
    } else {
      cap.style.color = '#f04b4b';
      newshow_user_input_error.style.display = 'block';
      newshow_user_input_error.innerHTML =
        'At least one capital letter required';
    }
    if (/[0-9]/.test(new_pwd) == true) {
      num.style.color = 'green';
    } else {
      newshow_user_input_error.style.display = 'block';
      newshow_user_input_error.innerHTML =
        'At least one numeric value required';
      num.style.color = '#f04b4b';
    }
    var format = new RegExp(/[~!@#\$;%\^&.\*\-\=]/);
    if (format.test(new_pwd)) {
      spc.style.color = 'green';
    } else {
      newshow_user_input_error.style.display = 'block';
      newshow_user_input_error.innerHTML =
        'At least one special character required';
      newshow_user_input_error.style.display;
      spc.style.color = '#f04b4b';
    }
    if (new_pwd.length >= 8 && new_pwd.length <= 15) {
      len.style.color = 'green';
    } else {
      newshow_user_input_error.style.display = 'block';
      newshow_user_input_error.innerHTML = 'Should have 8 - 15 characters';
      len.style.color = '#f04b4b';
    }
    if (
      len.style.color == 'green' &&
      cap.style.color == 'green' &&
      num.style.color == 'green' &&
      spc.style.color == 'green'
    ) {
      newshow_user_input_error.style.display = 'none';
    }

    var sub_but = document.getElementById(
      'change_pwd_submit'
    ) as HTMLButtonElement;

    if (curr_pwd == '') {
      currshow_user_input_error.style.display = 'block';
      currshow_user_input_error.innerHTML =
        'Please enter your current password';
    } else {
      currshow_user_input_error.style.display = 'none';
    }

    if (conf_pwd == '') {
      cnfmshow_user_input_error.style.display = 'block';
      cnfmshow_user_input_error.innerHTML = 'Please confirm new password';
    } else if (conf_pwd != new_pwd) {
      cnfmshow_user_input_error.style.display = 'block';
      cnfmshow_user_input_error.innerHTML = "Password doesn't match";
    } else {
      cnfmshow_user_input_error.style.display = 'none';
    }

    if (curr_pwd != '' && new_pwd != '' && conf_pwd != '') {
      if (
        len.style.color == 'green' &&
        cap.style.color == 'green' &&
        num.style.color == 'green' &&
        spc.style.color == 'green'
      ) {
        if (conf_pwd == new_pwd) {
          sub_but.disabled = false;
        } else {
          sub_but.disabled = true;
        }
      } else {
        sub_but.disabled = true;
      }
    } else {
      sub_but.disabled = true;
    }
  }

  click_logout() {
    Swal.fire({
      text: 'Are you sure you want to logout?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.logger.info(this.uname, 'Logged Out');
        this.commonService.logout(this.sessiontoken).subscribe();
        removeToken();
        this.router.navigate(['login']);
      }
    });
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
      ' - ' +
      this.ym[this.mon] +
      ' ' +
      this.day +
      ', ' +
      this.year;
    this.only_time = this.hours + ':' + this.min + ':' + this.secs;

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
      this.logger.info(this.uname, 'Logged out');
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


  onLanguageChange1(language: Language): void {
    this.languageService.setLanguage(language);
   
  }

  onLanguageChange() {
    if (this.selectedLanguage === 'ja') {
      translateToJapanese();
      translateToEnglish();
      translateToJapanese();
      this.translationService.setActiveLanguage('ja');
      this.graph_setup();
    } else if (this.selectedLanguage === 'ko'){
      translateToKoraen(); 
      translateToEnglish()   
      translateToKoraen() 
      this.translationService.setActiveLanguage('ko');
    }else if (this.selectedLanguage === 'de'){
      translateToGerman(); 
      translateToEnglish()   
      translateToGerman() 
      this.translationService.setActiveLanguage('de');
    }else if (this.selectedLanguage === 'sv'){
      translateToSwedish(); 
      translateToEnglish()   
      translateToSwedish() 
      this.translationService.setActiveLanguage('sv');
    }
    else if (this.selectedLanguage === 'it'){
      translateToItalian(); 
      translateToEnglish()   
      translateToItalian() 
      this.translationService.setActiveLanguage('it');
    }else if (this.selectedLanguage === 'en') {
      translateToEnglish();
      this.translationService.setActiveLanguage('en');
    }
    this.graph_setup();
    this.cdr.detectChanges();
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
      <div style="font-family: Inter; font-size: 20px;font-weight: 500;line-height: 24px;">Smart Factory Building Blocks</div><div id="carouselExampleControls" class="carousel slide" data-ride="carousel"> <div class="carousel-inner"> <div class="carousel-item active"> <img class="d-block w-100" src=".\\assets\\img\\Popup.png" alt="AcousticsSetup" style="width:100%;height: 100%;" alt="First slide"> </div> \
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
      width: "95%",
      
    });
  }
}
