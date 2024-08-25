import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { KpiService } from './kpi.service';
import { DatePipe } from '@angular/common';

import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsAccessibility from 'highcharts/modules/accessibility';

HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);
HighchartsAccessibility(Highcharts);

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-kpi-component',
  templateUrl: './kpi-component.component.html',
  styleUrls: ['./kpi-component.component.scss'],
})
export class KpiComponentComponent implements OnInit {
  constructor(
    private location: Location,
    private kpiService: KpiService,
    private router: Router,
    private datepipe: DatePipe
  ) {}

  activeButton: number = 1; // Default to the first button being active
  selectedDate: string | null = null;
  selectedDate2: string | null = null;
  kpiapidata = [];
  uniqueTrainoValues: string[] = [];
  startDate: any;
  endDate: any;
  selectedTraino: string = 'TRAINO-20';
  TotaldownTimeMorning: any;
  TotaldownTimeAfternoon: any;
  TotaldownTimeEvening: any;
  TotalGoodlengthMorning: any;
  TotalGoodlengthAfternoon: any;
  TotalGoodlengthEvevning: any;
  TotalDefectlengthMorning: any;
  TotalDefectlengthAfternoon: any;
  TotalDefectlengthEvening: any;
  OEEMORNING: any;
  OEEAFTERNOON: any;
  OEEEVENING: any;
  AvalMrng: any;
  AvalAft: any;
  AvalEnv: any;
  PerMrng: any;
  PerAft: any;
  PerEvn: any;
  QalMrng: any;
  QalAft: any;
  QalEvn: any;
  OEE: any;
  AVALABILITY: any;
  PERFORMANCE: any;
  QUALITY: any;
  TotalPieceProduced: any;
  TotalProductLength: any;
  chartData: any = {};
  blinker = false;
  blinkgray = true;

  selectedActivityid!: string;
  selectedCaseid!: string;
  selectedProcessid!: string;
  kpiFYPdata = [];
  activities: string[] = [];
  process: string[] = [];
  filteredDataFYP!: any[];
  selectedDateid!: string;
  uniqueCase: string[] = [];
  uniqueCaseFYPD: string[] = [];
  process1: any;
  process2: any;
  process3: any;

  FYP!: any;
  QTYC!: any;
  QTYR!: any;
  QTYM!: any;

  min = 0;
  max = 100;
  sliderValue = 0;

  getTrackBackground() {
    if (this.sliderValue <= 50) {
      return 'red';
    } else if (this.sliderValue <= 90) {
      return 'yellow';
    } else {
      return 'green';
    }
  }

  onSliderChange(newValue: number) {
    this.sliderValue = newValue;
  }

  // public chartOptions: any = {
  //   series: [
  //     {
  //       name: "My-series",
  //       data: []
  //     }
  //   ],
  //   chart: {

  //     type: "area"
  //   },
  //   dataLabels: {
  //     enabled: false
  //   },

  //   fill: {
  //     type: "gradient",
  //     color:" rgba(62, 71, 132, 1)",
  //     gradient: {
  //       shadeIntensity: 1,
  //       opacityFrom: 0.7,
  //       opacityTo: 0.9,
  //       stops: [0, 90, 100]
  //     }
  //   },
  //   xaxis: {
  //     categories: ["Morning", "Afternoon", "Evening"]
  //   }
  // };

  goback(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.KPIDATA();
    this.KPIDATAFYP();

    this.logAllValues();
  }
  ngAfterViewInit(): void {
    this.generateChart();
    this.generatebarChart();
    this.blinkgray = true;
    this.logAllValues();
  }

  KPIDATA() {
    this.kpiService.getKPI().subscribe(
      (response: any) => {
        this.kpiapidata = response;

        this.uniqueTrainoValues = Array.from(
          new Set(response.map((item: any[]) => item[0]))
        );
        console.log(this.uniqueTrainoValues);
        this.logAllValues();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  setActiveButton(buttonNumber: number) {
    this.activeButton = buttonNumber;
  }
  onDateChange(event: any, type: string) {
    const formattedDate = this.datepipe.transform(event.value, 'MM/dd/yyyy');
    if (type === 'start') {
      this.startDate = formattedDate;
    } else if (type === 'end') {
      this.endDate = formattedDate;
    }
    if (this.startDate && this.endDate) {
      this.postDataToApi1();
      this.postDataToApi();
    }
  }

  onSelectChange(event: any) {
    this.selectedTraino = event.target.value;
    this.logAllValues();
  }
  logAllValues() {
    if (this.startDate && this.endDate && this.selectedTraino) {
      this.postDataToApi1();
      this.postDataToApi();
    }
  }
  postDataToApi1(): void {
    console.log(this.startDate, this.endDate, this.selectedTraino);
    this.kpiService
      .postDataOEE1(this.startDate, this.endDate, this.selectedTraino)
      .subscribe(
        (response) => {
          console.log('API Response:', response);
          // Handle the response as needed
          this.TotaldownTimeMorning =
            response.average_oee.morning.downtimelevel;
          this.TotaldownTimeAfternoon =
            response.average_oee.afternoon.downtimelevel;
          this.TotaldownTimeEvening =
            response.average_oee.evening.downtimelevel;
          this.TotalGoodlengthMorning = response.average_oee.morning.goodlength;
          this.TotalGoodlengthAfternoon =
            response.average_oee.afternoon.goodlength;
          this.TotalGoodlengthEvevning =
            response.average_oee.evening.goodlength;
          this.TotalDefectlengthMorning =
            response.average_oee.morning.defectivelength;
          this.TotalDefectlengthAfternoon =
            response.average_oee.afternoon.defectivelength;
          this.TotalDefectlengthEvening =
            response.average_oee.evening.defectivelength;
          this.OEEMORNING = response.average_oee.morning.oee.toFixed(2);
          this.OEEAFTERNOON = response.average_oee.afternoon.oee.toFixed(2);
          this.OEEEVENING = response.average_oee.evening.oee.toFixed(2);
          this.AvalMrng = response.average_oee.morning.availability.toFixed(2);
          this.AvalAft = response.average_oee.afternoon.availability.toFixed(2);
          this.AvalEnv = response.average_oee.evening.availability.toFixed(2);
          this.PerMrng = response.average_oee.morning.performance.toFixed(2);
          this.PerAft = response.average_oee.afternoon.performance.toFixed(2);
          this.PerEvn = response.average_oee.evening.performance.toFixed(2);
          this.QalMrng = response.average_oee.morning.quality.toFixed(2);
          this.QalAft = response.average_oee.afternoon.quality.toFixed(2);
          this.QalEvn = response.average_oee.evening.quality.toFixed(2);
          // console.log(this.QalMrng)

          // this.createLincchart()
          // this.createbarchartmix()
          // this.createSplineChart()
          this.generateChart();
          this.generatebarChart();
          this.blinkgray = false;
          this.blinker = true;
          this.chartData = {
            series: [
              {
                name: 'Sales',
                data: [
                  response.average_oee.morning.downtimeleve,
                  response.average_oee.afternoon.downtimeleve,
                  response.average_oee.evening.downtimeleve,
                ],
              },
            ],
            chart: {
              height: 350,
              type: 'bar',
            },
            xaxis: {
              categories: ['Jan', 'Feb', 'Mar'],
            },
          };
        },
        (error) => {
          console.error('API Error:', error);
          // Handle the error
        }
      );
  }
  postDataToApi(): void {
    this.kpiService
      .postDataOEE(this.startDate, this.endDate, this.selectedTraino)
      .subscribe(
        (response) => {
          console.log('API Response:', response);
          // Handle the response as needed
          this.OEE = response.average_oee.oee.toFixed(2);
          this.AVALABILITY = response.average_oee.availability.toFixed(2);
          this.PERFORMANCE = response.average_oee.performance.toFixed(2);
          this.QUALITY = response.average_oee.quality.toFixed(2);
          this.TotalProductLength =
            response.average_oee.totalproductlength.toFixed(2);
          this.TotalPieceProduced =
            response.average_oee.totalpiecesproduced.toFixed(2);

          // console.log( this.OEE,this.AVALABILITY,this.PERFORMANCE,this.AVALABILITY)
          // const canvasIds = ['plantOEE', 'plantOEE1', 'plantOEE2', 'plantOEE3'];
          // const gaugeValues = [this.OEE,  this.AVALABILITY,this.PERFORMANCE, this.QUALITY]; // Replace with your actual gauge values

          // canvasIds.forEach((canvasId, index) => {
          //   const gaugeValue = gaugeValues[index];
          //   this.createHalfDoughnutChart(canvasId, gaugeValue);
          // });
        },
        (error) => {
          console.error('API Error:', error);
          // Handle the error
        }
      );
  }
  KPIDATAFYP() {
    this.kpiService.getKPIFYP().subscribe(
      (response: any) => {
        this.kpiFYPdata = response;

        this.uniqueCase = Array.from(
          new Set(response.map((item: any[]) => item[1]))
        );
        this.uniqueCaseFYPD = Array.from(
          new Set(response.map((item: any[]) => item[1]))
        );

        this.activities = Array.from(
          new Set(response.map((item: any[]) => item[2]))
        );

        this.process = Array.from(
          new Set(response.map((item: any[]) => item[8]))
        );

        this.uniqueCase.sort((a, b) => {
          const numA = parseInt(a.replace('Case', ''));
          const numB = parseInt(b.replace('Case', ''));
          return numA - numB;
        });
        this.uniqueCaseFYPD.sort((a, b) => {
          const numA = parseInt(a.replace('Case', ''));
          const numB = parseInt(b.replace('Case', ''));
          return numA - numB;
        });
        this.activities.sort((a, b) => a.localeCompare(b));
        this.process.sort((a, b) => {
          const numA = parseInt(a.replace('Process', ''));
          const numB = parseInt(b.replace('Process', ''));
          return numA - numB;
        });
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  postDataToApi2(): void {
    this.kpiService.postFYPD(this.selectedCaseid).subscribe(
      (response) => {
        console.log('API Response:', response);
        // Handle the response as needed
        // this.overall_fyp=response.overall_fpy.toFixed(2)
        this.process1 = response.process1;
        this.process2 = response.process2;
        this.process3 = response.process3;

        console.log(this.process1, this.process2, this.process3);

        this.generatebarChartFYP();
      },
      (error) => {
        console.error('API Error:', error);
        // Handle the error
      }
    );
  }
  filterDataFYP(): void {
    console.log(
      this.selectedCaseid,
      this.selectedActivityid,
      this.selectedProcessid,
      this.selectedDateid
    );
    if (
      this.selectedCaseid &&
      this.activities &&
      this.process &&
      this.selectedDateid
    ) {
      console.log(
        this.selectedCaseid,
        this.selectedActivityid,
        this.selectedProcessid,
        this.selectedDateid
      );
      this.postDataToApi2();

      console.log(this.kpiFYPdata, 'kD');

      this.filteredDataFYP = this.kpiFYPdata.filter(
        (item) =>
          item[1] === this.selectedCaseid &&
          item[2] === this.selectedActivityid &&
          item[8] === this.selectedProcessid &&
          item[6] === this.selectedDateid.split('-').reverse().join('-')
      );

      this.FYP = this.filteredDataFYP.map((item) => item[7]);
      this.QTYC = this.filteredDataFYP.map((item) => item[3]);
      this.QTYR = this.filteredDataFYP.map((item) => item[4]);
      this.QTYM = this.filteredDataFYP.map((item) => item[5]);

      console.log(this.filteredDataFYP, 'FD');
      console.log(this.FYP, this.QTYC, this.QTYR, this.QTYM);
    }
  }
  getColorForValue(value: number): string {
    if (value >= 0 && value <= 50) {
      return 'rgba(180, 35, 24, 1)';
    } else if (value > 50 && value <= 70) {
      return '#DC6803';
    } else if (value >= 70 && value <= 100) {
      return 'rgba(2, 122, 72, 1)';
    } else {
      return 'rgba(102, 112, 133, 1)';
    }
  }

  getColorFormeters(value: number): string {
    if (value >= 0) {
      return '#020362';
    } else {
      return 'rgba(102, 112, 133, 1)';
    }
  }

  getBGColorForValue(value: number): string {
    if (value >= 0 && value <= 50) {
      return 'rgba(254, 243, 242, 1)';
    } else if (value > 50 && value <= 70) {
      return 'rgba(255, 250, 235, 1)';
    } else if (value >= 70 && value <= 100) {
      return 'rgba(236, 253, 243, 1)';
    } else {
      return 'white';
    }
  }
  getBorderColorForValue(value: number): string {
    if (value >= 0 && value <= 50) {
      return '1px solid rgba(253, 162, 155, 1)';
    } else if (value > 50 && value <= 70) {
      return '1px solid rgba(254, 200, 75, 1)';
    } else if (value >= 70 && value <= 100) {
      return '1px solid rgba(208, 213, 221, 1)';
    } else {
      return 'none';
    }
  }

  getColorouterForValue(value: number): string {
    if (value >= 0 && value <= 50) {
      return 'rgba(240, 68, 56, 1)';
    } else if (value > 50 && value <= 70) {
      return 'rgba(247, 144, 9, 1)';
    } else if (value >= 70 && value <= 100) {
      return 'rgba(18, 183, 106, 1)';
    } else {
      return 'gray';
    }
  }

  generateChart() {
    const maxYValue = Math.ceil(
      Math.max(
        this.TotaldownTimeMorning,
        this.TotalGoodlengthAfternoon,
        this.TotaldownTimeEvening
      )
    ); // Find the maximum value in the data and round it up
    // const yAxisMax = Math.ceil(maxYValue / 100) * 10; // Round up to the nearest 10

    Highcharts.chart('timeChart', {
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      chart: {
        type: 'areaspline',
      },
      title: {
        text: ' ',
      },
      xAxis: {
        categories: ['Morning', 'Afternoon', 'Evening'],
      },
      yAxis: {
        title: {
          text: 'Value',
          style: {
            fontWeight: '700',
          },
        },

        tickInterval: 10,
      },
      series: [
        {
          type: 'line', // Specify the type of series (e.g., line, column, etc.),
          name: '',
          showInLegend: false,
          color: '#1849A9',

          data: [
            this.TotaldownTimeMorning,
            this.TotaldownTimeAfternoon,
            this.TotalDefectlengthEvening,
          ], // Sample y-axis values
        },
      ],
    });
  }

  generatebarChart() {
    Highcharts.chart('barstackedchart', {
      chart: {
        type: 'column',
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      title: {
        text: ' ',
      },
      xAxis: {
        categories: ['Morning', 'Afternoon', 'Evening'],
        title: {
          text: '',
        },
      },
      yAxis: {
        min: 0,
        tickInterval: 10,
        title: {
          text: 'Consumption in Kwh',
          style: {
            fontWeight: '700',
          },
        },
      },
      plotOptions: {
        column: {
          stacking: 'normal',
        },
        series: {
          marker: {
            radius: 6,
          },
        },
      },
      series: [
        {
          type: 'column', // Specify the type of series (e.g., line, column, etc.)
          name: 'Good Parts',
          showInLegend: false,
          data: [
            this.TotalDefectlengthMorning,
            this.TotalDefectlengthAfternoon,
            this.TotalDefectlengthEvening,
          ], // Sample y-axis values
          color: 'rgba(3, 152, 85, 1)',
          pointWidth: 32,
          borderRadius: 8,
        },
        {
          type: 'column', // Specify the type of series (e.g., line, column, etc.)
          name: 'Defect Parts',
          showInLegend: false,
          data: [
            this.TotalDefectlengthMorning,
            this.TotalDefectlengthAfternoon,
            this.TotalDefectlengthEvening,
          ], // Sample y-axis values
          color: 'rgba(217, 45, 32, 1)',
          pointWidth: 32,
          borderRadius: 8,
        },
      ],
    });
  }

  generatebarChartFYP() {
    Highcharts.chart('barchartFYP', {
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      chart: {
        type: 'column',
      },
      title: {
        text: ' ',
      },
      xAxis: {
        categories: ['Process1', 'Process2', 'Process3'],
        // title: {
        //   text: 'Time of Day',
        // },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Yield',
          style: {
            fontWeight: '800',
          },
        },
      },
      plotOptions: {
        column: {
          stacking: 'normal',
        },
        series: {
          marker: {
            radius: 6,
          },
        },
      },
      series: [
        {
          type: 'column', // Specify the type of series (e.g., line, column, etc.)
          name: 'Processes',
          data: [this.process1, this.process2, this.process3], // Sample y-axis values
          color: 'rgba(3, 152, 85, 1)',
          pointWidth: 32,
          borderRadius: 8,
        },
      ],
    });
  }
}
