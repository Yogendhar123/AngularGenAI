import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { LoggerService } from 'src/app/services/logger.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { Sol, usec, UserData } from 'src/app/model/model';

@Component({
  selector: 'app-predictive-maintenance-home',
  templateUrl: './predictive-maintenance-home.component.html',
  styleUrls: ['./predictive-maintenance-home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PredictiveMaintenanceHomeComponent implements OnInit {
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
  public usecases: any = [];
  public logout_timer: any;
  public solns: any = [];

  constructor(
    private logger: LoggerService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private location: Location
  ) {
    const userInfo = <UserData>this.route.snapshot.data.UserData;
    this.uid = userInfo.UserId;
    this.uname = userInfo.UserName;
    this.fname = userInfo.FirstName;
    this.lname = userInfo.LastName;
    this.userrole = userInfo.Role;
    this.sessiontoken = userInfo.SessionToken;
    this.solns = userInfo.Solutions;
    this.checkAccessForSolution();
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
    const customOrder = [
      'Remaining Useful Life of Milling Cutter',
      'Tensile Strength Prediction of a Friction Stir Weld',
      'Acoustics Based Predictive Maintenance',
      'Condition monitoring  of Gearbox',
      'Power Management - Shutdown Performance',
      'Reflow Oven Health Profile',
      'Convection Oven Health Profile',
      'Detecting pump failure using vibration signals',
      'Global KPI'
    ];

    this.commonService.getUseCaseList(this.uid, 2).subscribe((data) => {
      this.usecases = customOrder
        .map((usecaseName) =>
          data.find(
            (usecase: { UsecaseName: string }) =>
              usecase.UsecaseName === usecaseName
          )
        )
        .filter(Boolean);

      // Filter out the use cases already included in customOrder
      const remainingUseCases = data.filter(
        (usecase: { UsecaseName: string }) =>
          !customOrder.includes(usecase.UsecaseName)
      );

      // Add the remaining use cases to this.usecases
      this.usecases.push(...remainingUseCases);
    });
    
   

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
    this.logger.info(this.uname, ' Predictive Solutions Page has opened');
  }

  checkAccessForSolution(): any {
    if (!(this.solns.indexOf('Condition Monitoring of Assets') > -1)) {
      this.router.navigate(['/unauthorized']);
    }
  }
}
