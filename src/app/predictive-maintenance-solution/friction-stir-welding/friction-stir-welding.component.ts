import { Component, ViewEncapsulation, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Sol, usec, UserData } from 'src/app/model/model';
import { CommonService } from 'src/app/services/common.service';
import { LoggerService } from 'src/app/services/logger.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FrictionStirWeldingService } from './friction-stir-welding.service';
import { environment } from 'src/environments/environment';
import * as Chart from 'chart.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-friction-stir-welding',
  templateUrl: './friction-stir-welding.component.html',
  styleUrls: ['./friction-stir-welding.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FrictionStirWeldingComponent implements OnInit {

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
  FSWService: any;
  public logout_timer: any;
  public ucases: any = [];

  public load_val = "Low";
  public pof = 0;
  public rul_dial_water: any;
  public tensile_graph: any;
  public load_dial: any;
  public force_graph: any;
  public power_graph: any;
  public torque_graph: any;

  public warn_width = "4px";
  public timer_fsw: any;
  public list_val = -1;
  public fdata: any;
  public fdata_reserve = [] as any;
  public temp: any;
  public counter = 0;
  public load = 0.0;
  public eff = 0.0;
  public rpm = 0;
  public sig_r = 0.0;
  public prog_bg = "#4bc0c0";
  public prog_sigr = 0;
  public prog_sigr_str = '0%';
  public dp_size = 0;
  public value: number = 2500;
  public rpm1: any = 0;
  public rpm2: any = 0;

  public warning_color="black";

   public exp_no:number=0;
   public curr_data:any;
   public tensile_strength=0;
   public welding_quality=''
   public wq_color='';
   public rot_speed=0;
   public weld_speed=0;
   public fsw_progress="0%";
   public atv_clr='#343378';
   public deatv_clr='#0b66bb94';
   public f_arr:any[]=[];
   public p_arr:any[]=[];
   public t_arr:any[]=[];
   public timer_arr:any[]=[];
   public weld_status1="none";
   public weld_status2="block";
   public weld_status3="none";
   public data_status1="#4bc0c0";
   public data_status2="grey";

   public records_recv = 0

  constructor(private location: Location, private logger: LoggerService, private fswservice: FrictionStirWeldingService, private router: Router, private route: ActivatedRoute, private commonService: CommonService) {
    const userInfo = (<UserData>this.route.snapshot.data.UserData);
    this.uid = userInfo.UserId;
    this.uname = userInfo.UserName;
    this.fname = userInfo.FirstName;
    this.lname = userInfo.LastName;
    this.userrole = userInfo.Role;
    this.sessiontoken = userInfo.SessionToken;
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
    this.graph_setup();
    this.fswservice.getFSWDeleteData().subscribe(data => { },
      (error) => { this.logger.info(this.uname, "FSW API is not working. Error: " + JSON.stringify(error)); });

    this.logger.info(this.uname, "Routed to Friction Stir Welding Page");
  }

  goback(): void { this.location.back() }

  checkAccessForUsecase(): any {
    if (!(this.ucases.indexOf('Tensile Strength Prediction of a Friction Stir Weld') > -1)) {
      this.router.navigate(['/unauthorized']);
    }
  }

  //Tensile Strength Graphs initialization
  public graph_setup() {


    //Tensile Graph
    this.tensile_graph = new Chart("Tensile", {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [],
          label: 'Tensile Strength',
          backgroundColor: ["#B5BDB4", "#B5BDB4"],
        }],
        labels: [
          "Tensile Strength", ''
        ]
      },
      options: {
        title: { display: true, text: "Tensile Strength (MPa)", fontSize: 17 },
        cutoutPercentage: 60,
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false
        },

        circumference: 1.7 * Math.PI,
        rotation: 0.66 * Math.PI

      }
    });

    //Force, Power and Torque Graphs
    this.force_graph = new Chart("Force_Graph", {

      data: {
        labels: [],
        datasets: [{
          data: [],
          fill: false,
          label: 'Force (N)',
          type: 'line',
          backgroundColor: 'transparent',
          borderColor: '#36a2eb',

        },


        ],

      },
      options: {
        title: { display: true, text: "Force (N)", fontSize: 17 },
        elements:
        {
          point: {
            radius: 0
          }
        },
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false,
          labels: {
            boxWidth: 10
          }
        },
        scales: {
          yAxes: [{
            gridLines:
            {
              display: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Force (N)',
              fontColor: "black",
            },

            ticks: {
              beginAtZero: false,
              maxTicksLimit: 4,

            }

          },
          ],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time (s)',
              fontColor: "black",
            },
            ticks: {

              maxTicksLimit: 4
            }

          }]
        }

      }
    });

    this.power_graph = new Chart("Power_Graph", {

      data: {
        labels: [],
        datasets: [{
          data: [],
          fill: false,
          label: 'Power (KW)',
          type: 'line',
          backgroundColor: 'transparent',
          borderColor: '#36a2eb',
        },
        ],
      },
      options: {
        title: { display: true, text: "Power (KW)", fontSize: 17 },
        elements:
        {
          point: {
            radius: 0
          }
        },
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false,
          labels: {
            boxWidth: 10
          }
        },
        scales: {
          yAxes: [{
            gridLines:
            {
              display: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Power (kW)',
              fontColor: "black",


            },
            ticks: {
              beginAtZero: false,
              maxTicksLimit: 4,

            }

          },
          ],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time (s)',
              fontColor: "black",


            },
            ticks: {
              maxTicksLimit: 4,


            }

          }]
        }

      }
    });

    this.torque_graph = new Chart("Torque_Graph", {

      data: {
        labels: [],
        datasets: [{
          data: [],
          fill: false,
          label: 'Torque (Nm)',
          type: 'line',
          backgroundColor: 'transparent',
          borderColor: '#36a2eb',

        },


        ],

      },
      options: {
        title: { display: true, text: "Torque (Nm)", fontSize: 17 },
        elements:
        {
          point: {
            radius: 0
          }
        },
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false,
          labels: {
            boxWidth: 10
          }
        },
        scales: {
          yAxes: [{
            gridLines:
            {
              display: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Torque (Nm)',
              fontColor: "black",


            },
            ticks: {
              beginAtZero: false,
              maxTicksLimit: 4,

            }

          },
          ],
          xAxes: [{

            scaleLabel: {
              display: true,
              labelString: 'Time (s)',
              fontColor: "black",


            },
            ticks: {
              maxTicksLimit: 4
            }

          }]
        }

      }
    });

  }

  public fsw_reserve_run()
  {
     // console.log("this.exp_no", this.exp_no, (this.exp_no-1)*20, (this.exp_no-1)*20+this.counter, this.records_recv);
   
    this.weld_status1="block";
    this.weld_status2="none";
    this.weld_status3="none";
    this.data_status1="grey";
    this.data_status2="#4bc0c0";
    this.graph_index="block";
    this.atv_clr='#0b66bb94';
   if(this.counter==0){this.graph_setup();}
   var x=(document.getElementById("start_fsw") as HTMLButtonElement);
   var y=(document.getElementById("stop_fsw") as HTMLButtonElement);
   x.disabled=true;
   y.disabled=false;
   this.deatv_clr='#343378';
   this.atv_clr='#0b66bb94';
   // this.curr_data= this.fdata_reserve[(this.exp_no-1)*20+this.counter];
   this.curr_data= this.fdata_reserve[this.counter];
   Array.prototype.push.apply(this.f_arr, this.curr_data["Force"]);
   Array.prototype.push.apply(this.p_arr, this.curr_data["Power"]);
   Array.prototype.push.apply(this.t_arr, this.curr_data["Torque"]);
   this.rot_speed=this.curr_data["rotational speed"];
   this.weld_speed=this.curr_data["welding speed"];
   this.fsw_progress=((this.counter+1)*5).toString()+"%";
   this.force_graph.data.datasets[0].data=this.f_arr;
   this.power_graph.data.datasets[0].data=this.p_arr;
   this.torque_graph.data.datasets[0].data=this.t_arr;
   this.tensile_graph.data.datasets[0].data[0]=this.curr_data["Tensile Strength"].toFixed(2);
   this.tensile_graph.data.datasets[0].data[1]=(270-this.curr_data["Tensile Strength"]).toFixed(2);
   if(this.curr_data["Tensile Strength"].toFixed(2)>=200)
   {
     this.tensile_graph.data.datasets[0].backgroundColor[0]="#4bc0c0";
     this.welding_quality="Good";
     this.wq_color="#4bc0c0";
   }
   else
   {
     this.tensile_graph.data.datasets[0].backgroundColor[0]="#ff6384";
     this.welding_quality="Bad";
     this.wq_color="#ff6384";
   }
   this.tensile_strength= this.tensile_graph.data.datasets[0].data[0]=this.curr_data["Tensile Strength"].toFixed(2);
   this.tensile_graph.update();
   for(var i=(this.counter)*5;i<(this.counter)*5+5;i+=0.1){
     this.timer_arr.push(i.toFixed(0));
   }
   this.force_graph.data.labels=this.timer_arr
   this.force_graph.update();
   this.power_graph.data.labels=this.timer_arr
   this.power_graph.update();
   this.torque_graph.data.labels=this.timer_arr
   this.torque_graph.update();
   this.counter=this.counter+1;

   if(this.counter<20)
   {
     this.timer_fsw = setTimeout(() => {this.fsw_reserve_run();}, 5000);
   }

   else
   {
     this.counter=0;
     var opt2=(document.getElementById("exp_value") as HTMLSelectElement);
     opt2.disabled=false;
     opt2.style.background="#b3cfe1";

     var x=(document.getElementById("start_fsw") as HTMLButtonElement);
     var y=(document.getElementById("stop_fsw") as HTMLButtonElement);

     x.disabled=false;
     y.disabled=true;

     this.atv_clr='#343378';
     this.deatv_clr='#0b66bb94';
   }

 }

  //Main Function for FSW
  public fsw_init()
  {

   Swal.fire({
     text: 'Tensile Strength Prediction operation has started',
     showCancelButton: false,
     confirmButtonColor: '#3085d6',
     confirmButtonText: 'OK',
   });

   this.logger.info(this.uname,"FSW Usecase started");
   this.weld_status1="none";
   this.weld_status2="none";
   this.weld_status3="block";
   this.data_status1="grey";
   this.data_status2="#4bc0c0";
   this.exp_no = Number((document.getElementById("exp_value") as HTMLSelectElement).value);


  /* this.http.get("http://20.62.157.10/hubapi/hubcall/Experiment/"+this.exp_no.toString()).
  subscribe((data) => {this.fsw_real();},
     error=>{this.logger.error(this.uname,"HUB Call API for FSW is not working Error: "+JSON.stringify(error));

           this.fsw_real();}
         );
*/
let timer=setTimeout(() => {
       this.fsw_real();
     }, 2000 );

}

  public fsw_reserve()
  {
       // this.fswservice.getFSWReserveData()
       this.fswservice.getFSWReserveDataPageNumber((this.exp_no-1)*20)
       .subscribe(data => {
         // console.log('$$$$$$$$ FSW-RESERVE Data Log: ', JSON.parse(data))
         this.records_recv = this.records_recv + JSON.parse(data).length
         // console.log("LENGTH: ", this.records_recv)
 
         // console.log("In Reserve")
         this.weld_status1="block";
         this.weld_status2="none";
         this.weld_status3="none";
         this.data_status1="grey";
         this.data_status2="#4bc0c0";
 
         this.fdata_reserve = JSON.parse(data); 
         // console.log('this.fdata_reserve: ', this.fdata_reserve)
         this.exp_no = Number((document.getElementById("exp_value") as HTMLSelectElement).value);
         var opt=(document.getElementById("exp_value") as HTMLSelectElement);
         opt.disabled=true;
         opt.style.background="#bbb";
         this.fsw_reserve_run();
       },
       error=>{
         this.logger.info(this.uname,"FSW API is not running. Error: "+JSON.stringify(error));
         this.timer_fsw=setTimeout(() => {
         this.fsw_reserve();
       }, 5000 );});
 
  }
 
 
  public fsw_real()
  {
   this.logger.info(this.uname,"FSW Real Data is Used");
 
 
   this.fswservice.getFSWRealData()
   .subscribe(data => {
 
 
      this.fdata=JSON.parse(data);
      this.exp_no = Number((document.getElementById("exp_value") as HTMLSelectElement).value);
      var opt=(document.getElementById("exp_value") as HTMLSelectElement);
      opt.disabled=true;
      opt.style.background="#bbb";
 
      this.graph_index="block";
      this.atv_clr='#0b66bb94';
 
     if(this.counter==0)
     {
       this.graph_setup();
     }
 
     var x=(document.getElementById("start_fsw") as HTMLButtonElement);
     var y=(document.getElementById("stop_fsw") as HTMLButtonElement);
 
     x.disabled=true;
     y.disabled=false;
 
     this.deatv_clr='#343378';
     this.atv_clr='#0b66bb94';
 
 
 
     if(Object.keys(this.fdata).length<=this.counter)
     {
       this.logger.info(this.uname,"FSW Real Data is not Coming, Reserve Data is Used");
       this.timer_fsw=setTimeout(() => {
         this.fsw_reserve();
       }, 5000 );
     }
     else
     {
       this.curr_data=JSON.parse(this.fdata[this.counter]);
 
 
     if(Object.keys(this.curr_data).length === 0)
     {
      this.logger.info(this.uname,"FSW Real Data is not Coming, Reserve Data is Used");
      this.timer_fsw=setTimeout(() => {
       this.fsw_reserve();
     }, 1000 );
 
 
 
     }
 
     else
     {
       this.weld_status1="block";
     this.weld_status2="none";
     this.weld_status3="none";
     this.data_status1="#4bc0c0";
     this.data_status2="grey";
 
       Array.prototype.push.apply(this.f_arr, this.curr_data["Force"]);
       Array.prototype.push.apply(this.p_arr, this.curr_data["Power"]);
       Array.prototype.push.apply(this.t_arr, this.curr_data["Torque"]);
 
     this.rot_speed=this.curr_data["rotational speed"];
     this.weld_speed=this.curr_data["welding speed"];
 
 
 
     this.fsw_progress=((this.counter+1)*5).toString()+"%";
 
 
     this.force_graph.data.datasets[0].data=this.f_arr;
     this.power_graph.data.datasets[0].data=this.p_arr;
     this.torque_graph.data.datasets[0].data=this.t_arr;
 
     this.tensile_graph.data.datasets[0].data[0]=this.curr_data["Tensile Strength"].toFixed(2);
     this.tensile_graph.data.datasets[0].data[1]=(270-this.curr_data["Tensile Strength"]).toFixed(2);
 
     if(this.curr_data["Tensile Strength"].toFixed(2)>=200)
     {
       this.tensile_graph.data.datasets[0].backgroundColor[0]="#4bc0c0";
       this.welding_quality="Good";
       this.wq_color="#4bc0c0";
     }
     else
     {
       this.tensile_graph.data.datasets[0].backgroundColor[0]="#ff6384";
       this.welding_quality="Bad";
       this.wq_color="#ff6384";
     }
 
     this.tensile_strength= this.tensile_graph.data.datasets[0].data[0]=this.curr_data["Tensile Strength"].toFixed(2);
 
     this.tensile_graph.update();
 
 
 
 
     for(var i=(this.counter)*5;i<(this.counter)*5+5;i+=0.1){
       this.timer_arr.push(i.toFixed(0));
     }
 
 
     this.force_graph.data.labels=this.timer_arr
     this.force_graph.update();
     this.power_graph.data.labels=this.timer_arr
     this.power_graph.update();
     this.torque_graph.data.labels=this.timer_arr
     this.torque_graph.update();
 
 
     this.counter=this.counter+1;
 
     if(this.counter<20)
     {
 
      this.timer_fsw=setTimeout(() => {
        this.fsw_real();
      }, 5000 );
     }
     else
     {
       this.counter=0;
       var opt2=(document.getElementById("exp_value") as HTMLSelectElement);
       opt2.disabled=false;
       opt2.style.background="#C0BFFF";
 
       var x=(document.getElementById("start_fsw") as HTMLButtonElement);
       var y=(document.getElementById("stop_fsw") as HTMLButtonElement);
 
       x.disabled=false;
       y.disabled=true;
 
       this.atv_clr='#343378';
       this.deatv_clr='#0b66bb94';
     }
     }
   }
   },
 
   error=>{
 
       this.fsw_reserve();
 
 
 
   });
 
  }
 
    //Stop Button
     public Stop()
     {
 
       Swal.fire({
         text: 'Tensile Strength Prediction operation has stopped',
         showCancelButton: false,
         confirmButtonColor: '#3085d6',
         confirmButtonText: 'OK',
       });
 
      this.logger.info(this.uname,"FSW Usecase Stopped");
      clearTimeout(this.timer_fsw);
      var x=(document.getElementById("start_fsw") as HTMLButtonElement);
      var y=(document.getElementById("stop_fsw") as HTMLButtonElement);
 
      x.disabled=false;
      y.disabled=true;
 
      this.atv_clr='#343378';
      this.deatv_clr='#0b66bb94';
     }

  public reset_fsw()
{
  this.logger.info(this.uname,"FSW Graphs are Reset");
  this.fswservice.getFSWDeleteData().subscribe(data => {},
    (error)=>{this.logger.error(this.uname,"FSW API is Not Running. Error: "+JSON.stringify(error));});

        clearTimeout(this.timer_fsw);

        this.weld_status1="none";
        this.weld_status2="block";
        this.weld_status3="none";
        this.data_status1="grey";
        this.data_status2="#4bc0c0";


        this.force_graph.data.datasets[0].data=[];
        this.force_graph.data.datasets[0].data=[];
        this.force_graph.data.datasets[0].data=[];
        this.force_graph.update();

        this.power_graph.data.datasets[0].data=[];
        this.power_graph.data.datasets[0].data=[];
        this.power_graph.data.datasets[0].data=[];
        this.power_graph.update();

        this.torque_graph.data.datasets[0].data=[];
        this.torque_graph.data.datasets[0].data=[];
        this.torque_graph.data.datasets[0].data=[];
        this.torque_graph.update();


        this.tensile_graph.data.datasets[0].backgroundColor[0]="#B5BDB4";
        this.tensile_graph.data.datasets[0].backgroundColor[1]="#B5BDB4";
        this.tensile_graph.data.datasets[0].data=[];
        this.tensile_graph.update()

        this.fsw_progress='';
        this.welding_quality="";
        this.wq_color="";
        this.rot_speed=0;
        this.weld_speed=0;
        this.tensile_strength=0;
        this.counter=0;


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
      <img src=".\\assets\\img\\pop_fsw_mod.png" alt="Pop-up-FSW" style="width:950px;height: 500px;">\
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
  public consts_show(){
    var x=(document.getElementById("passw") as HTMLDivElement);
    x.style.display = "block";
  }
  public consts_hide(){
    var x=(document.getElementById("passw") as HTMLDivElement);
  
    x.style.display = "none";
  
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
