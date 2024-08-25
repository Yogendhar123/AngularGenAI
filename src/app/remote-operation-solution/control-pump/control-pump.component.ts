import { Component, ViewEncapsulation, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Sol, usec, UserData } from 'src/app/model/model';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from 'src/app/services/logger.service';
import { ControlPumpService } from './control-pump.service';
import { environment } from 'src/environments/environment';
import * as Chart from 'chart.js';
import Swal from 'sweetalert2';
import { Options } from '@angular-slider/ngx-slider';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-control-pump',
  templateUrl: './control-pump.component.html',
  styleUrls: ['./control-pump.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ControlPumpComponent implements OnInit {


  public uname: string = "";
  public fname: string = "";
  public lname: string = "";
  public userrole: string = "";
  public sessiontoken: string = "";
  public graph_index: any = "none";
  public uid: number = 0;
  intSolutions: any = [];
  extSolutions: any = [];
  solutions = new Array<Sol>();
  public logout_timer: any;
  public ucases: any = [];

  //Variables Declaration
  public load_val = "Low";
  public pof = 0;
  public rul_dial_water: any;
  public pof_dial_water: any;
  public load_dial: any;
  public rpm_dial: any;
  public warn_width = "4px";
  public timer_w: any;
  public list_val = -1;
  public wdata: any;
  public temp: any;
  public counter = 1;
  public load = 0.0;
  public eff = 0.0;
  public rpm = 0;
  public sig_r = 0.0;
  public prog_bg = "green";
  public prog_sigr = 0;
  public prog_sigr_str = '0%';
  public dp_size = 0;
  public options: Options = {};
  public value: number = 2500;
  public rpm1: any = 0;
  public rpm2: any = 0;

  public warning_color = "black";
  public warning_color2 = "black";
  public stat = "seton";
  public wp_img: any;

  public real_reserve = 'Reserve'
  public realresevetoggle = 'Real'
  public icon_rr = "fa fa-database"

  public kg = true;

  constructor(private location: Location,private http: HttpClient, private logger: LoggerService, private controlWPService: ControlPumpService, private router: Router, private route: ActivatedRoute, private commonService: CommonService) {
    const userInfo = (<UserData>this.route.snapshot.data.UserData);
    this.uid = userInfo.UserId;
    this.uname = userInfo.UserName;
    this.fname = userInfo.FirstName;
    this.lname = userInfo.LastName;
    this.userrole = userInfo.Role;
    this.sessiontoken = userInfo.SessionToken
    this.ucases = userInfo.Usecases;
    this.checkAccessForUsecase()
    this.intSolutions = commonService.intSolutions;
    this.extSolutions = commonService.extSolutions;

    if (this.intSolutions.length == 0 && this.extSolutions.length == 0) {

      this.commonService.getSolutionList(this.uid).subscribe(data => {
        data.forEach((a: any) => {
          if (this.solutions.findIndex(b => b.SolutionId === a.SolutionId) > -1) {
            let obj = this.solutions.filter(b => b.SolutionId === a.SolutionId)[0].Usecases;
            let usecObj = <usec>{};
            usecObj.UsecaseId = a.UsecaseId;
            usecObj.UsecaseName = a.UsecaseName;
            usecObj.UsecaseUrl = a.UsecaseUrl;
            obj.push(usecObj);
          }
          else {
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
            this.solutions.push(solObj)
          }

        })
        this.intSolutions = this.solutions.filter((a) => a.SolutionType == 'Internal');
        this.extSolutions = this.solutions.filter((a) => a.SolutionType == 'External');
      });
      commonService.intSolutions = this.intSolutions;
      commonService.extSolutions = this.extSolutions;
    }
    //Browser closing on Azure
    window.onbeforeunload = () => {
      this.commonService.logout(this.sessiontoken)
        .subscribe()
    }
  }

  ngOnInit(): void {
    this.logout_timer = environment.logout_timer;
    this.wp_img = ".\\assets\\img\\WP1.png";
    this.options = {
      showTicksValues: true,
      vertical: true,
      disabled: true,
      stepsArray: [{ value: 2000 }, { value: 3000 }, { value: 4000 },]
    };
    this.graph_setup();
    this.logger.info(this.uname, "Remote Control of Waterpump Page Has Opened ");
    //////// Empty the real data table
    this.controlWPService.getPumpDeleteData().subscribe(data => { },
      (error) => { this.logger.info(this.uname, "FSW API is not working. Error: " + JSON.stringify(error)); });

  }

  goback(): void { this.location.back() }

  checkAccessForUsecase(): any {
    if (!(this.ucases.indexOf('Remote On/Off and Speed Control of Pump') > -1)) {
      this.router.navigate(['/unauthorized']);
    }
  }

  //Water Pump Graphs initialization
  public graph_setup() {

    //Load Graph
    this.rul_dial_water = new Chart("rul_graph_water", {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: ["#B5BDB4", "#B5BDB4", "#B5BDB4"],
          borderColor: '#DDDDDD',
        }],
      },
      options: {
        title: { display: true, text: "Load (Current Drawn) (A)", fontSize: 15 },
        cutoutPercentage: 60,

        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              if (tooltipItem.index == 0) { return "Current Drawn: Low" }
              else if (tooltipItem.index == 1) { return "Current Drawn: Normal" }
              else { return "Current Drawn: High" }
            }
          }
        },
        maintainAspectRatio: false,
        responsive: true,
        legend: { display: false },
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI

      }
    });
    //POF Graph
    this.pof_dial_water = new Chart("pof_graph_water", {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [0, 0],
          label: 'Impeller Rotation Efficiency',
          backgroundColor: ["#fff"],
          borderColor: '#fff',
        }],
        labels: ["Impeller Rotation Efficiency", ""]
      },
      options: {
        title: { display: true, text: "Impeller Rotation Efficiency (%)", fontSize: 15 },
        cutoutPercentage: 60,
        maintainAspectRatio: false,
        responsive: true,
        legend: { display: false },
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI
      }
    });

    //RPM & Load Graph
    this.rpm_dial = new Chart("rpm_graph", {

      data: {
        labels: [],
        datasets: [{
          data: [],
          fill: false,
          label: 'RPM',
          type: 'line',
          backgroundColor: 'transparent',
          borderColor: '#36a2eb',
          yAxisID: 'left-y-axis'

        },
        {
          data: [],
          fill: false,
          label: "Load",
          type: 'line',
          backgroundColor: 'transparent',
          borderColor: '#ff9f40',
          yAxisID: 'right-y-axis'

        }

        ],

      },
      options: {
        maintainAspectRatio: false,
        title: { display: true, text: 'Trend of Pump RPM and Load vs Time', fontSize: 17 },
        responsive: true,
        legend: {
          display: true,
          labels: {
            boxWidth: 10
          }
        },
        scales: {
          yAxes: [{
            gridLines:
            {
              display: false
            },
            id: "left-y-axis",
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Pump RPM',
              fontColor: "black",


            },
            ticks: {
              beginAtZero: false,
              maxTicksLimit: 4,

            }

          },
          {
            id: "right-y-axis",
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: 'Load (A)',
              fontColor: "black",



            },
            ticks: {
              beginAtZero: false,
              maxTicksLimit: 4,


            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time (s)',
              fontColor: "black",

            },
            ticks: {
              maxTicksLimit: 10
            }

          }]
        }

      }
    });


  }

  public select_real_data()
  {  
    if(this.real_reserve == 'Reserve')
    {
      this.real_reserve = 'Real' ; 
      this.realresevetoggle = 'Reserve'
      this.icon_rr = "fa fa-wifi"
    }
    else
    {
      this.real_reserve = 'Reserve'  
      this.realresevetoggle = 'Real'
      this.icon_rr = "fa fa-database"
    }
  }

  //Main Function for Remote Control of Water Pump
  public rca() {

    this.controlWPService.getWPData(this.counter, this.real_reserve)
      .subscribe(data => {

        // console.log("%%% data got ->", data)
        // console.log("%%% data  this.real_reserve ->",  this.real_reserve)

        if(data == "no data received yet")
        {
          clearTimeout(this.timer_w);
          // this.real_reserve = 'Reserve'
          this.timer_w = setTimeout(() => {
            // console.log("* New fetch * this.counter:this.dp_size::", this.counter, this.dp_size)
            this.rca();
          }, 5000);
        }

        else
        {

        this.counter = this.counter + 1;
        this.wdata = data;
        this.temp = this.wdata;
        this.graph_index = "block";

        this.list_val = this.list_val + 1;
        if (this.list_val == 0) {
          // console.log(this.list_val)
          //this.graph_setup();
        }

        this.load = this.temp[0];
        this.eff = this.temp[1];
        this.rpm = this.temp[2];
        this.sig_r = this.temp[3].toFixed(2);
        this.prog_sigr = parseFloat(this.temp[3].toFixed(2)) *2 ;
        this.prog_sigr = Math.ceil(this.prog_sigr);
        this.prog_sigr_str = this.prog_sigr.toString() + "%";
        this.rpm1 = this.temp[5];
        this.rpm2 = this.temp[6];
        // console.log("this.prog_sigr", this.prog_sigr)

        if (this.prog_sigr > 50) {
          this.prog_bg = "#ff6384";
        }

        else {
          this.prog_bg = "#4bc0c0";
        }
        this.dp_size = this.temp[4];
        this.pof = this.eff;

        if (this.eff <= 50) {
          this.warning_color = "#ff6384"
        }
        else {
          this.warning_color = "black";
        }

        if (this.load >= 4.69) {
          this.rul_dial_water.data.datasets[0].backgroundColor[2] = "#ff6384";
          this.rul_dial_water.data.datasets[0].backgroundColor[0] = "#B5BDB4";
          this.rul_dial_water.data.datasets[0].backgroundColor[1] = "#B5BDB4";

          this.load_val = "High";
          this.warning_color2="#ff6384";
        }

        else if (this.load >= 4.65) {
          this.rul_dial_water.data.datasets[0].backgroundColor[1] = "#4bc0c0";
          this.rul_dial_water.data.datasets[0].backgroundColor[0] = "#B5BDB4";
          this.rul_dial_water.data.datasets[0].backgroundColor[2] = "#B5BDB4";

          this.load_val = "Normal";
          this.warning_color2="black";


        }

        else {
          this.rul_dial_water.data.datasets[0].backgroundColor[0] = "yellow";
          this.rul_dial_water.data.datasets[0].backgroundColor[1] = "#B5BDB4";
          this.rul_dial_water.data.datasets[0].backgroundColor[2] = "#B5BDB4";

          this.load_val = "Low";
          this.warn_width = "4px";
          this.warning_color2="black";
        }





        this.rul_dial_water.update();

        if (this.eff > 75) {
          this.pof_dial_water.data.datasets[0].backgroundColor[0] = "#4bc0c0";
        }

        else if (this.eff > 50) {
          this.pof_dial_water.data.datasets[0].backgroundColor[0] = "#ffcd56";


        }

        else {
          this.pof_dial_water.data.datasets[0].backgroundColor[0] = "#ff6384";
        }





        this.pof_dial_water.data.datasets[0].data[0] = this.eff;
        this.pof_dial_water.data.datasets[0].data[1] = 100 - this.eff;

        this.pof_dial_water.update();

        this.rpm_dial.data.labels.push(this.list_val * 5);
        this.rpm_dial.data.datasets[0].data.push(this.rpm1);
        this.rpm_dial.data.datasets[1].data.push(this.load);
        this.rpm_dial.update();





        if (this.counter <= this.dp_size) {
          if (this.kg == true) {
            this.timer_w = setTimeout(() => {
              // console.log("$$$$ this.counter:this.dp_size::", this.counter, this.dp_size)
              this.rca();
            }, 5000);

          }
          else if (this.kg == false) {

            this.wp_img = ".\\assets\\img\\WP1.png";

            this.rul_dial_water.data.datasets[0].backgroundColor[0] = "#B5BDB4";
            this.rul_dial_water.data.datasets[0].backgroundColor[1] = "#B5BDB4";
            this.rul_dial_water.data.datasets[0].backgroundColor[2] = "#B5BDB4";
            this.rul_dial_water.update();
            this.pof_dial_water.data.datasets[0].backgroundColor[0] = "#B5BDB4";
            this.pof_dial_water.data.datasets[0].data[0] = 0;
            this.pof_dial_water.data.datasets[0].data[1] = 100;
            this.pof_dial_water.update()
            this.pof = 0;
            this.load_val = "low";
            this.prog_sigr_str = '0%';
            this.rpm1 = 0;

          }
        }


        else {
          // this.counter = 1;
          clearTimeout(this.timer_w);
          this.timer_w = setTimeout(() => {
            // console.log("New fetch, this.counter:this.dp_size::", this.counter, this.dp_size)
            this.rca();
          }, 5000);
        }


      }


      },
      (error)=>{
        this.logger.error(this.uname,"Remote Control of Pump API is not working. Error: "+JSON.stringify(error));
      });


  }

  //Stop Button
  public Stop() 
  {
    this.logger.info(this.uname,"Remote Control of Water Pump Usecase has been stopped");
    clearTimeout(this.timer_w);
    this.timer_w = 0;
  }


  public tog_but() {
    if(this.real_reserve == 'Real')
    {

      this.controlWPService.getIOTDeviceData(this.stat)
      .subscribe(data => {

      // this.http.get("https://smartfacdemo.eastus.cloudapp.azure.com/hubapi/hubcall/" + this.stat)
      //   .subscribe(data => {

        if (this.stat == "setoff") {

          /////// Sent setON to hubcall
          console.log("SENDING SETOFF")
          Swal.fire({
            text: 'Remote Control of Pump Operation has been stopped',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
          });

          this.logger.info(this.uname,"Remote Control of Pump Usecase has been stopped");
          this.kg = false;
          this.Stop();
          this.stat = "seton";
          this.wp_img = ".\\assets\\img\\WP1.png";
          this.rul_dial_water.data.datasets[0].backgroundColor[0] = "#B5BDB4";
          this.rul_dial_water.data.datasets[0].backgroundColor[1] = "#B5BDB4";
          this.rul_dial_water.data.datasets[0].backgroundColor[2] = "#B5BDB4";
          this.rul_dial_water.data.datasets[0].data[0] = 0;
          this.rul_dial_water.data.datasets[0].data[1] = 0;
          this.rul_dial_water.data.datasets[0].data[2] = 0;
          this.rul_dial_water.update();
          this.pof_dial_water.data.datasets[0].backgroundColor[0] = "#B5BDB4";
          this.pof_dial_water.data.datasets[0].data[0] = 0;
          this.pof_dial_water.data.datasets[0].data[1] = 0;
          this.pof_dial_water.update()
          this.pof = 0;
          this.load_val = "low";
          this.prog_sigr_str = '0%';
          this.warning_color2='black'
          this.warning_color='black';
          this.rpm1 = 0;
        }
        else if (this.stat == "seton") {

          /////// Sent setOFF to hubcall
          console.log("SENDING SETON")

          Swal.fire({
            text: 'Remote Control of Pump Operation has been started',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
          });

          this.logger.info(this.uname,"Remote Control of Pump Usecase has been started");
          this.kg = true;
          this.rul_dial_water.data.datasets[0].data[0] = 25;
          this.rul_dial_water.data.datasets[0].data[1] = 50;
          this.rul_dial_water.data.datasets[0].data[2] = 25;
          this.rul_dial_water.data.datasets[0].borderColor='white';
          this.rul_dial_water.update();   
          this.pof_dial_water.data.datasets[0].borderColor='white';
          this.pof_dial_water.update();   
          this.rca();
          this.stat = "setoff";
          //console.log(this.rul_dial_water.data.datasets[0].data[0])
          this.wp_img = ".\\assets\\img\\WP1.gif";
        }

        },error => { console.log("Failure in Real fetch", error); }
      );

    }


    if(this.real_reserve == 'Reserve')
    { 

        if (this.stat == "setoff") {
          /////// Sent setON to hubcall
          console.log("SENDING SETOFF")
          Swal.fire({
            text: 'Remote Control of Pump Operation has been stopped',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
          });

          this.logger.info(this.uname,"Remote Control of Pump Usecase has been stopped");
          this.kg = false;
          this.Stop();
          this.stat = "seton";
          this.wp_img = ".\\assets\\img\\WP1.png";
          this.rul_dial_water.data.datasets[0].backgroundColor[0] = "#B5BDB4";
          this.rul_dial_water.data.datasets[0].backgroundColor[1] = "#B5BDB4";
          this.rul_dial_water.data.datasets[0].backgroundColor[2] = "#B5BDB4";
          this.rul_dial_water.data.datasets[0].data[0] = 0;
          this.rul_dial_water.data.datasets[0].data[1] = 0;
          this.rul_dial_water.data.datasets[0].data[2] = 0;
          this.rul_dial_water.update();
          this.pof_dial_water.data.datasets[0].backgroundColor[0] = "#B5BDB4";
          this.pof_dial_water.data.datasets[0].data[0] = 0;
          this.pof_dial_water.data.datasets[0].data[1] = 0;
          this.pof_dial_water.update()
          this.pof = 0;
          this.load_val = "low";
          this.prog_sigr_str = '0%';
          this.warning_color2='black'
          this.warning_color='black';
          this.rpm1 = 0;
        }
        else if (this.stat == "seton") {
          /////// Sent setOFF to hubcall
          console.log("SENDING SETON")
          Swal.fire({
            text: 'Remote Control of Pump Operation has been started',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
          });

          this.logger.info(this.uname,"Remote Control of Pump Usecase has been started");
          this.kg = true;
          this.rul_dial_water.data.datasets[0].data[0] = 25;
          this.rul_dial_water.data.datasets[0].data[1] = 50;
          this.rul_dial_water.data.datasets[0].data[2] = 25;
          this.rul_dial_water.data.datasets[0].borderColor='white';
          this.rul_dial_water.update();   
          this.pof_dial_water.data.datasets[0].borderColor='white';
          this.pof_dial_water.update();   
          this.rca();
          this.stat = "setoff";
          //console.log(this.rul_dial_water.data.datasets[0].data[0])
          this.wp_img = ".\\assets\\img\\WP1.gif";
        }
    }


}

public info_pop() {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      closeButton: 'swal-cross'


    },
    buttonsStyling: false
  })
  swalWithBootstrapButtons.fire({
    html: '\
    <img src=".\\assets\\img\\pop_wp.png" alt="Pop-up-WaterPump" style="width:950px;height: 500px;">\
    ',
    showClass: {
      popup: 'animated fadeIn',
      icon: 'animated heartBeat delay-1s'
    },
    hideClass: {
      popup: 'animated fadeOut',
    },

    confirmButtonColor: '#3085d6',
    showCloseButton: true,
    showConfirmButton: false,

    width: 1120,


  });
}


@HostListener('document:keyup', ['$event'])
onKeyupHandler(event: KeyboardEvent) {
      this.logout_timer=environment.logout_timer;
}

@HostListener('document:click', ['$event'])
onClickHandler(event: MouseEvent) {
  this.logout_timer=environment.logout_timer;
}


}
