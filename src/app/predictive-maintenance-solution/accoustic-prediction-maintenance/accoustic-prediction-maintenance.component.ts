import {
  Component,
  ViewEncapsulation,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Location } from '@angular/common';
import { Sol, usec, UserData } from 'src/app/model/model';
import { LoggerService } from 'src/app/services/logger.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { AccousticPredictionMaintenanceService } from './accoustic-prediction-maintenance.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-accoustic-prediction-maintenance',
  templateUrl: './accoustic-prediction-maintenance.component.html',
  styleUrls: ['./accoustic-prediction-maintenance.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AccousticPredictionMaintenanceComponent implements OnInit {
  public ssi_graph: any;
  public uname: string = '';
  public fname: string = '';
  public lname: string = '';
  public userrole: string = '';
  public sessiontoken: string = '';
  public uid: number = 0;
  public logout_timer: any;
  public demo: any;

  intSolutions: any = [];
  extSolutions: any = [];
  solutions = new Array<Sol>();
  public ucases: any = [];

  timer: any;

  public checkin: any;
  public model_data_arr_index = 0;
  public urlpatharr: string[] = [];
  public melspecpatharr: string[] = [];
  public amppatharr: string[] = [];
  public faulttypearr: string[] = [];
  public accuracyarr: number[] = [];
  public index = 0;
  public timeline_child1: any;
  public playtimer: any;
  public obv = '';
  public obvtimeline = '';

  public serialcnt = 1;

  public graph = undefined;
  public wavenum = 0;
  public audio_src = '';
  public audio_proc_num = 0;
  public audio_file_name = '';
  public melspec_img = '.\\assets\\solution\\white-bg.png';
  public amp_img = '.\\assets\\solution\\white-bg.png';

  public graphindex: any;
  public serial_graphindex: any;
  public openpop = false;
  public labelarr: Array<Number> = [0];

  public fault_dial_valve: any;
  public fault_dial_pump: any;
  public fault_dial_fan: any;
  public fault_dial_slider: any;
  public accou_bar_dial: any;

  public nocolor = 'SlateGray';
  public redcolor = '#f8bdcc';
  public redbordercolor = 'red';
  public greencolor = '#a3efc6'; //#DBFEDA'  //'#4bc0c085' //
  public greenbordercolor = '#29FC08';
  public threshold = 80;

  public m_real = 0;
  public urlpatharr_real: string[] = [];
  public melspecpatharr_real: string[] = [];
  public amppatharr_real: string[] = [];
  public faulttypearr_real: string[] = [];
  public accuracyarr_real: number[] = [];
  public index_real = 0;
  public playtimer_real: any;
  public prevlen = 0;

  constructor(
    private logger: LoggerService,
    private location: Location,
    private acousticService: AccousticPredictionMaintenanceService,
    private router: Router,
    private route: ActivatedRoute,
    private boostService: CommonService
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
    this.boostService.getSolutionList(this.uid).subscribe((data: any[]) => {
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
  }

  ngOnInit(): void {
    this.logout_timer = environment.logout_timer;
    // Deleting from REAL Table
    this.acousticService.deleteAcousticRealData().subscribe((data: any) => {});
    this.getreal();

    this.dial_setup();
  }

  ngOnDestroy() {
    clearTimeout(this.playtimer);
  }

  goback(): void {
    this.location.back();
  }

  checkAccessForUsecase(): any {
    if (!(this.ucases.indexOf('Acoustics Based Predictive Maintenance') > -1)) {
      this.router.navigate(['/unauthorized']);
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
      <div id="carouselExampleControls" class="carousel slide" data-ride="carousel"> <div class="carousel-inner"> <div class="carousel-item active"> <img class="d-block w-100" src=".\\assets\\img\\popup_acou.png" alt="AcousticsSetup" style="width:950px;height: 500px;" alt="First slide"> </div> <div class="carousel-item"> <img class="d-block " src=".\\assets\\wavplot\\acc.png" alt="AcousticsSetup" style="width:900px;height: 500px; margin-left: 85px; " alt="Second slide"> </div>  </div> <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev"> <span class="carousel-control-prev-icon" style="filter: invert(1);"aria-hidden="true"></span> <span class="sr-only">Previous</span> </a> <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next"> <span class="carousel-control-next-icon" style="filter: invert(1);" aria-hidden="true"></span> <span style="filter: invert(1)" class="sr-only">Next</span> </a></div>\
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

  public consts_show() {
    var x = document.getElementById('passw') as HTMLDivElement;
    x.style.display = 'block';
  }
  public consts_hide() {
    var x = document.getElementById('passw') as HTMLDivElement;

    x.style.display = 'none';
  }

  //// Reserve Table input stored in arrays
  getreserve() {
    var x = document.getElementById('start_acou') as HTMLButtonElement;
    x.disabled = true;
    x.style.backgroundColor = '#0b66bb94';

    this.model_data_arr_index = 0;
    // console.log("inside getreserve")
    // this.httpClient.get('http://localhost:8080/acoustic/acousticReserve')
    this.acousticService
      .getAcousticReserveData()
      // this.acousticService.getAcousticRealData()
      .subscribe((data: any) => {
        this.checkin = data;
        // console.log('getreserve checkin', this.checkin)

        let recvprocessedlist = this.checkin['processedlist'];

        let lenrecvlist = recvprocessedlist.length;

        for (var i = 0; i < lenrecvlist; i++) {
          let parsedjsonobj = JSON.parse(recvprocessedlist[i]);

          // console.log('For:', i, 'recvprocessedlist[i]')
          // console.log('For:', i, parsedjsonobj.AudioFilePath)
          this.urlpatharr[this.model_data_arr_index] =
            parsedjsonobj.AudioFilePath;
          this.melspecpatharr[this.model_data_arr_index] =
            parsedjsonobj.MelSpectogramImagePath;
          this.amppatharr[this.model_data_arr_index] =
            parsedjsonobj.AmplitudeImagePath;
          this.faulttypearr[this.model_data_arr_index] =
            parsedjsonobj.Inference;
          this.accuracyarr[this.model_data_arr_index] =
            parsedjsonobj.Confidence;
          this.model_data_arr_index++;
        }
      });
  }

  playreserve(ind: number) {
    // Save the number of proceesed clips
    this.audio_proc_num = this.serialcnt++;
    this.audio_file_name = this.urlpatharr[ind];
    this.obv = this.faulttypearr[ind];
    // Change the dials graph as per the input
    this.changecolorhandle(this.faulttypearr[ind], ind, this.accuracyarr[ind]);
    this.index++;
    if (this.index >= this.model_data_arr_index) {
      clearInterval(this.playtimer);
      // clearInterval(this.checkrealtimer)
      // this.incomingseriesplay(0)
      var x = document.getElementById('start_acou') as HTMLButtonElement;
      var y = document.getElementById('stop_acou') as HTMLButtonElement;
      x.disabled = false;
      y.disabled = true;
      x.style.backgroundColor = '#343378';
      y.style.backgroundColor = '#0b66bb94';
      Swal.fire({
        text: 'Acoustics Based Predictive Maintenance has stopped',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    }
  }

  start_acoustics() {
    ///// If there is no real data in table, play reserve data feed.
    if (this.m_real > 2) {
      if (this.index_real == 0) {
        this.getreal();
      }
      this.playtimer_real = setInterval(() => {
        this.playreal(this.index_real);
      }, 5000);
    } else {
      ///// Play reserve data
      if (this.index == 0) {
        this.getreserve();
      } else if (this.index >= this.model_data_arr_index) {
        this.index = 0;
      }
      this.playtimer = setInterval(() => {
        this.playreserve(this.index);
      }, 5000);
    }

    var x = document.getElementById('start_acou') as HTMLButtonElement;
    var y = document.getElementById('stop_acou') as HTMLButtonElement;
    x.disabled = true;
    y.disabled = false;
    x.style.backgroundColor = '#0b66bb94';
    y.style.backgroundColor = '#343378';
    this.logger.info(this.uname, 'Acoustics Usecase started');
    Swal.fire({
      text: 'Acoustics Based Predictive Maintenance has started',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
  }

  stop_acoustics() {
    clearInterval(this.playtimer);
    clearInterval(this.timer);
    clearInterval(this.playtimer_real);
    var x = document.getElementById('start_acou') as HTMLButtonElement;
    var y = document.getElementById('stop_acou') as HTMLButtonElement;
    x.disabled = false;
    y.disabled = true;
    x.style.backgroundColor = '#343378';
    y.style.backgroundColor = '#0b66bb94';

    Swal.fire({
      text: 'Acoustics Based Predictive Maintenance has stopped',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    this.logger.info(this.uname, 'Acoustics Usecase Stopped');
  }

  //// REAL Table input stored in arrays
  getreal() {
    this.m_real = 0;
    // console.log("inside get REAL")
    this.acousticService.getAcousticRealData().subscribe((data: any) => {
      this.checkin = data;
      // console.log('getREAL checkin', this.checkin)
      let recvprocessedlist = this.checkin['processedlist'];
      let lenrecvlist = recvprocessedlist.length;
      for (var i = 0; i < lenrecvlist; i++) {
        let parsedjsonobj = JSON.parse(recvprocessedlist[i]);
        this.urlpatharr_real[this.m_real] = parsedjsonobj.AudioFilePath;
        this.melspecpatharr_real[this.m_real] =
          parsedjsonobj.MelSpectogramImagePath;
        this.amppatharr_real[this.m_real] = parsedjsonobj.AmplitudeImagePath;
        this.faulttypearr_real[this.m_real] = parsedjsonobj.Inference;
        this.accuracyarr_real[this.m_real] = parsedjsonobj.Confidence;
        this.m_real++;
      }
    });
  }

  playreal(ind: number) {
    // console.log("Playing Real Data")

    if (this.index_real >= this.m_real) {
      clearInterval(this.playtimer_real);
      ///// When real data is finished
      this.getreal();
      this.playtimer_real = setInterval(() => {
        this.playreal(this.index_real);
      }, 5000);
    } else {
      this.audio_proc_num = this.serialcnt++;
      this.audio_file_name = this.urlpatharr_real[ind];
      this.obv = this.faulttypearr_real[ind];
      this.changecolorhandle(
        this.faulttypearr_real[ind],
        ind,
        this.accuracyarr_real[ind]
      );
      this.index_real++;
    }
  }

  dial_setup() {
    // @D Graphs Setup
    this.fault_dial_valve = new Chart('FaultDialValve', {
      type: 'line',
      data: {
        labels: [0],
        datasets: [
          {
            data: [0],
            fill: true,
            lineTension: 0,
            steppedLine: 'after',
            backgroundColor: 'transparent',
            borderColor: '#022C48',
            label: 'Valve',
            pointHoverRadius: 6,
            pointHoverBackgroundColor: 'transparent',
            pointBackgroundColor: 'transparent',
            pointBorderColor: '#022C48',
            pointRadius: 3,
          },

          {
            data: [this.threshold],
            borderColor: 'red',
            hoverRadius: 0,
            pointRadius: 0,
            hideInLegendAndTooltip: true,
            label: String(this.threshold),
            backgroundColor: 'transparent',
            borderDash: [10, 5],
            borderWidth: 1,
          },
        ],
      },
      options: {
        elements: { point: { radius: 3, hitRadius: 4, hoverRadius: 5 } },
        onClick: this.allpopup_v.bind(this),
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: true,
          text: 'Valve Condition',
          fontColor: 'black',
          position: 'top',
          fontSize: 15,
        },
        legend: { display: false },
        scales: {
          yAxes: [
            {
              gridLines: { display: true },
              scaleLabel: {
                display: true,
                labelString: 'Probability of Failure (%)',
                fontColor: 'black',
              },
              ticks: { beginAtZero: true, maxTicksLimit: 2, max: 100 },
            },
          ],
          xAxes: [
            {
              gridLines: { display: false },
              scaleLabel: {
                display: true,
                labelString: 'Time (s)',
                fontColor: 'black',
              },
            },
          ],
        },
      },
    });

    this.fault_dial_pump = new Chart('FaultDialPump', {
      type: 'line',
      data: {
        labels: [0],
        datasets: [
          {
            data: [0],
            fill: true,
            lineTension: 0,
            steppedLine: 'after',
            backgroundColor: 'transparent',
            borderColor: '#022C48',
            label: 'Pump',
            pointHoverRadius: 6,
            pointHoverBackgroundColor: 'transparent',
            pointBackgroundColor: 'transparent',
            pointBorderColor: '#022C48',
            pointRadius: 3,
          },

          {
            data: [this.threshold],
            borderColor: 'red',
            hoverRadius: 0,
            pointRadius: 0,
            hideInLegendAndTooltip: true,
            label: String(this.threshold),
            backgroundColor: 'transparent',
            borderDash: [10, 5],
            borderWidth: 1,
          },
        ],
      },
      options: {
        elements: { point: { radius: 3, hitRadius: 4, hoverRadius: 5 } },
        onClick: this.allpopup_p.bind(this),
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: true,
          text: 'Pump Condition',
          fontColor: 'black',
          position: 'top',
          fontSize: 15,
        },
        legend: { display: false },
        scales: {
          yAxes: [
            {
              gridLines: { display: true },
              scaleLabel: {
                display: true,
                labelString: 'Probability of Failure (%)',
                fontColor: 'black',
              },
              ticks: { beginAtZero: true, maxTicksLimit: 2, max: 100 },
            },
          ],
          xAxes: [
            {
              gridLines: { display: false },
              scaleLabel: {
                display: true,
                labelString: 'Time (s)',
                fontColor: 'black',
              },
            },
          ],
        },
      },
    });

    this.fault_dial_fan = new Chart('FaultDialFan', {
      type: 'line',
      data: {
        labels: [0],
        datasets: [
          {
            data: [0],
            fill: true,
            lineTension: 0,
            steppedLine: 'after',
            backgroundColor: 'transparent',
            borderColor: '#022C48',
            label: 'Fan',
            pointHoverRadius: 6,
            pointHoverBackgroundColor: 'transparent',
            pointBackgroundColor: 'transparent',
            pointBorderColor: '#022C48',
            pointRadius: 3,
          },

          {
            data: [this.threshold],
            borderColor: 'red',
            hoverRadius: 0,
            pointRadius: 0,
            hideInLegendAndTooltip: true,
            label: String(this.threshold),
            backgroundColor: 'transparent',
            borderDash: [10, 5],
            borderWidth: 1,
          },
        ],
      },
      options: {
        onClick: this.allpopup_f.bind(this),
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: true,
          text: 'Fan Condition',
          fontColor: 'black',
          position: 'top',
          fontSize: 15,
        },
        legend: { display: false },
        scales: {
          yAxes: [
            {
              gridLines: { display: true },
              scaleLabel: {
                display: true,
                labelString: 'Probability of Failure (%)',
                fontColor: 'black',
              },
              ticks: { beginAtZero: true, maxTicksLimit: 2, max: 100 },
            },
          ],
          xAxes: [
            {
              gridLines: { display: false },
              scaleLabel: {
                display: true,
                labelString: 'Time (s)',
                fontColor: 'black',
              },
            },
          ],
        },
      },
    });

    this.fault_dial_slider = new Chart('FaultDialSlider', {
      type: 'line',
      data: {
        labels: [0],
        datasets: [
          {
            data: [0],
            fill: true,
            lineTension: 0,
            steppedLine: 'after',
            backgroundColor: 'transparent',
            borderColor: '#022C48',
            label: 'Slider',
            pointHoverRadius: 6,
            pointHoverBackgroundColor: 'transparent',
            pointBackgroundColor: 'transparent',
            pointBorderColor: '#022C48',
            pointRadius: 3,
          },

          {
            data: [this.threshold],
            borderColor: 'red',
            hoverRadius: 0,
            pointRadius: 0,
            hideInLegendAndTooltip: true,
            label: String(this.threshold),
            backgroundColor: 'transparent',
            borderDash: [10, 5],
            borderWidth: 1,
          },
        ],
      },
      options: {
        elements: { point: { radius: 3, hitRadius: 4, hoverRadius: 5 } },
        onClick: this.allpopup_s.bind(this),
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: true,
          text: 'Slider Condition',
          fontColor: 'black',
          position: 'top',
          fontSize: 15,
        },
        legend: { display: false },
        scales: {
          yAxes: [
            {
              gridLines: { display: true },
              scaleLabel: {
                display: true,
                labelString: 'Probability of Failure (%)',
                fontColor: 'black',
              },
              ticks: { beginAtZero: true, maxTicksLimit: 2, max: 100 },
            },
          ],
          xAxes: [
            {
              gridLines: { display: false },
              scaleLabel: {
                display: true,
                labelString: 'Time (s)',
                fontColor: 'black',
              },
            },
          ],
        },
      },
    });

    this.accou_bar_dial = new Chart('AccouBarDial', {
      type: 'bar',
      data: {
        labels: ['Valve', 'Pump', 'Fan', 'Slider'],
        datasets: [
          {
            data: [0, 0, 0, 0],
            backgroundColor: ['#2F8ECE', '#3085d6', '#36a2eb', '#786dea'],
            // borderColor: ['#0068AF','#01448D','#01208D', '#0E018D'],
            borderWidth: 1,
            // hoverBackgroundColor: ['#2643C2','#E7EB2B','#11ACCD', '#E93030'],
            maxBarThickness: 30,
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
                labelString: 'Number of faults',
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

  changecolorhandle(type: string, index: number, lvl: number) {
    /////// Set X-axis time values array
    this.labelarr.push(
      this.fault_dial_valve.data.labels[
        this.fault_dial_valve.data.labels.length - 1
      ] + 10
    );
    // console.log('label arr', this.labelarr)
    this.fault_dial_valve.data.labels = this.labelarr;
    this.fault_dial_pump.data.labels = this.labelarr;
    this.fault_dial_fan.data.labels = this.labelarr;
    this.fault_dial_slider.data.labels = this.labelarr;

    //////// Change color of round lights
    var p = document.getElementById('valve') as HTMLButtonElement;
    p.style.backgroundColor = this.greencolor;
    p.style.boxShadow = 'none';
    // p.style.border = '2px solid ' + this.greenbordercolor
    var p = document.getElementById('fan') as HTMLButtonElement;
    p.style.backgroundColor = this.greencolor;
    p.style.boxShadow = 'none';
    // p.style.border = '2px solid ' + this.greenbordercolor
    var p = document.getElementById('pump') as HTMLButtonElement;
    p.style.backgroundColor = this.greencolor;
    p.style.boxShadow = 'none';
    // p.style.border = '2px solid ' + this.greenbordercolor
    var p = document.getElementById('slider') as HTMLButtonElement;
    p.style.backgroundColor = this.greencolor;
    p.style.boxShadow = 'none';
    // p.style.border = '2px solid ' + this.greenbordercolor

    ///////// Change color of observation on header
    var obvcolor = document.getElementById('obvcolor') as HTMLElement;

    ///////// Send right display data to graphs
    if (type == 'Valve fault') {
      ////////// Update charts with input
      this.fault_dial_valve.data.datasets[0].data.push(lvl);
      this.fault_dial_pump.data.datasets[0].data.push(0);
      this.fault_dial_fan.data.datasets[0].data.push(0);
      this.fault_dial_slider.data.datasets[0].data.push(0);

      var p = document.getElementById('valve') as HTMLButtonElement;
      p.style.backgroundColor = this.redcolor;
      p.style.boxShadow = '4px 4px 4px #888888';
      // p.style.borderColor = this.redbordercolor

      obvcolor.style.color = this.redbordercolor;
      this.accou_bar_dial.data.datasets[0].data[0] =
        this.accou_bar_dial.data.datasets[0].data[0] + 1;

      // this.fault_dial_valve.data.datasets[0].pointBackgroundColor = 'red'
    } else if (type == 'Pump fault') {
      ////////// Update charts with input
      this.fault_dial_valve.data.datasets[0].data.push(0);
      this.fault_dial_pump.data.datasets[0].data.push(lvl);
      this.fault_dial_fan.data.datasets[0].data.push(0);
      this.fault_dial_slider.data.datasets[0].data.push(0);

      var p = document.getElementById('pump') as HTMLButtonElement;
      p.style.backgroundColor = this.redcolor;
      p.style.boxShadow = '4px 4px 4px #888888';
      // p.style.borderColor = this.redbordercolor

      obvcolor.style.color = this.redbordercolor;
      this.accou_bar_dial.data.datasets[0].data[1] =
        this.accou_bar_dial.data.datasets[0].data[1] + 1;
    } else if (type == 'Fan fault') {
      ////////// Update charts with input
      this.fault_dial_valve.data.datasets[0].data.push(0);
      this.fault_dial_pump.data.datasets[0].data.push(0);
      this.fault_dial_fan.data.datasets[0].data.push(lvl);
      this.fault_dial_slider.data.datasets[0].data.push(0);

      var p = document.getElementById('fan') as HTMLButtonElement;
      p.style.backgroundColor = this.redcolor;
      p.style.boxShadow = '4px 4px 4px #888888';
      // p.style.borderColor = this.redbordercolor

      obvcolor.style.color = this.redbordercolor;
      this.accou_bar_dial.data.datasets[0].data[2] =
        this.accou_bar_dial.data.datasets[0].data[2] + 1;
    } else if (type == 'Slider fault') {
      ////////// Update charts with input
      this.fault_dial_valve.data.datasets[0].data.push(0);
      this.fault_dial_pump.data.datasets[0].data.push(0);
      this.fault_dial_fan.data.datasets[0].data.push(0);
      this.fault_dial_slider.data.datasets[0].data.push(lvl);

      var p = document.getElementById('slider') as HTMLButtonElement;
      p.style.backgroundColor = this.redcolor;
      p.style.boxShadow = '4px 4px 4px #888888';
      // p.style.borderColor = this.redbordercolor

      obvcolor.style.color = this.redbordercolor;
      this.accou_bar_dial.data.datasets[0].data[3] =
        this.accou_bar_dial.data.datasets[0].data[3] + 1;
    } else if (type == 'No fault') {
      ///////// Update charts with input
      this.fault_dial_valve.data.datasets[0].data.push(0);
      this.fault_dial_pump.data.datasets[0].data.push(0);
      this.fault_dial_fan.data.datasets[0].data.push(0);
      this.fault_dial_slider.data.datasets[0].data.push(0);
      obvcolor.style.color = this.greenbordercolor;
    }

    ///////// Update red threshold line
    this.fault_dial_valve.data.datasets[1].data.push(this.threshold);
    this.fault_dial_pump.data.datasets[1].data.push(this.threshold);
    this.fault_dial_fan.data.datasets[1].data.push(this.threshold);
    this.fault_dial_slider.data.datasets[1].data.push(this.threshold);

    this.fault_dial_valve.update();
    this.fault_dial_pump.update();
    this.fault_dial_fan.update();
    this.fault_dial_slider.update();
    this.accou_bar_dial.update();
  }

  allpopup_v(event: any, type: any) {
    let clickedElement = this.fault_dial_valve.getElementAtEvent(event);
    // console.log("$$ X-AXIS", clickedElement[0]['_index']*10)
    // console.log("$$ Y_AXIS", clickedElement[0]['_datasetIndex'])
    this.serial_graphindex = clickedElement[0]['_index'] - 1;
    if (clickedElement[0]['_index'] - 1 < this.model_data_arr_index) {
      this.graphindex = clickedElement[0]['_index'] - 1;
    } else {
      this.graphindex =
        (clickedElement[0]['_index'] % this.model_data_arr_index) - 1;
    }
    this.openpop = true;
    this.openpopup2();
  }

  allpopup_p(event: any, type: any) {
    let clickedElement = this.fault_dial_pump.getElementAtEvent(event);
    // console.log("$$ X-AXIS", clickedElement[0]['_index']*10)
    // console.log("$$ Y_AXIS", clickedElement[0]['_datasetIndex'])
    this.serial_graphindex = clickedElement[0]['_index'] - 1;
    if (clickedElement[0]['_index'] - 1 < this.model_data_arr_index) {
      this.graphindex = clickedElement[0]['_index'] - 1;
    } else {
      this.graphindex =
        (clickedElement[0]['_index'] % this.model_data_arr_index) - 1;
    }
    this.openpop = true;
    this.openpopup2();
  }

  allpopup_f(event: any, type: any) {
    let clickedElement = this.fault_dial_fan.getElementAtEvent(event);
    // console.log("$$ X-AXIS", clickedElement[0]['_index']*10)
    // console.log("$$ Y_AXIS", clickedElement[0]['_datasetIndex'])
    this.serial_graphindex = clickedElement[0]['_index'] - 1;
    if (clickedElement[0]['_index'] - 1 < this.model_data_arr_index) {
      this.graphindex = clickedElement[0]['_index'] - 1;
    } else {
      this.graphindex =
        (clickedElement[0]['_index'] % this.model_data_arr_index) - 1;
    }
    this.openpop = true;
    this.openpopup2();
  }

  allpopup_s(event: any, type: any) {
    let clickedElement = this.fault_dial_slider.getElementAtEvent(event);
    // console.log("$$ X-AXIS", clickedElement[0]['_index']*10)
    // console.log("$$ Y_AXIS", clickedElement[0]['_datasetIndex'])
    this.serial_graphindex = clickedElement[0]['_index'] - 1;
    if (clickedElement[0]['_index'] - 1 < this.model_data_arr_index) {
      this.graphindex = clickedElement[0]['_index'] - 1;
    } else {
      this.graphindex =
        (clickedElement[0]['_index'] % this.model_data_arr_index) - 1;
    }
    this.openpop = true;
    this.openpopup2();
  }

  openpopup2() {
    if (this.index_real > 2) {
      // save the images
      this.melspec_img = this.melspecpatharr_real[this.graphindex];
      this.amp_img = this.amppatharr_real[this.graphindex];
      // Set audio source as
      this.audio_src = this.urlpatharr_real[this.graphindex];
      // set the fault type
      this.obvtimeline = this.faulttypearr_real[this.graphindex];
      // set confidence level
      var lvl = String(this.accuracyarr_real[this.graphindex]);
    } else {
      // save the images
      this.melspec_img = this.melspecpatharr[this.graphindex];
      this.amp_img = this.amppatharr[this.graphindex];
      // Set audio source as
      this.audio_src = this.urlpatharr[this.graphindex];
      // set the fault type
      this.obvtimeline = this.faulttypearr[this.graphindex];
      // set confidence level
      var lvl = String(this.accuracyarr[this.graphindex]);
    }

    (
      document.getElementById('popupSearchdlg2') as HTMLDivElement
    ).style.display = 'block';
    (document.getElementById('amp_p2') as HTMLImageElement).src = this.amp_img;
    (document.getElementById('mel_p2') as HTMLImageElement).src =
      this.melspec_img;
    (document.getElementById('audio_p2') as HTMLAudioElement).src =
      this.audio_src;
    (document.getElementById('acou_serial2') as HTMLDivElement).textContent =
      this.serial_graphindex + 1;
    (document.getElementById('sch_obvs2') as HTMLDivElement).textContent =
      this.obvtimeline;
    (
      document.getElementById('acou_time_accuracy') as HTMLDivElement
    ).textContent = lvl;
    if (this.obvtimeline == 'Normal' || this.obvtimeline == 'No fault') {
      (document.getElementById('sch_obvs2') as HTMLDivElement).style.color =
        '#29FC08';
      (document.getElementById('sch_obvs2') as HTMLDivElement).innerHTML =
        'Normal';
    } else {
      (document.getElementById('sch_obvs2') as HTMLDivElement).style.color =
        '#f8bdcc';
    }
  }

  openModel() {
    var el = <HTMLInputElement>document.getElementById('popupSearch2');
    el.className = 'modal fade show';
    el.style.display = 'block';
    el.style.paddingRight = '17px';
    el.style.paddingLeft = '17px';
    this.openpopup2();
  }

  closeModel() {
    var el = <HTMLInputElement>document.getElementById('popupSearch2');
    el.style.display = 'None';
    el.className = 'modal fade';
    this.openpop = false;
  }

  set_image_ref(val: string) {
    // console.log(val)
    var melspec = 'assets/wavplot/' + String(val) + '.png';
    var ampli = 'assets/wavplot/' + String(val) + ' amp.png';

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: { closeButton: 'swal-cross' },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons.fire({
      html:
        '\
      <h3> ' +
        val +
        ' </h3>\
      <figure>\
        <img src ="' +
        melspec +
        '"alt="' +
        melspec +
        '" style="width:auto;height:200px;">\
        <figcaption>Melspectogram</figcaption>\
      </figure>\
      <img src ="' +
        ampli +
        '"alt="' +
        ampli +
        '" style="width:auto;height:200px;">\
      ',

      showClass: {
        popup: 'animated fadeIn',
        icon: 'animated heartBeat delay-1s',
      },
      hideClass: { popup: 'animated fadeOut' },
      confirmButtonColor: '#3085d6',
      showCloseButton: true,
      showConfirmButton: false,
      width: 1000,
    });
  }

  @HostListener('click', ['$event'])
  onButtonClickHandler(event: KeyboardEvent) {
    if (
      (<HTMLInputElement>document.getElementById('popupSearch2')).className ==
      'modal fade show'
    ) {
      this.closeModel();
    } else if (this.openpop == true) {
      this.openModel();
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyupHandler(event: KeyboardEvent) {
    this.logout_timer = environment.logout_timer;
  }

  @HostListener('document:click', ['$event'])
  onClickHandler(event: MouseEvent) {
    this.logout_timer = environment.logout_timer;
  }

  @ViewChild('myModal') set modal(content: ElementRef) {
    if (content) {
      this.myModal = content;
      this.myModal.nativeElement.classList.add('modal');
      this.myModal.nativeElement.classList.add('fade');
    }
  }
 
  private myModal!: ElementRef;
  openModal() {
    if (this.myModal) {
      this.myModal.nativeElement.classList.add('show');
this.myModal.nativeElement.style.display = 'block';
    }
  }
 
  closeModal() {
    if (this.myModal) {
      this.myModal.nativeElement.classList.remove('show');
this.myModal.nativeElement.style.display = 'none';
    }
  }
}
