import { Component, ViewEncapsulation, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Sol, usec, UserData } from 'src/app/model/model';
import { LoggerService } from 'src/app/services/logger.service';
import { PowmanService } from './powman.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-powman',
  templateUrl: './powman.component.html',
  styleUrls: ['./powman.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PowmanComponent implements OnInit {

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
  public ucases: any = [];
  PowService: any;

  public mytime: any;
  public hours = '';
  public min = '';
  public secs = '';
  public day = '';
  public year = '';
  public mon = 0;
  public ym = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  public date_time = '';
  public logout_timer: any;
  public atv_clr = '#343378';
  public deatv_clr = '#0b66bb94';

  public timer_pow: any;


  public powdata: any;
  public curr_ref = '--:--:--';
  public next_ref = '--:--:--';
  public mc_1_time = '--:--:--';
  public mc_1_act = 'OFF';
  public mc_1_pred = 'OFF';
  public mc_1_conf = '100.00%';
  public mc_1_col = '#DBFEDA';
  public mc_1_bord = '#009F10';

  public mc_2_time = '--:--:--';
  public mc_2_act = 'OFF';
  public mc_2_pred = 'OFF';
  public mc_2_conf = '100.00%';
  public mc_2_col = '#DBFEDA';
  public mc_2_bord = '#009F10';

  public mc_3_time = '--:--:--';
  public mc_3_act = 'OFF';
  public mc_3_pred = 'OFF';
  public mc_3_conf = '100.00%';
  public mc_3_col = '#DBFEDA';
  public mc_3_bord = '#009F10';

  public mc_4_time = '--:--:--';
  public mc_4_act = 'OFF';
  public mc_4_pred = 'OFF';
  public mc_4_conf = '100.00%';
  public mc_4_col = '#DBFEDA';
  public mc_4_bord = '#009F10';

  public mc_5_time = '--:--:--';
  public mc_5_act = 'OFF';
  public mc_5_pred = 'OFF';
  public mc_5_conf = '100.00%';
  public mc_5_col = '#DBFEDA';
  public mc_5_bord = '#009F10';

  public mc_6_time = '--:--:--';
  public mc_6_act = 'OFF';
  public mc_6_pred = 'OFF';
  public mc_6_conf = '100.00%';
  public mc_6_col = '#DBFEDA';
  public mc_6_bord = '#009F10';

  public currdata: any;
  public index = 0;

  public api_data: any;
  public index_api = 0;


  constructor(private location: Location, private logger: LoggerService, private powservice: PowmanService, private router: Router, private route: ActivatedRoute, private commonService: CommonService) {
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
    this.powservice.deletePOWData().subscribe();
    this.logout_timer = environment.logout_timer;
  }

  goback(): void { this.location.back() }

  checkAccessForUsecase(): any {
    if (!(this.ucases.indexOf('Power Management - Shutdown Performance') > -1)) {
      this.router.navigate(['/unauthorized']);
    }
  }

  public getmodeldata() {
    this.powservice.getPOWData().subscribe((data) => {

      this.api_data = data;
      console.log(this.api_data);

      if (this.api_data.length != 0) {

        this.currdata = this.api_data;

        this.powdata = this.currdata[0]
        console.log(this.powdata);

        this.curr_ref = this.powdata["Date"] + ' ' + this.powdata["Current_Refresh_Time"] + ":00"
        this.next_ref = this.powdata["Next_Refresh_Date"] + ' ' + this.powdata["Next_Refresh_Time"] + ":00"

        if (this.index_api == 0) {
          this.mc_1_time = this.powdata["PS_ELEC"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_ELEC"]["datetime"].split(' ')[1] + ":00";
        }

        if (this.mc_1_act == 'ON' && this.powdata["PS_ELEC"]["ActualStatus"] == 0) {
          this.mc_1_time = this.powdata["PS_ELEC"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_ELEC"]["datetime"].split(' ')[1] + ":00";
        }

        if (this.mc_1_act == 'OFF' && this.powdata["PS_ELEC"]["ActualStatus"] == 1) {
          this.mc_1_time = this.powdata["PS_ELEC"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_ELEC"]["datetime"].split(' ')[1] + ":00";
        }

        if (this.powdata["PS_ELEC"]["ActualStatus"] == 1) {
          this.mc_1_act = "ON"
        }
        else {
          this.mc_1_act = "OFF";
        }

        if (this.powdata["PS_ELEC"]["PredictedStatus"] == 1) {
          this.mc_1_pred = "ON"
        }
        else {
          this.mc_1_pred = "OFF";
        }

        if (this.mc_1_act != this.mc_1_pred) {
          this.mc_1_col = '#FFBDBD';
          this.mc_1_bord = '#F93F3F';
        }
        if (this.mc_1_act == this.mc_1_pred) {
          this.mc_1_col = '#DBFEDA';
          this.mc_1_bord = '#009F10';
        }

        this.mc_1_conf = this.powdata["PS_ELEC"]["Confidence"].toFixed(2).toString() + "%";


        if (this.index_api == 0) {
          this.mc_2_time = this.powdata["PS_ELEC_CA"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_ELEC_CA"]["datetime"].split(' ')[1] + ":00";
        }

        if (this.mc_2_act == 'ON' && this.powdata["PS_ELEC_CA"]["ActualStatus"] == 0) {
          this.mc_2_time = this.powdata["PS_ELEC_CA"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_ELEC_CA"]["datetime"].split(' ')[1] + ":00";
        }

        if (this.mc_2_act == 'OFF' && this.powdata["PS_ELEC_CA"]["ActualStatus"] == 1) {
          this.mc_2_time = this.powdata["PS_ELEC_CA"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_ELEC_CA"]["datetime"].split(' ')[1] + ":00";
        }
        if (this.powdata["PS_ELEC_CA"]["ActualStatus"] == 1) {
          this.mc_2_act = "ON"
        }
        else {
          this.mc_2_act = "OFF";
        }

        if (this.powdata["PS_ELEC_CA"]["PredictedStatus"] == 1) {
          this.mc_2_pred = "ON"
        }
        else {
          this.mc_2_pred = "OFF";
        }

        if (this.mc_2_act != this.mc_2_pred) {
          this.mc_2_col = '#FFBDBD';
          this.mc_2_bord = '#F93F3F';
        }
        if (this.mc_2_act == this.mc_2_pred) {
          this.mc_2_col = '#DBFEDA';
          this.mc_2_bord = '#009F10';
        }

        this.mc_2_conf = this.powdata["PS_ELEC_CA"]["Confidence"].toFixed(2).toString() + "%";


        if (this.index_api == 0) {
          this.mc_3_time = this.powdata["PS_NG"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_NG"]["datetime"].split(' ')[1] + ":00";
        }

        if (this.mc_3_act == 'ON' && this.powdata["PS_NG"]["ActualStatus"] == 0) {
          this.mc_3_time = this.powdata["PS_NG"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_NG"]["datetime"].split(' ')[1] + ":00";
        }

        if (this.mc_3_act == 'OFF' && this.powdata["PS_NG"]["ActualStatus"] == 1) {
          this.mc_3_time = this.powdata["PS_NG"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_NG"]["datetime"].split(' ')[1] + ":00";
        }
        if (this.powdata["PS_NG"]["ActualStatus"] == 1) {
          this.mc_3_act = "ON"
        }
        else {
          this.mc_3_act = "OFF";
        }

        if (this.powdata["PS_NG"]["PredictedStatus"] == 1) {
          this.mc_3_pred = "ON"
        }
        else {
          this.mc_3_pred = "OFF";
        }

        if (this.mc_3_act != this.mc_3_pred) {
          this.mc_3_col = '#FFBDBD';
          this.mc_3_bord = '#F93F3F';
        }
        if (this.mc_3_act == this.mc_3_pred) {
          this.mc_3_col = '#DBFEDA';
          this.mc_3_bord = '#009F10';
        }

        this.mc_3_conf = this.powdata["PS_NG"]["Confidence"].toFixed(2).toString() + "%";


        if (this.index_api == 0) {
          this.mc_4_time = this.powdata["PS_HEAT"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_HEAT"]["datetime"].split(' ')[1] + ":00";
        }

        if (this.mc_4_act == 'ON' && this.powdata["PS_HEAT"]["ActualStatus"] == 0) {
          this.mc_4_time = this.powdata["PS_HEAT"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_HEAT"]["datetime"].split(' ')[1] + ":00";
        }

        if (this.mc_4_act == 'OFF' && this.powdata["PS_HEAT"]["ActualStatus"] == 1) {
          this.mc_4_time = this.powdata["PS_HEAT"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_HEAT"]["datetime"].split(' ')[1] + ":00";
        }
        if (this.powdata["PS_HEAT"]["ActualStatus"] == 1) {
          this.mc_4_act = "ON"
        }
        else {
          this.mc_4_act = "OFF";
        }

        if (this.powdata["PS_HEAT"]["PredictedStatus"] == 1) {
          this.mc_4_pred = "ON"
        }
        else {
          this.mc_4_pred = "OFF";
        }

        if (this.mc_4_act != this.mc_4_pred) {
          this.mc_4_col = '#FFBDBD';
          this.mc_4_bord = '#F93F3F';
        }
        if (this.mc_4_act == this.mc_4_pred) {
          this.mc_4_col = '#DBFEDA';
          this.mc_4_bord = '#009F10';
        }

        this.mc_4_conf = this.powdata["PS_HEAT"]["Confidence"].toFixed(2).toString() + "%";


        if (this.index_api == 0) {
          this.mc_5_time = this.powdata["PS_HEAT_CF"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_HEAT_CF"]["datetime"].split(' ')[1] + ":00";
        }

        if (this.mc_5_act == 'ON' && this.powdata["PS_HEAT_CF"]["ActualStatus"] == 0) {
          this.mc_5_time = this.powdata["PS_HEAT_CF"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_HEAT_CF"]["datetime"].split(' ')[1] + ":00";
        }

        if (this.mc_5_act == 'OFF' && this.powdata["PS_HEAT_CF"]["ActualStatus"] == 1) {
          this.mc_5_time = this.powdata["PS_HEAT_CF"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_HEAT_CF"]["datetime"].split(' ')[1] + ":00";
        }
        if (this.powdata["PS_HEAT_CF"]["ActualStatus"] == 1) {
          this.mc_5_act = "ON"
        }
        else {
          this.mc_5_act = "OFF";
        }

        if (this.powdata["PS_HEAT_CF"]["PredictedStatus"] == 1) {
          this.mc_5_pred = "ON"
        }
        else {
          this.mc_5_pred = "OFF";
        }

        if (this.mc_5_act != this.mc_5_pred) {
          this.mc_5_col = '#FFBDBD';
          this.mc_5_bord = '#F93F3F';
        }
        if (this.mc_5_act == this.mc_5_pred) {
          this.mc_5_col = '#DBFEDA';
          this.mc_5_bord = '#009F10';
        }

        this.mc_5_conf = this.powdata["PS_HEAT_CF"]["Confidence"].toFixed(2).toString() + "%";


        if (this.index_api == 0) {
          this.mc_6_time = this.powdata["PS_HEAT_PC"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_HEAT_PC"]["datetime"].split(' ')[1] + ":00";
        }

        if (this.mc_6_act == 'ON' && this.powdata["PS_HEAT_PC"]["ActualStatus"] == 0) {
          this.mc_6_time = this.powdata["PS_HEAT_PC"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_HEAT_PC"]["datetime"].split(' ')[1] + ":00";
        }

        if (this.mc_6_act == 'OFF' && this.powdata["PS_HEAT_PC"]["ActualStatus"] == 1) {
          this.mc_6_time = this.powdata["PS_HEAT_PC"]["datetime"].split(' ')[0] + ' ' + this.powdata["PS_HEAT_PC"]["datetime"].split(' ')[1] + ":00";
        }
        if (this.powdata["PS_HEAT_PC"]["ActualStatus"] == 1) {
          this.mc_6_act = "ON"
        }
        else {
          this.mc_6_act = "OFF";
        }

        if (this.powdata["PS_HEAT_PC"]["PredictedStatus"] == 1) {
          this.mc_6_pred = "ON"
        }
        else {
          this.mc_6_pred = "OFF";
        }

        if (this.mc_6_act != this.mc_6_pred) {
          this.mc_6_col = '#FFBDBD';
          this.mc_6_bord = '#F93F3F';
        }
        if (this.mc_6_act == this.mc_6_pred) {
          this.mc_6_col = '#DBFEDA';
          this.mc_6_bord = '#009F10';
        }

        this.mc_6_conf = this.powdata["PS_HEAT_PC"]["Confidence"].toFixed(2).toString() + "%";
        this.index_api = 1;

      }

      this.timer_pow = setTimeout(() => {
        this.getmodeldata();
      }, 2000);

    });
  }


  public pow_init() {
    Swal.fire({
      text: 'Power Manangement - Shutdown Performance has started',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    this.logger.info(this.uname, "PowMan Usecase started");

    var x = (document.getElementById("start_pow") as HTMLButtonElement);
    var y = (document.getElementById("stop_pow") as HTMLButtonElement);

    this.getmodeldata();
    x.disabled = true;
    y.disabled = false;
    this.deatv_clr = '#343378';
    this.atv_clr = '#0b66bb94';


  }

  //Stop Button
  public Stop() {

    Swal.fire({
      text: 'Power Manangement - Shutdown Performance has stopped',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    this.logger.info(this.uname, "FSW Usecase Stopped");
    clearTimeout(this.timer_pow);
    var x = (document.getElementById("start_pow") as HTMLButtonElement);
    var y = (document.getElementById("stop_pow") as HTMLButtonElement);

    x.disabled = false;
    y.disabled = true;

    this.atv_clr = '#343378';
    this.deatv_clr = '#0b66bb94';
  }

  public info_pop() 
  {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      html: '\
      <div>\
        <img src=".\\assets\\img\\pop_pow.png" alt="Pop-up-POW" style="width:950px;height: 500px;">\
      <div>\
      ',
      showClass: {
        popup: 'animated fadeIn',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass: {popup: 'animated fadeOut',},

      confirmButtonColor: '#4bc0c0',
      showCloseButton: true,
      showConfirmButton: true,
      width: 1120,
      confirmButtonText: 'Next page',
    }).then((result) => {
      if (result.isConfirmed) { this.info_pop_2();} 
    })
  }


  public info_pop_2() 
  {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      html: '\
      <div>\
        <img src=".\\assets\\img\\pop_pow_2.png" alt="Pop-up-POW" style="width:950px;height: 500px;">\
      <div>\
      ',
      showClass: {
        popup: 'animated fadeIn',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass: {popup: 'animated fadeOut',},

      confirmButtonColor: '#4bc0c0',
      showCloseButton: true,
      showConfirmButton: true,
      width: 1120,
      confirmButtonText: 'Previous page',

    }).then((result) => {
      if (result.isConfirmed) {this.info_pop();} 

    })
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
