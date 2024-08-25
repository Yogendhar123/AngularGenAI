import {
  Component,
  ViewEncapsulation,
  HostListener,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sol, usec, UserData } from 'src/app/model/model';
import { CommonService } from 'src/app/services/common.service';
import { LoggerService } from 'src/app/services/logger.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import '../../../assets/bootstrap.css';


@Component({
  selector: 'app-miscellaneous-home',
  templateUrl: './miscellaneous-home.component.html',
  styleUrls: ['./miscellaneous-home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MiscellaneousHomeComponent implements OnInit {
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
  public usecasesProductDesign: any = [];
  public usecasesSuppluChain: any = [];
  public usecasesPlantOperations: any = [];
  public usecasesFieldServices: any = [];
  public usecasesApplicationDevelopment: any = [];
  usecaseIdsToShow: number[] = [28,41, 42,]; // Update with the usecase ids you want to show
  usecaseIdsToShowPlant: number[] = [36,48,33];
  usecaseIdsToShowField: number[] = [37, 45,46];
  usecaseIdsToApplication: number[] = [47,39,40 ];
  usecaseIdsToSupply: number[] = [34,35,43];
 
  public logout_timer: any;
  public solns: any = [];
  usecaseShow=false

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
    this.solns = userInfo.Solutions;
    this.sessiontoken = userInfo.SessionToken;
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
    

    // const customOrder = [
    //   'Copilot for Engineering Drawings',
    //   'Copilot for supply chain manager',
    //   'Maintenance engineer copilot,',
    //   'Legacy Application Modernization',
    //   'Commodity price prediction',
      
    // ];
    // const ProductDesign =["Copilot for Engineering Drawings","2D to 3D Conversation","Generative Design"]
    // const SupplyChain=["Supply Chain Copilot","Commodity price prediction","Procurement Manager Copilot"]
    // const PlantOperations=["Maintenance Engineer copilot","Production Operator Copilot","Safety Engineer Copilot"]
    // const FieldServices=["Copilot for Field Service Engineer","Copilot for Remote Assistance","Copilot for Route Planning"]
    // const ApplicationDevelopment=["Application Modernization","Copilot for Ticket resolution","Call Center AHT reduction",""]
    // this.commonService.getUseCaseList(this.uid, 5).subscribe((data) => {
    //   this.usecasesProductDesign = ProductDesign
    //     .map((usecaseName) =>
    //       data.find(
    //         (usecase: { UsecaseName: string }) =>
    //           usecase.UsecaseName === usecaseName
    //       )
    //     )
    //     .filter(Boolean);


    //     this.usecasesSuppluChain = SupplyChain
    //     .map((usecaseName) =>
    //       data.find(
    //         (usecase: { UsecaseName: string }) =>
    //           usecase.UsecaseName === usecaseName
    //       )
    //     )
    //     .filter(Boolean);

    //     this.usecasesPlantOperations = PlantOperations
    //     .map((usecaseName) =>
    //       data.find(
    //         (usecase: { UsecaseName: string }) =>
    //           usecase.UsecaseName === usecaseName
    //       )
    //     )
    //     .filter(Boolean);

    //     this.usecasesFieldServices = FieldServices
    //     .map((usecaseName) =>
    //       data.find(
    //         (usecase: { UsecaseName: string }) =>
    //           usecase.UsecaseName === usecaseName
    //       )
    //     )
    //     .filter(Boolean);

    //     this.usecasesApplicationDevelopment = ApplicationDevelopment
    //     .map((usecaseName) =>
    //       data.find(
    //         (usecase: { UsecaseName: string }) =>
    //           usecase.UsecaseName === usecaseName
    //       )
    //     )
    //     .filter(Boolean);
    //     console.log(this.usecasesSuppluChain,"FS")
        

    //   // Filter out the use cases already included in customOrder
    //   // const remainingUseCases = data.filter(
    //   //   (usecase: { UsecaseName: string }) =>
    //   //     !customOrder.includes(usecase.UsecaseName)
    //   // );

    //   // // Add the remaining use cases to this.usecases
    //   // this.usecases.push(...remainingUseCases);
    // });







    this.commonService.getUseCaseList(this.uid, 5).subscribe((data) => {
      this.usecases = data.sort((a: { Enabled: string }, b: any) => {
        return a.Enabled === 'Y' ;
      });
      console.log(this.usecases,"usecase")
    
      this.usecasesProductDesign = this.usecases.filter((usecase: { UsecaseId: number }) => this.usecaseIdsToShow.includes(usecase.UsecaseId))

      this.usecasesProductDesign = this.usecases.filter((usecase: { UsecaseId: number; }) => this.usecaseIdsToShow.includes(usecase.UsecaseId));
      this.usecasesSuppluChain = this.usecases.filter((usecase: { UsecaseId: number; }) => this.usecaseIdsToSupply.includes(usecase.UsecaseId));
      this.usecasesPlantOperations = this.usecases
      .filter((usecase: { UsecaseId: number; }) => this.usecaseIdsToShowPlant.includes(usecase.UsecaseId))
      .sort((a: { UsecaseId: number; }, b: { UsecaseId: number; }) => {
          if (a.UsecaseId === 33) return 1;
          if (b.UsecaseId === 33) return -1;
          return 0;
      });
      const seenUsecaseIds = new Set<number>();
 
      this.usecasesApplicationDevelopment = this.usecases
        .filter((usecase: { UsecaseId: number }) => {
          if (this.usecaseIdsToApplication.includes(usecase.UsecaseId) && !seenUsecaseIds.has(usecase.UsecaseId)) {
            seenUsecaseIds.add(usecase.UsecaseId);
            return true;
          }
          return false;
        })
        .reverse(); // Reversing the array to show usecases in reverse order
      // this.usecasesApplicationDevelopment = this.usecases.filter((usecase: { UsecaseId: number; }) => this.usecaseIdsToApplication.includes(usecase.UsecaseId)).reverse();
      this.usecasesFieldServices = this.usecases.filter((usecase: { UsecaseId: number; }) => this.usecaseIdsToShowField.includes(usecase.UsecaseId));
     console.log(this.usecasesApplicationDevelopment)
     console.log(this.usecasesPlantOperations)
     this.usecaseShow=true
    });

    //Browser closing on Azure
    window.onbeforeunload = () => {
      this.commonService.logout(this.sessiontoken).subscribe();
    };
  }


  navigatURL(useCase:string){
    window.location.href=useCase

    
    // const SupplyChain={"Supply Chain Copilot":"https://genai-mfg-app.azurewebsites.net/#/chat",
    // "Commodity price prediction":"",
    // "Procurement Manager Copilot":""}
    // const url=SupplyChain["Supply Chain Copilot"];

    // if (url){
     
    // }else{
    //   console.log("url not found")
    // }

  }

  goback(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.logout_timer = environment.logout_timer;
  }

  checkAccessForSolution(): any {
    if (!(this.solns.indexOf('GenAI Usecases') > -1)) {
      this.router.navigate(['/unauthorized']);
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
}
