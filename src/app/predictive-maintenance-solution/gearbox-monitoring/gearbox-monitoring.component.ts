import {
  Component,
  ViewEncapsulation,
  HostListener,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { Sol, usec, UserData } from 'src/app/model/model';
import { CommonService } from 'src/app/services/common.service';
import { LoggerService } from 'src/app/services/logger.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GearboxMonitoringService } from './gearbox-monitoring.service';
import * as Chart from 'chart.js';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gearbox-monitoring',
  templateUrl: './gearbox-monitoring.component.html',
  styleUrls: ['./gearbox-monitoring.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GearboxMonitoringComponent implements OnInit {
  public uname: string = '';
  public fname: string = '';
  public lname: string = '';
  public userrole: string = '';
  public sessiontoken: string = '';
  public graph_index: any = 'none';
  public uid: number = 0;
  intSolutions: any = [];
  extSolutions: any = [];
  solutions = new Array<Sol>();
  GearBoxservice: any;
  public logout_timer: any;
  public ucases: any = [];

  public atv_clr = '#343378';
  public deatv_clr = '#0b66bb94';
  public sign1: any = [];
  public sign2: any = [];
  public sign3: any = [];
  public sign4: any = [];

  gear_bar_graph: any;
  bearing_bar_graph: any;
  gearbox_id: any;
  comp: any;

  public vr1 = 'motor_vib';
  public vr2 = 'gb_vib_x';
  public vr3 = 'gb_vib_y';
  public vr4 = 'gb_vib_z';
  public gearboxdata: any;
  public speed1 = '';
  public load1 = '';
  public obs = '';
  public action_color = '';
  public fault_type = '';

  public miss = 0;
  public chip = 0;
  public health = 0;
  public root = 0;
  public surface = 0;
  public total = 0;

  public ball = 0;
  public inner = 0;
  public health_b = 0;
  public outer = 0;
  public in_out = 0;
  public total_b = 0;

  // public dataarr_s1=[];
  // public dataarr_s2=[];
  // public dataarr_s3=[];
  // public dataarr_s4=[];
  // public dataarr_s5=[];
  // public dataarr_s6=[];
  // public dataarr_s7=[];
  // public dataarr_s8=[];

  public gearboxtimer: any;
  public bearingtimer: any;

  public i = -1;
  public counter = 0;

  public ib = -1;
  public counter2 = 0;

  @ViewChild('barCanvas') barCanvas: any;
  barChart: any;
  Gdata: any;
  Bdata: any;

  constructor(
    private location: Location,
    private http: HttpClient,
    private logger: LoggerService,
    private gearboxservice: GearboxMonitoringService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
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

  ngOnInit(): void {
    // console.log('GearBox Usecase webpage opened !!')
    this.gearboxservice.get_geardata().subscribe(
      (data) => {
        this.Gdata = data['data'].slice(0, 50);
        console.log(this.Gdata);
        this.Bdata = data['data'].slice(50, 100);
        console.log(this.Bdata);
        // console.log('this.Gdata', this.Gdata);
      },
      (error: any) => {
        this.logger.error(
          this.uname,
          'Gear API is not Working. Error: ' + JSON.stringify(error)
        );
      }
    );
  }

  goback(): void {
    this.location.back();
  }

  checkAccessForUsecase(): any {
    if (!(this.ucases.indexOf('Condition monitoring  of Gearbox') > -1)) {
      this.router.navigate(['/unauthorized']);
    }
  }

  // public info_pop() {
  //   const swalWithBootstrapButtons = Swal.mixin({
  //     customClass: {
  //       closeButton: 'swal-cross'
  //     },
  //     buttonsStyling: false
  //   })
  //   swalWithBootstrapButtons.fire({
  //       html: '\
  //     <img src=".\\assets\\img\\experimental_setup_gb.png" alt="Pop-up-gearbox" style="width:950px;">\
  //     ',
  //     showClass: {
  //       popup: 'animated fadeIn',
  //       icon: 'animated heartBeat delay-1s'
  //     },
  //     hideClass: {
  //       popup: 'animated fadeOut',
  //     },

  //     confirmButtonColor: '#3085d6',
  //     showCloseButton: true,
  //     showConfirmButton: false,

  //     width: 1120,

  //   });
  // }

  public info_pop() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        html: '\
      <div>\
        <img src=".\\assets\\img\\gearbox_info.png" alt="Pop-up-POW" style="width:950px;height: 500px;">\
      <div>\
      ',
        showClass: {
          popup: 'animated fadeIn',
          icon: 'animated heartBeat delay-1s',
        },
        hideClass: { popup: 'animated fadeOut' },

        confirmButtonColor: '#4bc0c0',
        showCloseButton: true,
        showConfirmButton: true,
        width: 1120,
        confirmButtonText: 'Next page',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.info_pop_2();
        }
      });
  }

  public info_pop_2() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        html: '\
      <div>\
        <img src=".\\assets\\img\\experimental_setup_gb.png" alt="Pop-up-POW" style="width:750px;height: 300px;margin:100;">\
      <div>\
      ',
        showClass: {
          popup: 'animated fadeIn',
          icon: 'animated heartBeat delay-1s',
        },
        hideClass: { popup: 'animated fadeOut' },

        confirmButtonColor: '#4bc0c0',
        showCloseButton: true,
        showConfirmButton: true,
        width: 1120,
        confirmButtonText: 'Previous page',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.info_pop();
        }
      });
  }

  public x_arr: any[] = [];
  public sign1_arr: any[] = [];
  public sign2_arr: any[] = [];
  public sign3_arr: any[] = [];
  public sign4_arr: any[] = [];

  public x_arr_bearing: any[] = [];
  public sign1_arr_bearing: any[] = [];
  public sign2_arr_bearing: any[] = [];
  public sign3_arr_bearing: any[] = [];
  public sign4_arr_bearing: any[] = [];

  public gearbarChartMethod() {
    if (this.gear_bar_graph) {
      this.gear_bar_graph.destroy();
    }

    this.gear_bar_graph = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: [
          'Chipped Tooth',
          'Missing Tooth',
          'Root Fault',
          'Surface Fault',
          'Healthy',
          'Total',
        ],
        datasets: [
          {
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: [
              '#4bc0c0',
              '#ff9503',
              '#ffcd56',
              '#51dc82',
              '#b864f8',
              '#36a2eb',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        events: [],
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
                labelString: 'Frequency',
              },
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 5,
              },
            },
          ],
        },
      },
    });
  }

  public bearingbarChartMethod() {
    if (this.bearing_bar_graph) {
      this.bearing_bar_graph.destroy();
    }

    this.bearing_bar_graph = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: [
          'Ball Fault',
          'Inner Ring',
          'Outer Ring',
          'Inner-Outer',
          'Healthy',
          'Total',
        ],
        datasets: [
          {
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: [
              '#4bc0c0',
              '#ff9503',
              '#ffcd56',
              '#51dc82',
              '#b864f8',
              '#36a2eb',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        events: [],
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
                labelString: 'Frequency',
              },
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 5,
              },
            },
          ],
        },
      },
    });
  }

  public chart1Method() {
    // if (this.sign1) {
    //   this.sign1.destroy()
    // }

    this.sign1 = new Chart('sig1id', {
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            fill: false,
            label: '',
            type: 'line',
            borderWidth: 2,
            backgroundColor: 'transparent',
            borderColor: '#36a2eb',
          },
        ],
      },
      options: {
        title: { display: true, text: '', fontSize: 17 },
        elements: {
          point: {
            radius: 0,
          },
        },
        events: [],
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false,
          labels: {
            boxWidth: 10,
          },
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Amplitude',
                fontColor: 'black',
              },
              ticks: {
                beginAtZero: false,
                maxTicksLimit: 6,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 5,
              },
            },
          ],
        },
      },
    });
  }

  public chart2Method() {
    this.sign2 = new Chart('sig2id', {
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            fill: false,
            label: '',
            type: 'line',
            borderWidth: 2,
            backgroundColor: 'transparent',
            borderColor: '#36a2eb',
          },
        ],
      },
      options: {
        title: { display: true, text: '', fontSize: 17 },
        elements: {
          point: {
            radius: 0,
          },
        },
        events: [],
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false,
          labels: {
            boxWidth: 10,
          },
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Amplitude',
                fontColor: 'black',
              },
              ticks: {
                beginAtZero: false,
                maxTicksLimit: 6,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 5,
              },
            },
          ],
        },
      },
    });
  }

  public chart3Method() {
    this.sign3 = new Chart('sig3id', {
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            fill: false,
            label: '',
            type: 'line',
            borderWidth: 2,
            backgroundColor: 'transparent',
            borderColor: '#36a2eb',
          },
        ],
      },
      options: {
        title: { display: true, text: '', fontSize: 17 },
        elements: {
          point: {
            radius: 0,
          },
        },
        events: [],
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false,
          labels: {
            boxWidth: 10,
          },
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Amplitude',
                fontColor: 'black',
              },
              ticks: {
                beginAtZero: false,
                maxTicksLimit: 6,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 5,
              },
            },
          ],
        },
      },
    });
  }

  public chart4Method() {
    this.sign4 = new Chart('sig4id', {
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            fill: false,
            label: '',
            type: 'line',
            borderWidth: 2,
            backgroundColor: 'transparent',
            borderColor: '#36a2eb',
          },
        ],
      },
      options: {
        title: { display: true, text: '', fontSize: 17 },
        elements: {
          point: {
            radius: 0,
          },
        },
        events: [],
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false,
          labels: {
            boxWidth: 10,
          },
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Amplitude',
                fontColor: 'black',
              },
              ticks: {
                beginAtZero: false,
                maxTicksLimit: 6,
              },
            },
          ],
          xAxes: [
            {
              // scaleLabel: {
              //   display: true,
              //   labelString: 'time',
              //   fontColor: "black",
              // },
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 5,
              },
            },
          ],
        },
      },
    });
  }

  gear_init() {
    Swal.fire({
      text: 'GearBox Monitoring has started',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    //// Initialize All Charts
    // this.gearbarChartMethod();
    this.chart1Method();
    this.chart2Method();
    this.chart3Method();
    this.chart4Method();

    var x = document.getElementById('start_gb') as HTMLButtonElement;
    var y = document.getElementById('stop_gb') as HTMLButtonElement;
    x.disabled = true;
    y.disabled = false;
    y.style.backgroundColor = '#343378';
    x.style.backgroundColor = '#0b66bb94';

    this.display_gear_or_bearing();
    this.gearbox_timer();
  }

  public chart_array_map: any = {
    motor_vib: [],
    gb_vib_x: [],
    gb_vib_y: [],
    gb_vib_z: [],
    motor_torq: [],
    par_gb_vib_x: [],
    par_gb_vib_y: [],
    par_gb_vib_z: [],
  };

  public chart_title_map: any = {
    motor_vib: 'Motor Vibration',
    gb_vib_x: 'Planetary Gearbox Vibration in X-Direction',
    gb_vib_y: 'Planetary Gearbox Vibration in Y-Direction',
    gb_vib_z: 'Planetary Gearbox Vibration in Z-Direction',
    motor_torq: 'Motor Torque',
    par_gb_vib_x: 'Parallel Gearbox Vibration in X-Direction',
    par_gb_vib_y: 'Parallel Gearbox Vibration in Y-Direction',
    par_gb_vib_z: 'Parallel Gearbox Vibration in Z-Direction',
  };

  ///// Changes v2

  public gearbox_timer() {
    // this.i = this.i + 1;
    // this.counter += 1;

    if (this.comp == 'gear') {
      this.i = this.i + 1;
      this.counter += 1;

      if (this.counter > 5) {
        this.sign1_arr.splice(0, 50);
        this.sign2_arr.splice(0, 50);
        this.sign3_arr.splice(0, 50);
        this.sign4_arr.splice(0, 50);
        this.x_arr.splice(0, 50);
      }
      // console.log("cp: this.i", this.i)
      this.speed1 = JSON.parse(this.Gdata[this.i][2])['speed'];
      this.load1 = JSON.parse(this.Gdata[this.i][2])['load'];
      // console.log('cp: this.speed1', this.speed1)
      // console.log('cp: ["class"]', JSON.parse(this.Gdata[this.i][1])["class"])
      // console.log('cp: JSON.parse(this.Gdata[this.i][1])["sensor_a1"]', JSON.parse(this.Gdata[this.i][1])["sensor_a1"])

      this.chart_array_map['motor_vib'] = JSON.parse(this.Gdata[this.i][2])[
        'sensor_a1'
      ];
      this.chart_array_map['gb_vib_x'] = JSON.parse(this.Gdata[this.i][2])[
        'sensor_a2'
      ];
      this.chart_array_map['gb_vib_y'] = JSON.parse(this.Gdata[this.i][2])[
        'sensor_a3'
      ];
      this.chart_array_map['gb_vib_z'] = JSON.parse(this.Gdata[this.i][2])[
        'sensor_a4'
      ];
      this.chart_array_map['motor_torq'] = JSON.parse(this.Gdata[this.i][2])[
        'sensor_a5'
      ];
      this.chart_array_map['par_gb_vib_x'] = JSON.parse(this.Gdata[this.i][2])[
        'sensor_a6'
      ];
      this.chart_array_map['par_gb_vib_y'] = JSON.parse(this.Gdata[this.i][2])[
        'sensor_a7'
      ];
      this.chart_array_map['par_gb_vib_z'] = JSON.parse(this.Gdata[this.i][2])[
        'sensor_a8'
      ];

      for (
        var j = (this.counter - 1) * 50;
        j < (this.counter - 1) * 50 + 50;
        j += 1
      ) {
        this.x_arr.push(j);
      }

      // console.log("cp: THIS.VR1 -------> ", this.vr1)
      // console.log("cp: THIS.VR2 -------> ", this.vr2)
      // console.log("cp: THIS.VR3 -------> ", this.vr3)
      // console.log("cp: THIS.VR4 -------> ", this.vr4)
      // console.log("cp: this.chart_array_map[this.vr1] -------> ", this.chart_array_map)

      Array.prototype.push.apply(
        this.sign1_arr,
        this.chart_array_map[this.vr1]
      );
      Array.prototype.push.apply(
        this.sign2_arr,
        this.chart_array_map[this.vr2]
      );
      Array.prototype.push.apply(
        this.sign3_arr,
        this.chart_array_map[this.vr3]
      );
      Array.prototype.push.apply(
        this.sign4_arr,
        this.chart_array_map[this.vr4]
      );

      // if (this.vr1 == )
      // {

      // }
      this.sign1.options.title.text = this.chart_title_map[this.vr1];
      this.sign1.data.labels = this.x_arr;
      // this.sign1.data.datasets[0].data = this.chart_array_map[this.vr1];
      this.sign1.data.datasets[0].data = this.sign1_arr;
      // this.sign1.data.datasets[0].data = this.sign1.data.datasets[0].data.concat(this.chart_array_map[this.vr1]);
      // this.sign1.options.scales.yAxes[0].scaleLabel.labelString = 'Degree'
      this.sign1.update();
      // console.log(this.sign1.options)

      this.sign2.options.title.text = this.chart_title_map[this.vr2];
      this.sign2.data.labels = this.x_arr;
      // this.sign2.data.datasets[0].data = this.chart_array_map[this.vr2];
      this.sign2.data.datasets[0].data = this.sign2_arr;
      // this.sign2.data.datasets[0].data = this.sign2.data.datasets[0].data.concat(this.chart_array_map[this.vr2]);
      this.sign2.update();

      this.sign3.options.title.text = this.chart_title_map[this.vr3];
      this.sign3.data.labels = this.x_arr;
      // this.sign3.data.datasets[0].data = this.chart_array_map[this.vr3];
      this.sign3.data.datasets[0].data = this.sign3_arr;
      // this.sign3.data.datasets[0].data = this.sign3.data.datasets[0].data.concat(this.chart_array_map[this.vr3]);
      this.sign3.update();

      this.sign4.options.title.text = this.chart_title_map[this.vr4];
      this.sign4.data.labels = this.x_arr;
      // this.sign4.data.datasets[0].data = this.chart_array_map[this.vr4];
      this.sign4.data.datasets[0].data = this.sign4_arr;
      // this.sign4.data.datasets[0].data = this.sign4.data.datasets[0].data.concat(this.chart_array_map[this.vr4]);
      this.sign4.update();

      var gearfaultytype = JSON.parse(this.Gdata[this.i][2])['class'];

      if (gearfaultytype == 'chipped tooth') {
        this.action_color = 'red';
        this.obs = 'Faulty';
        this.fault_type = 'Chipped Tooth';
        this.chip = this.chip + 1;
        this.total = this.total + 1;
      } else if (gearfaultytype == 'missing tooth') {
        this.action_color = 'red';
        this.obs = 'Faulty';
        this.fault_type = 'Missing Tooth';
        this.miss = this.miss + 1;
        this.total = this.total + 1;
      } else if (gearfaultytype == 'root fault') {
        this.action_color = 'red';
        this.obs = 'Faulty';
        this.fault_type = 'Root Fault';
        this.root = this.root + 1;
        this.total = this.total + 1;
      } else if (gearfaultytype == 'surface fault') {
        this.action_color = 'red';
        this.obs = 'Faulty';
        this.fault_type = 'Surface Fault';
        this.surface = this.surface + 1;
        this.total = this.total + 1;
      } else if (gearfaultytype == 'healthy') {
        this.action_color = '#51dc82';
        this.obs = 'Healthy';
        this.fault_type = 'NA';
        this.health = this.health + 1;
        this.total = this.total + 1;
      }

      this.gear_bar_graph.data.datasets[0].data[0] = this.chip;
      this.gear_bar_graph.data.datasets[0].data[1] = this.miss;
      this.gear_bar_graph.data.datasets[0].data[2] = this.root;
      this.gear_bar_graph.data.datasets[0].data[3] = this.surface;
      this.gear_bar_graph.data.datasets[0].data[4] = this.health;
      this.gear_bar_graph.data.datasets[0].data[5] = this.total;
      this.gear_bar_graph.update();

      //// Rerun Timer code
      if (this.counter < this.Gdata.length) {
        // console.log("if (this.counter < this.Gdata.length)")
        this.gearboxtimer = setTimeout(() => {
          this.gearbox_timer();
        }, 3000);
      }
    } else {
      this.ib = this.ib + 1;
      this.counter2 += 1;

      if (this.counter2 > 5) {
        this.sign1_arr_bearing.splice(0, 50);
        this.sign2_arr_bearing.splice(0, 50);
        this.sign3_arr_bearing.splice(0, 50);
        this.sign4_arr_bearing.splice(0, 50);
        this.x_arr_bearing.splice(0, 50);
      }

      this.speed1 = JSON.parse(this.Bdata[this.ib][2])['speed'];
      this.load1 = JSON.parse(this.Bdata[this.ib][2])['load'];

      this.chart_array_map['motor_vib'] = JSON.parse(this.Bdata[this.ib][2])[
        'sensor_a1'
      ];
      this.chart_array_map['gb_vib_x'] = JSON.parse(this.Bdata[this.ib][2])[
        'sensor_a2'
      ];
      this.chart_array_map['gb_vib_y'] = JSON.parse(this.Bdata[this.ib][2])[
        'sensor_a3'
      ];
      this.chart_array_map['gb_vib_z'] = JSON.parse(this.Bdata[this.ib][2])[
        'sensor_a4'
      ];
      this.chart_array_map['motor_torq'] = JSON.parse(this.Bdata[this.ib][2])[
        'sensor_a5'
      ];
      this.chart_array_map['par_gb_vib_x'] = JSON.parse(this.Bdata[this.ib][2])[
        'sensor_a6'
      ];
      this.chart_array_map['par_gb_vib_y'] = JSON.parse(this.Bdata[this.ib][2])[
        'sensor_a7'
      ];
      this.chart_array_map['par_gb_vib_z'] = JSON.parse(this.Bdata[this.ib][2])[
        'sensor_a8'
      ];

      for (
        var j = (this.counter2 - 1) * 50;
        j < (this.counter2 - 1) * 50 + 50;
        j += 1
      ) {
        this.x_arr_bearing.push(j);
      }

      Array.prototype.push.apply(
        this.sign1_arr_bearing,
        this.chart_array_map[this.vr1]
      );
      Array.prototype.push.apply(
        this.sign2_arr_bearing,
        this.chart_array_map[this.vr2]
      );
      Array.prototype.push.apply(
        this.sign3_arr_bearing,
        this.chart_array_map[this.vr3]
      );
      Array.prototype.push.apply(
        this.sign4_arr_bearing,
        this.chart_array_map[this.vr4]
      );

      this.sign1.options.title.text = this.chart_title_map[this.vr1];
      this.sign1.data.labels = this.x_arr_bearing;
      this.sign1.data.datasets[0].data = this.sign1_arr_bearing;
      this.sign1.update();

      this.sign2.options.title.text = this.chart_title_map[this.vr2];
      this.sign2.data.labels = this.x_arr_bearing;
      this.sign2.data.datasets[0].data = this.sign2_arr_bearing;
      this.sign2.update();

      this.sign3.options.title.text = this.chart_title_map[this.vr3];
      this.sign3.data.labels = this.x_arr_bearing;
      this.sign3.data.datasets[0].data = this.sign3_arr_bearing;
      this.sign3.update();

      this.sign4.options.title.text = this.chart_title_map[this.vr4];
      this.sign4.data.labels = this.x_arr_bearing;
      this.sign4.data.datasets[0].data = this.sign4_arr_bearing;
      this.sign4.update();

      var bearingfaultytype = JSON.parse(this.Bdata[this.ib][2])['class'];

      if (bearingfaultytype == 'ball fault') {
        this.action_color = 'red';
        this.obs = 'Faulty';
        this.fault_type = 'Ball Fault';
        this.ball = this.ball + 1;
        this.total_b = this.total_b + 1;
      } else if (bearingfaultytype == 'inner ring') {
        this.action_color = 'red';
        this.obs = 'Faulty';
        this.fault_type = 'Inner Ring';
        this.inner = this.inner + 1;
        this.total_b = this.total_b + 1;
      } else if (bearingfaultytype == 'outer ring') {
        this.action_color = 'red';
        this.obs = 'Faulty';
        this.fault_type = 'Outer Ring';
        this.outer = this.outer + 1;
        this.total_b = this.total_b + 1;
      } else if (bearingfaultytype == 'combined') {
        this.action_color = 'red';
        this.obs = 'Faulty';
        this.fault_type = 'Inner & Outer Ring';
        this.in_out = this.in_out + 1;
        this.total_b = this.total_b + 1;
      } else if (bearingfaultytype == 'healthy') {
        this.action_color = '#51dc82';
        this.obs = 'Healthy';
        this.fault_type = 'NA';
        this.health_b = this.health_b + 1;
        this.total_b = this.total_b + 1;
      }

      this.bearing_bar_graph.data.datasets[0].data[0] = this.ball;
      this.bearing_bar_graph.data.datasets[0].data[1] = this.inner;
      this.bearing_bar_graph.data.datasets[0].data[2] = this.outer;
      this.bearing_bar_graph.data.datasets[0].data[3] = this.in_out;
      this.bearing_bar_graph.data.datasets[0].data[4] = this.health_b;
      this.bearing_bar_graph.data.datasets[0].data[5] = this.total_b;
      this.bearing_bar_graph.update();

      if (this.counter < this.Bdata.length) {
        this.gearboxtimer = setTimeout(() => {
          this.gearbox_timer();
        }, 3000);
      }
    }
  }

  public display_gear_or_bearing() {
    this.gearbox_id = Number(
      (document.getElementById('component_value') as HTMLSelectElement).value
    );
    if (this.gearbox_id == 1) {
      this.gearbarChartMethod();
      this.comp = 'gear';
      // this.gearbox_timer();
    } else if (this.gearbox_id == 2) {
      this.bearingbarChartMethod();
      this.comp = 'bearing';
      // this.bearing_timer();
    }
  }

  sig1(value: any) {
    this.vr1 = value;
    if (this.vr1 == 'motor_torq') {
      this.sign1.options.scales.yAxes[0].scaleLabel.labelString = 'Degree';
      // console.log(this.sign1.options.scales.yAxes[0].labelString)
    } else {
      this.sign1.options.scales.yAxes[0].scaleLabel.labelString = 'Amplitude';
    }
    this.sign1.data.datasets[0].data = this.chart_array_map[this.vr1];
    this.sign1.options.title.text = this.chart_title_map[this.vr1];
    this.sign1.update();
  }

  sig2(value: any) {
    this.vr2 = value;
    this.sign2.data.datasets[0].data = this.chart_array_map[this.vr2];
    this.sign2.options.title.text = this.chart_title_map[this.vr2];
    this.sign2.update();
  }

  sig3(value: any) {
    this.vr3 = value;
    this.sign3.data.datasets[0].data = this.chart_array_map[this.vr3];
    this.sign3.options.title.text = this.chart_title_map[this.vr3];
    this.sign3.update();
  }

  sig4(value: any) {
    this.vr4 = value;
    this.sign4.data.datasets[0].data = this.chart_array_map[this.vr4];
    this.sign4.options.title.text = this.chart_title_map[this.vr4];
    this.sign4.update();
  }

  //Stop Button
  public Stop() {
    // console.log('cp: Stopping')
    Swal.fire({
      text: 'GearBox Monitoring has stopped',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    this.logger.info(this.uname, 'GearBox Usecase Stopped');
    clearTimeout(this.gearboxtimer);
    clearTimeout(this.bearingtimer);
    var x = document.getElementById('start_gb') as HTMLButtonElement;
    var y = document.getElementById('stop_gb') as HTMLButtonElement;

    x.disabled = false;
    y.disabled = true;

    x.style.backgroundColor = '#343378';
    y.style.backgroundColor = '#0b66bb94';
  }

  ngOnDestroy() {
    clearTimeout(this.gearboxtimer);
    clearTimeout(this.bearingtimer);
  }
}
