import { Component, ViewEncapsulation, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { DomSanitizer } from '@angular/platform-browser';
import { Sol, usec, UserData } from 'src/app/model/model';
import { SteelSurfaceInspectionService } from './steel-surface-inspection.service';
import { LoggerService } from 'src/app/services/logger.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as Chart from 'chart.js';
import { removeToken } from 'src/app/model/user';

@Component({
  selector: 'app-steel-surface-inspection',
  templateUrl: './steel-surface-inspection.component.html',
  styleUrls: ['./steel-surface-inspection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SteelSurfaceInspectionComponent implements OnInit {

  intSolutions: any = [];
  extSolutions: any = [];
  solutions = new Array<Sol>();
  public ucases: any = [];

  public demo: any;
  public milling_url: string = "";
  public wp_url: string = "";
  public rca_url: string = "";
  public piston_url: string = "";
  public eqp_url: string = "";
  public home_url: string = "";
  public steel_url: string = "";
  public vision_url: string = '';
  public predictive_url: string = '';
  public remote_url: string = '';
  public help_url: string = '';
  public contact_url: string = '';
  public sidenav_margin = "0px";
  public main_margin = "0px";

  public ssi_graph: any;
  public uname: string = "";
  public fname: string = "";
  public lname: string = "";
  public userrole: string = "";
  public sessiontoken: string = "";
  public message: string = '';
  public UserID: any;
  public uid: number = 0;
  public logout_timer: any;

  public sn = 0;
  public timer_steel: any;
  public img_src = this.sanitizer.bypassSecurityTrustUrl("./assets/img/nopreview1.png");
  public obv: any;
  public def: any;
  public nm = 0;
  public cr = 0;
  public inc = 0;
  public pat = 0;
  public pit = 0;
  public ris = 0;
  public sct = 0;
  public tot = 0;
  public sid = '';
  public timeline_child1: any;
  public def_color = "#29FC08";
  public steel_data: any;

  public pop_disp = '';
  public search_string = '';
  public steel_id: any;
  public sch_serial = '';
  public camp: any;
  public sch_obv = '';
  public sch_def = '';
  public sch_def_color = '';

  public sch_focus: any = false;

  public mytime: any;
  public hours = '';
  public min = '';
  public secs = '';
  public day = '';
  public year = '';
  public mon = 0;
  public ym = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];



  public date_time = '';
  public date_time2 = '';

  constructor(private sanitizer: DomSanitizer, private location: Location, private logger: LoggerService, private steelService: SteelSurfaceInspectionService, private router: Router, private route: ActivatedRoute, private commonService: CommonService) {
    const userInfo = (<UserData>this.route.snapshot.data.UserData);
    this.uid = userInfo.UserId;
    this.uname = userInfo.UserName;
    this.fname = userInfo.FirstName;
    this.lname = userInfo.LastName;
    this.userrole = userInfo.Role;
    this.sessiontoken = userInfo.SessionToken
    this.ucases = userInfo.Usecases;
    this.checkAccessForUsecase();
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
    this.logger.info(this.uname, "Steel Surface Inspection Page Has Opened ");
  }

  ngOnDestroy() {
    clearTimeout(this.timer_steel)
  }

  goback(): void {this.location.back()}
  checkAccessForUsecase(): any {
    if (!(this.ucases.indexOf('Steel Surface Anomaly Detection') > -1)) {
      this.router.navigate(['/unauthorized']);
    }
  }

  public computedt() {
    this.hours = new Date().getHours().toString();
    this.min = new Date().getMinutes().toString();
    this.secs = new Date().getSeconds().toString();
    this.day = new Date().getDate().toString();
    this.mon = new Date().getMonth();
    this.year = new Date().getFullYear().toString();

    if (this.hours.length < 2) {
      this.hours = "0" + this.hours;
    }
    if (this.min.length < 2) {
      this.min = "0" + this.min;
    }
    if (this.secs.length < 2) {
      this.secs = "0" + this.secs;
    }
    if (this.day.length < 2) {
      this.day = "0" + this.day;
    }

    this.date_time = this.hours + ":" + this.min + ":" + this.secs + ", " + this.ym[this.mon] + " " + this.day + ", " + this.year;


  }

  public computedt2() {
    this.hours = new Date().getHours().toString();
    this.min = new Date().getMinutes().toString();
    this.secs = new Date().getSeconds().toString();
    this.day = new Date().getDate().toString();
    this.mon = new Date().getMonth();
    this.year = new Date().getFullYear().toString();

    if (this.hours.length < 2) {
      this.hours = "0" + this.hours;
    }
    if (this.min.length < 2) {
      this.min = "0" + this.min;
    }
    if (this.secs.length < 2) {
      this.secs = "0" + this.secs;
    }
    if (this.day.length < 2) {
      this.day = "0" + this.day;
    }

    this.date_time2 = this.hours + ":" + this.min + ":" + this.secs + ", " + this.ym[this.mon] + " " + this.day + ", " + this.year;

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
      this.logger.info(this.uname, this.uname + " has been logged out");
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

  public start_steel() {

    Swal.fire({
      text: 'Steel Surface Inspection Operation has started',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    this.logger.info(this.uname, "Steel Surface Inspection Usecase started");
    this.steel_usecase();
  }

  public steel_usecase() {
    var x = (document.getElementById("btnstart") as HTMLButtonElement);
    var y = (document.getElementById("btnstop") as HTMLButtonElement);
    x.disabled = true;
    y.disabled = false;
    y.style.backgroundColor = '#343378';
    x.style.backgroundColor = '#0b66bb94';

    this.steelService.getSteelData()
      .subscribe(data => {

        if (this.sn == 0) {

          this.ssi_graph = new Chart("steel_graph", {
            type: 'bar',
            data: {
              labels: ['Normal', 'Crazing', 'Inclusion', 'Patches', 'Pitted', 'Rolled-In', 'Scratches', 'Total'],
              datasets: [{
                data: [0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: [
                  '#4bc0c0',
                  '#ff9503',
                  '#ffcd56',
                  '#ff9f40',
                  '#b864f8',
                  '#51dc82',
                  '#ff6384',
                  '#36a2eb'
                ],
                // borderColor: [
                //   '#2643C2',
                //   '#D4D82C',
                //   '#E35959',
                //   '#67665E',
                //   '#11ACCD',
                //   "#8600E3",
                //   '#4DC300',
                //   "#e48502"
                // ],
                borderWidth: 1,

                // hoverBackgroundColor: [
                //   '#2643C2',
                //   '#E7EB2B',
                //   '#E93030',
                //   '#67665E',
                //   '#11ACCD',
                //   "#8600E3",
                //   '#4DC300',
                //   "#e48502"
                // ]
              }]
            },
            options: {
              maintainAspectRatio: false,
              responsive: true,
              legend: {
                display: false
              },
              scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: "No. of Steel Surfaces"
                  },
                  ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 6
                  }
                }]
              }
            }
          });
        }

        this.steel_data = data;

        this.img_src = this.steel_data[this.sn]['SteelProcessedImagePath'];
        this.sid = this.steel_data[this.sn]['SteelSetName'];

        let steel_def = this.steel_data[this.sn]['SteelSetType'];
        let flag = 0;

        let snd = steel_def.split(' ')
        for (let i = 0; i < snd.length; i++) {
          if (snd[i] == 'Normal') {
            flag = 1;
            break;
          }
        }

        if (flag == 1) {
          this.obv = "Normal";
          this.def = "None";
          this.nm += 1;
          this.def_color = "#29FC08";
        }
        else {
          this.def_color = 'red';
          for (let i = 0; i < snd.length - 1; i++) {
            if (snd[i] == 'Crazing') {
              this.cr += 1;
            }
            if (snd[i] == 'Inclusion') {
              this.inc += 1;
            }
            if (snd[i] == 'Patches') {
              this.pat += 1;
            }
            if (snd[i] == 'Pitted') {
              this.pit += 1;
            }
            if (snd[i] == 'Rolled-In') {
              this.ris += 1;
            }
            if (snd[i] == 'Scratches') {
              this.sct += 1;
            }
          }

          this.obv = "Defective";
          this.def = snd[0];
          for (let i = 1; i < snd.length - 1; i++) {
            this.def += ", " + snd[i];
          }

        }
        this.tot += 1
        this.computedt();
        this.ssi_graph.data.datasets[0].data[0] = this.nm;
        this.ssi_graph.data.datasets[0].data[1] = this.cr;
        this.ssi_graph.data.datasets[0].data[2] = this.inc;
        this.ssi_graph.data.datasets[0].data[3] = this.pat;
        this.ssi_graph.data.datasets[0].data[4] = this.pit;
        this.ssi_graph.data.datasets[0].data[5] = this.ris;
        this.ssi_graph.data.datasets[0].data[6] = this.sct;
        this.ssi_graph.data.datasets[0].data[7] = this.tot;
        this.ssi_graph.update();


        this.timeline_child1 =
          '<li class=\"event1\">\
     <div class=\"card\" id =\"'+ this.sid + this.def + '\"\
     data-toggle=\"modal\" data-target=\"#popupSearch2\"\
     onclick=\"open_steel_timeline(\''+ [this.img_src, this.sid, this.obv, this.def] + '\')\">\
     <div class=\"card-body\" style="padding:0px;" ><p style="font-size:14px;">Serial  # <a>'
          + this.sid + '</a></p><p style="font-size:14px;margin:1px">' + this.obv + '</p></div></div></li>';




        let p1 = (<HTMLUListElement>document.getElementById('tmline1'))




        let x1 = p1.innerHTML;
        p1.innerHTML = this.timeline_child1;
        p1.innerHTML += x1;



        this.sn += 1;
        if (this.sn < this.steel_data.length) {
          this.timer_steel = setTimeout(() => {
            this.steel_usecase();
          }, 5000);
        }

      },
        (error) => {
          this.logger.error(this.uname, "Steel Surface API is not working. Error: " + JSON.stringify(error));
        });
  }

  public openpopup() {
    this.search_string = (<HTMLInputElement>document.getElementById('sch_label')).value;
    if (/[S][N][_][0-9]/.test(this.search_string) == true) {

      if (this.search_string.slice(0, 3) == 'SN_') {
        this.steel_id = this.search_string.slice(3);
        if (parseInt(this.steel_id) > 0 && parseInt(this.steel_id) <= this.sn) {
          this.logger.info(this.uname, "Steel No. " + this.search_string + " has been searched");
          this.sch_serial = this.search_string;
          let sid = this.steel_id;
          this.camp = this.steel_data[sid - 1]['SteelProcessedImagePath']
          let steel_type = this.steel_data[sid - 1]['SteelSetName'];

          let flag = 0;

          let snd = steel_type.split(' ')
          for (let i = 0; i < snd.length; i++) {
            if (snd[i] == 'Normal') {
              flag = 1;
              break;
            }
          }

          if (flag == 1) {
            this.sch_obv = "Normal";
            this.sch_def = "None";
            this.sch_def_color = "#29FC08";
          }
          else {
            this.sch_def_color = 'red';
            for (let i = 0; i < snd.length; i++) {

              this.sch_obv = "Defective";
              this.sch_def = snd[0];
              for (let i = 1; i < snd.length - 1; i++) {
                this.sch_def += ", " + snd[i];
              }

            }
            this.pop_disp = "block";
          }


        }
        else {
          window.alert("Steel with Serial " + this.search_string + " is not available till now");
          this.pop_disp = "none";
        }
      }
      else {
        window.alert("Invalid Serial Number, Please Enter in correct Format e.g. SN_<Number>");
        this.pop_disp = "none";
      }
    }
    else {
      window.alert("Invalid Serial Number, Please Enter in correct Format e.g. SN_<Number>");
      this.pop_disp = "none";
    }

  }

  public sch_box_focus() {

    this.sch_focus = true;
    (<HTMLInputElement>document.getElementById('sch_label')).value = "SN_";


  }
  public sch_box_nfocus() {
    this.sch_focus = false;

  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {

    if (event.key == "Enter" && (this.sch_focus == true || (<HTMLInputElement>document.getElementById('sch_label')).value != '')) {

      this.openModel();

    }


  }

  @HostListener('click', ['$event'])
  onButtonClickHandler(event: KeyboardEvent) {
    if ((<HTMLInputElement>document.getElementById('popupModal3')).className == "modal fade show") {
      this.closeModel();
    }

  }

  openModel() {
    var el = (<HTMLInputElement>document.getElementById('popupModal3'))
    el.className = "modal fade show";
    el.style.display = "block";
    el.style.paddingRight = "17px";

    this.openpopup();
  }

  closeModel() {
    var el = (<HTMLInputElement>document.getElementById('popupModal3'))
    el.style.display = "None";
    el.className = "modal fade"
  }

  public Stop() {

    Swal.fire({
      text: 'Steel Surface Inspection Operation has stopped',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    this.logger.info(this.uname, "Steel Surface Inspection Usecase has been stopped");
    clearTimeout(this.timer_steel)

    var x = (document.getElementById("btnstart") as HTMLButtonElement);
    var y = (document.getElementById("btnstop") as HTMLButtonElement);
    y.disabled = true;
    x.disabled = false;
    x.style.backgroundColor = '#343378';
    y.style.backgroundColor = '#0b66bb94';

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
      <img src=".\\assets\\img\\pop_steel.png" alt="Pop-up-Piston" style="width:966px;height: 500px;">\
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

  public timeline_click() {
    this.logger.info(this.uname, "Timeline has been clicked");
  }

  public consts_show() {
    var x = (document.getElementById("passw") as HTMLDivElement);
    x.style.display = "block";
  }
  public consts_hide() {
    var x = (document.getElementById("passw") as HTMLDivElement);

    x.style.display = "none";

  }

  @HostListener('document:keyup', ['$event'])
  onKeyupHandler(event: KeyboardEvent) {

    this.logout_timer = environment.logout_timer;



  }

  @HostListener('document:click', ['$event'])
  onClickHandler(event: MouseEvent) {

    this.logout_timer = environment.logout_timer;



  }

}
