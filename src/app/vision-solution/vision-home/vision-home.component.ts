import {
  Component,
  ViewEncapsulation,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sol, usec, UserData } from 'src/app/model/model';
import { CommonService } from 'src/app/services/common.service';
import { LoggerService } from 'src/app/services/logger.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-vision-home',
  templateUrl: './vision-home.component.html',
  styleUrls: ['./vision-home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VisionHomeComponent implements OnInit, OnDestroy {
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
    private location: Location,
    private logger: LoggerService,
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
    this.solns = userInfo.Solutions;
    this.sessiontoken = userInfo.SessionToken;
    this.checkAccessForSolution();

    this.intSolutions = boostService.intSolutions;
    this.extSolutions = boostService.extSolutions;

    if (this.intSolutions.length == 0 && this.extSolutions.length == 0) {
      this.boostService.getSolutionList(this.uid).subscribe((data) => {
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
      boostService.intSolutions = this.intSolutions;
      boostService.extSolutions = this.extSolutions;
    }
    const customOrder = [
      'Piston Profile Inspection',
      'Fatigue Detection',
      'PCB Anomaly Detection',
      'Steel Surface Anomaly Detection',
      'Potato Chips Quality Inspection',
      'Intraocular Lens Inspection',
    ];

    this.boostService.getUseCaseList(this.uid, 1).subscribe((data) => {
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
      this.boostService.logout(this.sessiontoken).subscribe();
    };
  }

  checkAccessForSolution(): any {
    if (!(this.solns.indexOf('Computer Vision Use Cases') > -1)) {
      this.router.navigate(['/unauthorized']);
    }
  }

  goback(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.logout_timer = environment.logout_timer;
    this.logger.info(this.uname, 'Vision Solutions Page has opened');
  }

  @HostListener('document:keyup', ['$event'])
  onKeyupHandler(event: KeyboardEvent) {
    this.logout_timer = environment.logout_timer;
  }

  @HostListener('document:click', ['$event'])
  onClickHandler(event: MouseEvent) {
    this.logout_timer = environment.logout_timer;
  }

  ngOnDestroy() {}
}
