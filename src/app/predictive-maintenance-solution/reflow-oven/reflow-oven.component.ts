import { Component, ViewEncapsulation, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { LoggerService } from 'src/app/services/logger.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { Sol, usec, UserData } from 'src/app/model/model';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as Chart from 'chart.js';
import { ReflowOvenService } from './reflow-oven.service';

@Component({
  selector: 'app-reflow-oven-rul',
  templateUrl: './reflow-oven.component.html',
  styleUrls: ['./reflow-oven.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReflowOvenComponent implements OnInit, OnDestroy {

  public uid: number = 0;
  public uname: string = "";
  public fname: string = "";
  public lname: string = "";
  public userrole: string = "";
  public sessiontoken: string = "";

  public rul1 = 0;
  public in = 1;
  public in1 = this.in;
  public mysv: any = []
  public vel: any = []
  public ti: any = [];
  public chart1: any = []
  public char: any = []
  public veloc: any = []
  public acc: any = []
  public s1_v: any = []
  public s1_a: any = []
  public s2_v: any = []
  public s1v_chart: any = []
  public s1a_chart: any = []
  public s2v_chart: any = []

  public M1_C_F: any = []
  public S1_Aac: any = []
  public S1_AP: any = []
  public S1_AV: any = []
  public S1_CP: any = []
  public S1_CV: any = []
  public S1_CF: any = []
  public S1_DCV: any = []
  public S1_OC: any = []
  public S1_OP: any = []
  public S1_OV: any = []
  public X1_AA: any = []
  public X1_Avel: any = []
  public X1_CF: any = []
  public X1_DCVol: any = []
  public X1_OC: any = []
  public X1_OP: any = []
  public X1_Ovol: any = []
  public Y1_AA: any = []
  public Y1_Avel: any = []
  public Y1_Cb: any = []
  public Y1_DCVol: any = []
  public Y1_OC: any = []
  public Y1_OP: any = []
  public Y1_Ovol: any = []
  public Z1_Aac: any = []
  public Z1_AP: any = []
  public Z1_Avel: any = []
  public Z1_CA: any = []
  public Z1_CP: any = []
  public Z1_Cvel: any = []
  public predictions: any = []
  public probabl: any = []

  public M1_C_F1: any = []
  public S1_Aac1: any = []
  public S1_AP1: any = []
  public S1_AV1: any = []
  public S1_CP1: any = []
  public S1_CV1: any = []
  public S1_CF1: any = []
  public S1_DCV1: any = []
  public S1_OC1: any = []
  public S1_OP1: any = []
  public S1_OV1: any = []
  public X1_AA1: any = []
  public X1_Avel1: any = []
  public X1_CF1: any = []
  public X1_DCVol1: any = []
  public X1_OC1: any = []
  public X1_OP1: any = []
  public X1_Ovol1: any = []
  public Y1_AA1: any = []
  public Y1_Avel1: any = []
  public Y1_Cb1: any = []
  public Y1_DCVol1: any = []
  public Y1_OC1: any = []
  public Y1_OP1: any = []
  public Y1_Ovol1: any = []
  public Z1_Aac1: any = []
  public Z1_AP1: any = []
  public Z1_AC1: any = [];
  public Z1_Avel1: any = []
  public Z1_CA1: any = []
  public Z1_CP1: any = []
  public Z1_Cvel1: any = []
  public predictions1: any = []
  public probabliw: any = []
  public rul = 0;
  public pr = 0;

  public cvar = "#36a2eb";
  public cslope1 = "#36a2eb";
  public cslope2 = "#36a2eb";
  public Rvar = "100px";
  public Rvar1 = "80px";
  public Rvar2 = "0px";
  public marginval = "8px";
  public marginvalbur = "115px";
  public va = 0;
  public classval = "fas fa-align-justify";

  public coun = 0;
  public drol1 = 0;
  public drol2 = 0;
  public value1: any;
  public value2: any;
  public swit = 0;
  public Para1: any = [];
  public Para2: any = [];

  public vr = "";

  public timer: any;


  public borde = "";

  public ww = "none";
  public ey = "block";

  public logout_timer: any;


  public slope1 = 0.0;
  public slope2 = 0.0;

  intSolutions: any = [];
  extSolutions: any = [];
  solutions = new Array<Sol>();
  public ucases: any = [];

  public record_counter = 0

  public cons=0;

    public vr1 = '';

    public opa = 0;

    public visible = 0;
    public comparevar = "none"

    public vel_graph='block';
    public acc_graph='none';
    public graph_id=1;


  constructor(private location: Location, private logger: LoggerService, private reflowovenService: ReflowOvenService, private router: Router, private route: ActivatedRoute, private boostService: CommonService) {
    const userInfo = (<UserData>this.route.snapshot.data.UserData);
    this.uid = userInfo.UserId;
    this.uname = userInfo.UserName;
    this.fname = userInfo.FirstName;
    this.lname = userInfo.LastName;
    this.userrole = userInfo.Role;
    this.sessiontoken = userInfo.SessionToken
    this.ucases = userInfo.Usecases;
    this.checkAccessForUsecase();
    this.intSolutions = boostService.intSolutions;
    this.extSolutions = boostService.extSolutions;


    if (this.intSolutions.length == 0 && this.extSolutions.length == 0) {

      this.boostService.getSolutionList(this.uid).subscribe(data => {
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
      boostService.intSolutions = this.intSolutions;
      boostService.extSolutions = this.extSolutions;
    }

    //Browser closing on Azure
    window.onbeforeunload = () => {
      this.boostService.logout(this.sessiontoken)
        .subscribe()
    }
  }

  goback(): void { this.location.back() }
  ngOnInit(): void {
    this.logout_timer = environment.logout_timer;
    this.logger.info(this.uname, this.uname + " Reflow Oven Page has opened");
    this.logger.info(this.uname,this.uname+ " Reflow Oven Page has opened");
  }


  checkAccessForUsecase(): any {
    if (!(this.ucases.indexOf('Reflow Oven Health Profile') > -1)) {
      this.router.navigate(['/unauthorized']);
    }
  }


  public millin() {
    // this.reflowovenService.getMilDataPageNumber().subscribe( 
    //     res=>{console.log("res: ", res)}); 
    //     console.log("getMilDataPageNumber()")

    


    var x= (document.getElementById("oven_img") as HTMLDivElement);
    x.style.display='block';

    var x= (document.getElementById("oven_txt") as HTMLDivElement);
    x.style.display='block';


    Swal.fire({
      text: 'Reflow Oven Usecase has started',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
    this.logger.info(this.uname, "Reflow Oven Usecase started");
    this.milling_usecase();
  }

  public milling_usecase() {

    var x=(document.getElementById("btnstart") as HTMLButtonElement);
    var y=(document.getElementById("btnstop") as HTMLButtonElement);
    x.disabled=true;
    y.disabled=false;
    y.style.backgroundColor='#343378';
    x.style.backgroundColor='#0b66bb94';
    
    if (this.in == 1) {

        this.S1_AP1 = new Chart('S1_ActualPosition', {
            type: 'line',
            data: {
                labels: [],

                datasets: [{
                    label: 'Actual Position (mm)',
                    data: [],
                    fill: false,
                    backgroundColor: [
                        'transparent',

                    ],
                    borderColor: [
                        '#120F49',

                    ],
                    borderWidth: [0.95],

                }, {
                    label: 'Command Position (mm)',
                    fill: false,
                    data: [],
                    backgroundColor: [
                        'transparent',

                    ],
                    borderColor: [
                        '#ffb200',

                    ],
                    borderWidth: [0.95]


                }]

            },
            options: {
                title: { display: true, text: 'Spindle Position (mm)', fontSize: 13 },
                scales:

                {

                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Time (s)",
                            fontColor: "black"


                        },
                        ticks: {
                            // autoSkip: true,
                            maxTicksLimit: 10,
                            fontColor: "black"


                        }
                    }],
                    yAxes: [{

                        ticks: {
                            // autoSkip: true,
                            maxTicksLimit: 5,
                            fontColor: "black"

                        }
                    }]
                },

                maintainAspectRatio: false,
                responsive: false,
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        fontColor: '#007bff',
                        fontSize: 10,
                        boxWidth: 10

                    }
                }
            }

        });

        this.Z1_AP1 = new Chart('Z1_ActualPosition', {
            type: 'line',
            data: {
                labels: [],

                datasets: [{
                    label: 'Actual Job Position on z-axis(mm)',
                    data: [],
                    fill: false,
                    backgroundColor: [
                        'transparent',

                    ],
                    borderColor: [
                        '#120f49',

                    ],

                    borderWidth: [0.95]
                }, {
                    label: 'Command Position (z-axis in mm)',
                    fill: false,
                    data: [],
                    backgroundColor: [
                        'transparent',

                    ],
                    borderColor: [
                        '#ffb200',

                    ],

                    borderWidth: [0.95]
                }]

            },
            options: {
                scales:

                {

                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Time (s)",
                            fontColor: "black"
                        },

                        ticks: {
                            // autoSkip: true,
                            maxTicksLimit: 10,
                            fontColor: "black"
                        }
                    }],
                    yAxes: [{

                        ticks: {
                            // autoSkip: true,
                            maxTicksLimit: 5,
                            fontColor: "black"
                        }
                    }]
                },

                maintainAspectRatio: false,
                responsive: false,
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        fontColor: '#007bff',
                        fontSize: 10,
                        boxWidth: 10
                    }
                }




            }

        });

        this.predictions1 = new Chart('probabilities', {
            type: 'line',
            data: {
                labels: [],

                datasets: [{
                    label: 'Probability',
                    data: [],
                    
                    fill: false,
                    backgroundColor: [
                        'transparent',

                    ],
                    borderColor: [
                        environment.mil_graph_color,

                    ],

                    borderWidth: [0.95]
                },
                {
                    data: [],
                    pointRadius: 0,
                    fill: false,
                    backgroundColor: [
                        'transparent',

                    ],
                    borderColor: [
                        //environment.mil_graph_color,
                        '#fb4a4a'

                    ],

                    borderWidth: [0.95],
                    borderDash: [10, 5]
                },
                {
                    data: [],
                    pointRadius: 0,
                    fill: false,
                    backgroundColor: [
                        'transparent',

                    ],
                    borderColor: [
                        '#fb4a4a'

                    ],

                    borderWidth: [0.95],
                    borderDash: [10, 5]
                },


                ],

            },
            options: {
                title: { display: true, text: 'Reflow Oven Health Indicator (%)', fontSize: 15 }, 
                scales:

                {

                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Time (s)",
                            fontColor: "black"
                        },

                        ticks: {
                            // autoSkip: true,
                            maxTicksLimit: 10
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Reflow Oven Health Indicator (%)",
                            fontColor: "black"
                        },
                        ticks: {
                            // autoSkip: true,
                            maxTicksLimit: 10,
                            min: 70,
                            max: 100
                        }
                    }]
                },

                maintainAspectRatio: false,
                responsive: false,
                legend: {
                    display: false,
                    labels: {
                        // This more specific font property overrides the global property
                        fontColor: '#007bff',
                        fontSize: 10,
                        boxWidth: 10
                    }
                }




            }

        });

        this.S1_CV1 = new Chart('S1_CommandVelocity', {
            type: 'line',
            data: {
                labels: [],

                datasets: [{
                    label: '',
                    data: [],
                    fill: false,
                    backgroundColor: [
                        'transparent',

                    ],
                    borderColor: [
                        '#120F49',

                    ],

                    borderWidth: [0.95]

                }, {
                    label: '',
                    fill: false,
                    data: [],
                    backgroundColor: [
                        'transparent',

                    ],
                    borderColor: [
                        '#ffb200',

                    ],

                    borderWidth: [0.95]
                }]

            },
            options: {
                title: { display: true, text: 'Spindle Velocity (mm/s)', fontSize: 13 },
                scales:

                {

                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Time (s)",
                            fontColor: "black",

                        },

                        ticks: {
                            // autoSkip: true,
                            maxTicksLimit: 10,
                            fontColor: "black",

                        }
                    }],
                    yAxes: [{

                        ticks: {
                            // autoSkip: true,
                            maxTicksLimit: 5,
                            fontColor: "black",

                        }
                    }]
                },

                maintainAspectRatio: false,
                responsive: false,
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        fontColor: '#007bff',
                        fontSize: 10,
                        boxWidth: 10
                    }
                }




            }

        });

    }

    this.reflowovenService.getMilData(this.in)
        .subscribe(data => 
        {

            this.slope2=Math.random() * (1.7 - 0.8) + 0.8
            this.slope2=Number(this.slope2.toFixed(2));

            var minslope=Math.min(this.slope2,1.6);

            this.slope1=Math.random() * (minslope - 0.7) + 0.7
            this.slope1=Number(this.slope1.toFixed(2));

            if(this.slope2>1.6 || this.slope2<0.8)
            {
                this.cslope2="#ff6384";
            }
            else
            {
                this.cslope2="#36a2eb";
            }

            if(this.slope1>1.6 || this.slope1<0.8)
            {
                this.cslope1="#ff6384";
            }
            else
            {
                this.cslope1="#36a2eb";
            }

            console.log("********* this.in: ", (this.in))
            console.log("********* DATA: ", (data))
            this.mysv = (data);
            this.in +=1
            this.in1 +=1;
            if(this.in==10){this.in+=12;}
            if (this.mysv[0] > 0) {
                this.ti.push(this.in1);
                this.M1_C_F.push(this.mysv[3]);
                this.S1_Aac.push(this.mysv[4]);
                this.S1_AP.push(this.mysv[5]);
                this.S1_AV.push(this.mysv[6]-20);
                this.S1_CP.push(this.mysv[7]);
                this.S1_CV.push(this.mysv[8]-20);
                this.S1_CF.push(this.mysv[9]);
                this.S1_DCV.push(this.mysv[10]);
                this.S1_OC.push(this.mysv[11]);
                this.S1_OP.push(this.mysv[12]);
                this.S1_OV.push(this.mysv[13]);
                this.X1_AA.push(this.mysv[14]);
                this.X1_Avel.push(this.mysv[15]);
                this.X1_CF.push(this.mysv[16]);
                this.X1_DCVol.push(this.mysv[17]);
                this.X1_OC.push(this.mysv[18]);
                this.X1_OP.push(this.mysv[19]);
                this.X1_Ovol.push(this.mysv[20]);
                this.Y1_AA.push(this.mysv[21]);
                this.Y1_Avel.push(this.mysv[22]);
                this.Y1_Cb.push(this.mysv[23]);
                this.Y1_DCVol.push(this.mysv[24]);
                this.Y1_OC.push(this.mysv[25]);
                this.Y1_OP.push(this.mysv[26]);
                this.Y1_Ovol.push(this.mysv[27]);
                this.Z1_Aac.push(this.mysv[28]);
                this.Z1_AP.push(this.mysv[29]);
                this.Z1_Avel.push(this.mysv[30]);
                this.Z1_CA.push(this.mysv[31]);
                this.Z1_CP.push(this.mysv[32]);
                this.Z1_Cvel.push(this.mysv[33]);
                //this.predictions.push(this.mysv[34]);

                console.log("this.mysv[36]", this.mysv[36]);
                if (this.mysv[34] == "noworn") {
                    this.pr = 100 - Number(this.mysv[35])
                    //this.probabliw.push(100 - Number(this.mysv[35]));
                }
                if (this.mysv[34] == 'worn') {
                    this.pr = Number(this.mysv[35])
                    //this.probabliw.push(Number(this.mysv[35]));
                }
                var max=95;
                var min=90;
                this.pr=Math.floor(Math.random() * (max - min + 1) + min);
                var ran = Math.floor(Math.random() * (10 - 1 + 1) + 1);
                if(ran==5)
                {
                    this.pr=Math.floor(Math.random() * (89 - 75 + 1) + 75);
                    this.cvar="#ff6384";
                }
                else{
                    this.cvar="#36a2eb";
                }
                this.probabliw.push(this.pr);
                
                this.rul = Number(this.mysv[36]) * 10;
                console.log("this.rul", this.rul);
                if (this.swit == 0) {
                    this.rul1 = this.rul * 6;
                    console.log("If this.rul1", this.rul1);
                    this.swit = 1;
                }

                if ((Number(this.in) > 43 && this.in % 10 == 0) || Number(this.in) == 43) {
                    this.coun++;
                    this.rul1 = this.rul - this.coun +10;
                    console.log("If >43 - this.rul1", this.rul1);
                    //this.cvar = "#ff6384";
                }

                if (this.rul1 <= 0) {
                    this.rul1 = 0;
                    console.log("this.rul1 <= 0", this.rul1);
                }

                this.S1_AP1.data.labels.push(this.in1)
                this.S1_AP1.data.datasets[0].data = this.S1_AP;
                this.S1_AP1.data.datasets[1].data = this.S1_CP;
                //this.S1_AP1.update();

                this.S1_CV1.data.labels.push(this.in1)


                if(this.graph_id==1)
                {
                    this.vel_graph="block";
                    this.acc_graph="none";
                    this.S1_CV1.data.datasets[0].data = this.S1_AV;
                    this.S1_CV1.data.datasets[1].data = this.S1_CV;
                    this.S1_CV1.data.datasets[0].label = "T3-T2 (°C)";
                    this.S1_CV1.data.datasets[1].label = "Ideal Temperature Delta (°C)";
                    this.S1_CV1.options.title.text = "Zone 2 Temperature Profile (T3-T2) (°C)";
                    
                }
                else if(this.graph_id==2)
                {
                    this.vel_graph="none";
                    this.acc_graph="block";
                    this.S1_CV1.data.datasets[0].data = this.Z1_Aac;
                    this.S1_CV1.data.datasets[1].data = this.Z1_CA;
                    this.S1_CV1.data.datasets[0].label = "Actual Acceleration (mm/s^2)";
                    this.S1_CV1.data.datasets[1].label = "Command Acceleration (mm/s^2)";
                    this.S1_CV1.options.title.text = "Actual Acceleration (mm/s^2)";

                }
                this.S1_CV1.update();
                this.predictions1.data.labels.push(this.in1)
                this.predictions1.data.datasets[0].data = this.probabliw;
                //this.predictions1.data.datasets[1].data.push(70);
                this.predictions1.data.datasets[2].data.push(90);
                if (this.probabliw[this.probabliw.length - 1] >= 90) {
                    this.predictions1.data.datasets[0].borderColor = ['green'];
                }
                else{
                    this.predictions1.data.datasets[0].borderColor = ['red'];
        
                }
                this.predictions1.update();
            }
            if (this.rul1 > 0)
            {
                console.log("if (this.rul1 > 0)")
                this.timer = setTimeout(() => {
                this.milling_usecase(); 
                }, 2000);
            }
        },
        (error: any)=>{ 
            console.log('Milling API is not working. Error: '+JSON.stringify(error));
            this.logger.error(this.uname,'Milling API is not working. Error: '+JSON.stringify(error));})
}

public dislay_vel_or_acc()
{
    this.graph_id = Number((document.getElementById("graph_value") as HTMLSelectElement).value);
    if(this.graph_id==1)
    {
        this.vel_graph="block";
        this.acc_graph="none";
        this.S1_CV1.data.datasets[0].data = this.S1_AV;
        this.S1_CV1.data.datasets[1].data = this.S1_CV;
        this.S1_CV1.data.datasets[0].label = "Actual Velocity (mm/s)";
        this.S1_CV1.data.datasets[1].label = "Command Velocity (mm/s)";
        this.S1_CV1.update();
    }
    else if(this.graph_id==2)
    {
        this.vel_graph="none";
        this.acc_graph="block";
        this.S1_CV1.data.datasets[0].data = this.Z1_Aac
        this.S1_CV1.data.datasets[1].data = this.Z1_CA;
        this.S1_CV1.data.datasets[0].label = "Actual Acceleration (mm/s^2)";
        this.S1_CV1.data.datasets[1].label = "Command Acceleration (mm/s^2)";
        this.S1_CV1.update();
    }



}


disp() {
    this.logger.info(this.uname,"Compare button of Reflow Oven UseCase has been clicked");
    this.comparevar = "block";
    this.opa = 1;
    this.visible = 1;
}

minim() {
    this.comparevar = 'none';
    this.opa = 0;
    this.visible = 0;
}

para1(value: any) {
  this.vr = value;
  if (value == "M1_CURRENT_FEEDRATE") {
      this.Para1 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Motor Feed Rate (mm/s)',
                  data: this.M1_C_F,
                  // backgroundColor: [
                  //     'transparent',

                  // ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Motor Feed Rate (mm/s)",
                          fontColor: "black"
                      }
                  }]
              },


              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_ActualAcceleration") {
      this.Para1 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Actual Acceleration (mm/s^2)',
                  data: this.S1_Aac,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },
                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Actual Acceleration (mm/s^2)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }
          }

      });
  }
  if (value == "S1_ActualPosition") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  data: this.S1_AP,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {

              scales:
              {
                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },
                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],
                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Actual Position (mm)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }
          }

      });
  }
  if (value == "S1_ActualVelocity") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,
              datasets: [{
                  data: this.S1_AV,
                  backgroundColor: [
                     'transparent',
                  ],
                  borderColor: [
                      environment.mil_graph_color,
                  ],
                  borderWidth: [0.95]
              }],
          },
          options: {
              scales:
              {
                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },
                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Actual Velocity (mm/s)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }
          }

      });
  }
  if (value == "S1_CommandPosition") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Command Position (mm)',
                  data: this.S1_CP,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Command Position (mm)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_CommandVelocity") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Command Velocity (mm/s)',
                  data: this.S1_CV,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Command Velocity (mm/s)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_CurrentFeedback") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Current Feedback (A)',
                  data: this.S1_CF,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Current Feedback (A)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_DCBusVoltage") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'DCBus Voltage (V)',
                  data: this.S1_DCV,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "DCBus Voltage (V)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_OutputCurrent") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Output Current (A)',
                  data: this.S1_OC,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Output Current (A)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_OutputPower") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Output Power (A)',
                  data: this.S1_OP,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Output Power (A)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_OutputVoltage") {
      this.Para1 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Output Voltage (V)',
                  data: this.S1_OV,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Output Voltage (V)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "X1_ActualAcceleration") {

      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'X1 Actual Acceleration (mm/s^2)',
                  data: this.X1_AA,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "X1 Actual Acceleration (mm/s^2)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "X1_ActualVelocity") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  data: this.X1_Avel,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "X1 Actual Velocity (mm/s)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "X1_CurrentFeedback") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'X1 Current Feedback (A)',
                  data: this.X1_CF,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "X1 Current Feedback (A)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "X1_DCBusVoltage") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'X1 DCBus Voltage (V)',
                  data: this.X1_DCVol,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "X1 DCBus Voltage (V)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == 'X1_OutputCurrent') {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'X1 Output Current (A)',
                  data: this.X1_OC,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "X1 Output Current (A)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == 'X1_OutputPower') {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'X1 Output Power (A)',
                  data: this.X1_OP,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "X1 Output Power (A)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "X1_OutputVoltage") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'X1 Output Voltage (V)',
                  data: this.X1_Ovol,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "X1 Output Voltage (V)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Y1_ActualAcceleration") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Y1 Actual Acceleration (mm/s^2)',
                  data: this.Y1_AA,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Y1 Actual Acceleration (mm/s^2)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Y1_ActualVelocity") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Y1 Actual Velocity (mm/s)',
                  data: this.Y1_Avel,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Y1 Actual Velocity (mm/s)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Y1_CurrentFeedback") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Y1 Current Feedback (A)',
                  data: this.Y1_Cb,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Y1 Current Feedback (A)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Y1_DCBusVoltage") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Y1 DCBus Voltage (V)',
                  data: this.Y1_DCVol,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Y1 DCBus Voltage (V)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Y1_OutputCurrent") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Y1 Output Current (A)',
                  data: this.Y1_OC,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Y1 Output Current (A)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Y1_OutputVoltage") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Y1 Output Voltage (V)',
                  data: this.Y1_Ovol,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Y1 Output Voltage (V)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == 'Z1_ActualAcceleration') {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Actual Job Acceleration (z-axis in mm/s^2)',
                  data: this.Z1_Aac,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Actual Job Acceleration on z-axis (mm/s^2)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Z1_ActualPosition") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Actual Job Position (z-axis in mm)',
                  data: this.Z1_AP,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Actual Job Position on z-axis (mm)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Z1_ActualVelocity") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Z1 Actual Velocity (mm/s)',
                  data: this.Z1_Avel,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Z1 Actual Velocity (mm/s)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Z1_CommandAcceleration") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Command Acceleration (z-axis in mm/s^2)',
                  data: this.Z1_CA,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Command Acceleration (z-axis in mm/s^2)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Z1_CommandPosition") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Command Position (z-axis in mm)',
                  data: this.Z1_CP,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Command Position (z-axis in mm)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Z1_CommandVelocity") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Z1 Command Velocity (mm/s)',
                  data: this.Z1_Cvel,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Z1 Command Velocity (mm/s)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "probabilities") {
      this.Para2 = new Chart('Para1id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Probability',
                  data: this.probabliw,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Reflow Oven Health Indicator (%)",
                          fontColor: "black"
                      },
                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 10,
                          min: 0,
                          max: 100
                      }
                  },
                  ]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });

  }


}

para2(value: any) {
  this.vr1 = value;
  if (value == "M1_CURRENT_FEEDRATE") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Motor Feed Rate (mm/s)',
                  data: this.M1_C_F,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Motor Feed Rate (mm/s)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_ActualAcceleration") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Actual Acceleration (mm/s^2)',
                  data: this.S1_Aac,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Actual Acceleration (mm/s^2)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_ActualPosition") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Actual Position (mm)',
                  data: this.S1_AP,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Actual Position (mm)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_ActualVelocity") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Actual Velocity (mm/s)',
                  data: this.S1_AV,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]

              }],


          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Actual Velocity (mm/s)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_CommandPosition") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Command Position (mm)',
                  data: this.S1_CP,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Command Position (mm)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_CommandVelocity") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Command Velocity (mm/s)',
                  data: this.S1_CV,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Command Velocity (mm/s)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_CurrentFeedback") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Current Feedback (A)',
                  data: this.S1_CF,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Current Feedback (A)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_DCBusVoltage") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'DCBus Voltage (V)',
                  data: this.S1_DCV,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "DCBus Voltage (V)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_OutputCurrent") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Output Current (A)',
                  data: this.S1_OC,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Output Current (A)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_OutputPower") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Output Power (A)',
                  data: this.S1_OP,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Output Power (A)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "S1_OutputVoltage") {
      this.Para1 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Output Voltage (V)',
                  data: this.S1_OV,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Output Voltage (V)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "X1_ActualAcceleration") {

      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'X1 Actual Acceleration (mm/s^2)',
                  data: this.X1_AA,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "X1 Actual Acceleration (mm/s^2)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "X1_ActualVelocity") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'X1 Actual Velocity (mm/s)',
                  data: this.X1_Avel,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "X1 Actual Velocity (mm/s)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "X1_CurrentFeedback") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'X1 Current Feedback (A)',
                  data: this.X1_CF,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "X1 Current Feedback (A)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "X1_DCBusVoltage") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'X1 DCBus Voltage (V)',
                  data: this.X1_DCVol,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "X1 DCBus Voltage (V)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == 'X1_OutputCurrent') {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'X1 Output Current (A)',
                  data: this.X1_OC,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "X1 Output Current (A)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == 'X1_OutputPower') {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'X1 Output Power (A)',
                  data: this.X1_OP,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "X1 Output Power (A)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "X1_OutputVoltage") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'X1 Output Voltage (V)',
                  data: this.X1_Ovol,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "X1 Output Voltage (V)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Y1_ActualAcceleration") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Y1 Actual Acceleration (mm/s^2)',
                  data: this.Y1_AA,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Y1 Actual Acceleration (mm/s^2)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Y1_ActualVelocity") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Y1 Actual Velocity (mm/s)',
                  data: this.Y1_Avel,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Y1 Actual Velocity (mm/s)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Y1_CurrentFeedback") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Y1 Current Feedback (A)',
                  data: this.Y1_Cb,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Y1 Current Feedback (A)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Y1_DCBusVoltage") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Y1 DCBus Voltage (V)',
                  data: this.Y1_DCVol,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Y1 DCBus Voltage (V)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Y1_OutputCurrent") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Y1 Output Current (A)',
                  data: this.Y1_OC,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Y1 Output Current (A)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Y1_OutputVoltage") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Y1 Output Voltage (V)',
                  data: this.Y1_Ovol,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Y1 Output Voltage (V)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == 'Z1_ActualAcceleration') {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Actual Job Acceleration (z-axis in mm/s^2)',
                  data: this.Z1_Aac,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Actual Job Acceleration on z-axis (mm/s^2)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Z1_ActualPosition") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Actual Job Position (z-axis in mm)',
                  data: this.Z1_AP,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Actual Job Position on z-axis in (mm)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Z1_ActualVelocity") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Z1 Actual Velocity (mm/s)',
                  data: this.Z1_Avel,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Z1 Actual Velocity (mm/s)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Z1_CommandAcceleration") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Command Acceleration (z-axis in mm/s^2)',
                  data: this.Z1_CA,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Command Acceleration (z-axis in mm/s^2)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Z1_CommandPosition") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Command Position (z-axis in mm)',
                  data: this.Z1_CP,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Command Position (z-axis in mm)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "Z1_CommandVelocity") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Z1 Command Velocity (mm/s)',
                  data: this.Z1_Cvel,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Z1 Command Velocity (mm/s)",
                          fontColor: "black"
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }
  if (value == "probabilities") {
      this.Para2 = new Chart('Para2id', {
          type: 'line',
          data: {
              labels: this.ti,

              datasets: [{
                  //label: 'Probability',
                  data: this.probabliw,
                  //fill:false,
                  backgroundColor: [
                      'transparent',

                  ],
                  borderColor: [
                      environment.mil_graph_color,

                  ],

                  borderWidth: [0.95]
              }]

          },
          options: {
              scales:

              {

                  xAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Time (s)",
                          fontColor: "black"
                      },

                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 20
                      }
                  }],

                  yAxes: [{
                      scaleLabel: {
                          display: true,
                          labelString: "Reflow Oven Health Indicator (%)",
                          fontColor: "black"
                      },
                      ticks: {
                          // autoSkip: true,
                          maxTicksLimit: 10,
                          min: 0,
                          max: 100
                      }
                  }]
              },

              maintainAspectRatio: false,
              responsive: false,
              legend: {
                  display: false,
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: '#007bff',
                      fontSize: 10,
                      boxWidth: 10
                  }
              }




          }

      });
  }


}

public Stop() {

  Swal.fire({
    text: 'Reflow Oven Usecase has stopped',
    showCancelButton: false,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'OK',
  });

    this.logger.info(this.uname,"Reflow Oven Usecase stopped");

    var x=(document.getElementById("btnstart") as HTMLButtonElement);
    var y=(document.getElementById("btnstop") as HTMLButtonElement);
    y.disabled=true;
    x.disabled=false;
    x.style.backgroundColor='#343378';
    y.style.backgroundColor='#0b66bb94';

    { clearTimeout(this.timer) }
}

public refresh() {
  this.para1(this.vr);
  this.para2(this.vr1);
}



public info_pop() {
  const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
          closeButton: 'swal-cross'
      },
      buttonsStyling: false,

  })
  swalWithBootstrapButtons.fire({
      html: '\
<img src=".\\assets\\img\\pop_milling.png" alt="Pop-up-Milling" style="width:966px;height: 500px;">\
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
      width: 1100,

  });
}


@HostListener('document:keyup', ['$event'])
onKeyupHandler(event: KeyboardEvent) {
    this.logout_timer = environment.logout_timer;
}

@HostListener('document:click', ['$event'])
onClickHandler(event: MouseEvent) {
    this.logout_timer = environment.logout_timer;
}

ngOnDestroy()
{
    clearTimeout(this.timer)
}

}
