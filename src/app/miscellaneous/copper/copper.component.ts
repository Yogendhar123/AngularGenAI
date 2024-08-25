import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import '../../../assets/bootstrap.css';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsAccessibility from 'highcharts/modules/accessibility';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CopperServiceService } from './copper-service.service';
import { environment } from 'src/environments/environment';
import { ChangeDetectorRef } from '@angular/core';
import { TranslationService } from 'src/app/services/translation.service';
import { Language } from './language.enum';
import { LanguageService } from './language.service';

HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);
HighchartsAccessibility(Highcharts);
declare var Chart: any; // Ensure Chart.js is available globally
interface TypeMapping {
  value: string;
  display: string;
}
interface Data {
  [date: string]: string[];
}

// const dataValues = [
//   { date: '2024-02-12', value: '10000' },
//   { date: '2024-02-13', value: '20000' },
//   { date: '2024-02-14', value: '30000' },

//   { date: '2024-04-17', value: '20000' },
// ];

@Component({
  selector: 'app-copper',
  templateUrl: './copper.component.html',
  styleUrls: ['./copper.component.scss'],
})
export class CopperComponent implements OnInit {
  public coperpriceGrapg: any = [];
  slecttedValue: string;
  accuracy: any;
  actualValues = [];
  copperpricelive: any;
  forcastaccuracy: any;
  yesterdayHigh: any;
  yesterdayLow: any;
  predictValues = [];
  gaugeValue = 92.12;
  loader: boolean = false;

  dateVlues: any;
  yaxisValues: any;
  yaxixpreditvalues: any[] = [];
  buy1: any;
  buy2: any;
  // numbers = ["It's not just gold. Commodities from copper to cocoa are seeing huge gains in 2024.", "It's not just gold. Commodities from copper to cocoa are seeing huge gains in 2024.", "It's not just gold. Commodities from copper to cocoa are seeing huge gains in 2024.", "It's not just gold. Commodities from copper to cocoa are seeing huge gains in 2024."]; // Sample array of numbers
  scrollAnimation = 'scroll';
  data: Data = {};
  filteredData: string[] = [];
  currentIndex = 0;
  interval: any;

  dropdownval!: string;
  constructor(
    private location: Location,
    private http: HttpClient,
    private coperservice: CopperServiceService,
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService,
    private translationService: TranslationService
  ) {
    this.filterData();
  }

  filterData() {
    const today = new Date();
    const lastSevenDays = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // Calculate date 7 days ago
    const lastSevenDaysDate = lastSevenDays.toISOString().slice(0, 10); // Format to yyyy-mm-dd
    for (const key in this.data) {
      if (key >= lastSevenDaysDate && key <= today.toISOString().slice(0, 10)) {
        this.filteredData.push(...this.data[key]);
      }
    }
    console.log(this.filterData, 'Filter');
  }

  startScrolling() {
    const dataLength = this.filteredData.length;
    let currentIndex = 0; // Start from the beginning

    const scrollOnce = () => {
      this.currentIndex = currentIndex;
      currentIndex = (currentIndex + 1) % dataLength;
    };
  }

  ngOnInit(): void {
    // console.log(this.actualValues)
    this.createHalfDoughnutChart();
    console.log(this.translationService.getActiveLanguage());
  }
  goback(): void {
    this.location.back();
  }

  commodity = [
    { commodityKeys: 'Select Commodity', commodityValues: '' },
    { commodityKeys: 'Copper', commodityValues: 'HG=F' },
    { commodityKeys: 'Crude Oil', commodityValues: 'CL=F' },
    { commodityKeys: 'Aluminum', commodityValues: 'a' },
    { commodityKeys: 'Iron', commodityValues: 'I' },
    { commodityKeys: 'Silicon', commodityValues: '' },
    { commodityKeys: 'Magnesium', commodityValues: '' },
  ];

  onSelect(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.dropdownval = selectedValue;
    console.log(this.dropdownval, 'select');
    console.log(this.yaxixpreditvalues, 'pred');
    this.yaxixpreditvalues.length = 0;
    
    this.getSymbol(this.dropdownval);
   
   

    // this.yaxixpreditvalues.length=0


    // this.getSymbol(selectedValue);
  }

  ngAfterViewInit(): void {
    // this.generateChart();
    this.createHalfDoughnutChart();

    this.generateMarket();
    console.log(this.buy2, 'buy2');
  }

  AnalyseFunction() {
    console.log('analyse');
    this.getPridictdata(7, this.dropdownval);
  }

  getSymbol(value: string) {
    // this.loader = true;
    const sym = value;
    const baseurl = environment.API_URL;
    const url = 'commodity/symbol';
    const apicalluel = baseurl + url;

    // Call the DataService method to send the value
    this.http.post<any>(apicalluel, { sym }).subscribe(
      (data) => {
        this.loader = false;
        console.log(data, 'Symbol Api response'); // Log the response data
        this.loader = true;
        setTimeout(() => {
          this.loader = false;
          this.cdr.detectChanges();
          this.getAlldatavalues();
        }, 30000);
      },
      (error) => {
        this.loader = false;
        console.error('Error fetching data:', error);
      }
    );
  }

  getPridictdata(num_period: number, value: string): void {
    this.loader = true;
    const num_periods: number = 7;
    const sym = value;
    const baseurl = environment.API_URL;
    const url = 'commodity/predict';
    const apicalluel = baseurl + url;

    this.http.post<any>(apicalluel, { num_periods, sym }).subscribe(
      (data) => {
        this.loader = false;
        const today = new Date();
        const twoweeksdates = new Date(
          today.getTime() - 60 * 24 * 60 * 60 * 1000
        );
        const fomtadeddate = twoweeksdates.toISOString().split('T')[0];
        this.predictValues = data.answer.filter(
          (item: any) => new Date(item.date) >= twoweeksdates
        );
        const dates = this.predictValues.map((item: any) => item.date);
        const values = this.predictValues.map((item: any) => item.actual);
        const predict = this.predictValues.map((item: any) => item.predicted);
        this.dateVlues = dates;
        this.yaxisValues = values;
        this.yaxixpreditvalues = predict;
        console.log(
          this.dateVlues,
          this.yaxisValues,
          this.yaxixpreditvalues,
          'predit'
        );
        this.generateChart();
      },
      (error) => {
        this.loader = false;
        console.error('Error fetching data:', error);
      }
    );

    console.log(this.dropdownval, 'fun');

    // this.coperservice.predictApicall(7, this.dropdownval).subscribe(
    //   (response) => {
    //     this.loader=false
    //     this.predictValues=response.answer
    //     const dates=this.predictValues.map((item:any) => item.date);
    //     const values =this.predictValues.map((item:any) => item.actual);
    //     const predict=this.predictValues.map((item:any) => item.predicted);
    //     this.dateVlues=dates
    //     this.yaxisValues=values
    //     this.yaxixpreditvalues=predict
    //     console.log(this.dateVlues,this.yaxisValues,this.yaxixpreditvalues, 'predit');
    //     this.generateChart()

    //   },
    //   (error) => {
    //     this.loader=false
    //     // Handle error
    //     console.error(error);
    //   }
    // );
  }

  async getAlldatavalues() {
    console.log(this.dropdownval);
    const envUrl = environment.API_URL;
    const accuracyURl = 'commodity/accuracy';
    const actualURL = envUrl + accuracyURl;
    const sym = this.dropdownval;

    this.coperservice.getActualData().subscribe(
      (actualResponse) => {
        const today = new Date();
        const twoweeksdates = new Date(
          today.getTime() - 60 * 24 * 60 * 60 * 1000
        );
        const fomtadeddate = twoweeksdates.toISOString().split('T')[0];
        this.actualValues = actualResponse.answer.filter(
          (item: any) => new Date(item.date) >= twoweeksdates
        );
        console.log(this.actualValues, 'ACC');
        const dates = this.actualValues.map((item: any) => item.date);
        const values = this.actualValues.map((item: any) => item.value);
        this.dateVlues = dates;
        this.yaxisValues = values;
        console.log(this.actualValues, 'actualval');
        this.generateChart();
      },
      (error) => {
        console.error('Actualerror:', error);
      }
    );

    this.http.post<any>(actualURL, { sym }).subscribe(
      (accResponse) => {
        console.log(accResponse);
        this.forcastaccuracy = accResponse.ForecastAccuray;
        this.copperpricelive = accResponse.Current_price;
        this.yesterdayHigh = accResponse.yesterdays_high;
        this.yesterdayLow = accResponse.yesterdays_low;
        this.buy1 = accResponse.buyrange_1;
        this.buy2 = accResponse.buyrange_2;
        this.gaugeValue = accResponse.ForecastAccuray;

        this.forcastaccuracy = parseFloat(this.forcastaccuracy).toFixed(2);
        this.copperpricelive = parseFloat(this.copperpricelive).toFixed(2);
        this.yesterdayHigh = parseFloat(this.yesterdayHigh).toFixed(2);
        this.yesterdayLow = parseFloat(this.yesterdayLow).toFixed(2);
        this.buy1 = parseFloat(this.buy1).toFixed(2);
        this.buy2 = parseFloat(this.buy2).toFixed(2);

        // this.createHalfDoughnutChart()

        console.log(this.gaugeValue, 'accuracy');
      },
      (error) => {
        this.loader = false;
        console.error('Error fetching data:', error);
      }
    );

    // this.coperservice.getACCData(this.dropdownval).subscribe(

    //   (accResponse) => {
    //     console.log(accResponse);
    //     this.forcastaccuracy = accResponse.ForecastAccuray;
    //     this.copperpricelive = accResponse.Current_price;
    //     this.yesterdayHigh = accResponse.yesterdays_high;
    //     this.yesterdayLow = accResponse.yesterdays_low;
    //     this.buy1 = accResponse.buyrange_1;
    //     this.buy2 = accResponse.buyrange_2;
    //     this.gaugeValue = accResponse.ForecastAccuray;

    //     this.forcastaccuracy = parseFloat(this.forcastaccuracy).toFixed(2);
    //     this.copperpricelive = parseFloat(this.copperpricelive).toFixed(2);
    //     this.yesterdayHigh = parseFloat(this.yesterdayHigh).toFixed(2);
    //     this.yesterdayLow = parseFloat(this.yesterdayLow).toFixed(2);
    //     this.buy1 = parseFloat(this.buy1).toFixed(2);
    //     this.buy2 = parseFloat(this.buy2).toFixed(2);

    //     // this.createHalfDoughnutChart()

    //     console.log(this.gaugeValue, 'accuracy');
    //   },
    //   (error) => {
    //     console.error('Acccerror:', error);
    //   }
    // );

    const baseurl = environment.API_URL;
    const url = 'commodity/newsfeed';
    const apicalluel = baseurl + url;

    // Call the DataService method to send the value
    this.http.post<any>(apicalluel, {}).subscribe(
      (data) => {
        this.data = data;

        console.log(this.data, 'Feeds Api response'); // Log the response data
        this.filterData();
        this.startScrolling();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );

    this.generateMarket();
    this.createHalfDoughnutChart();
  }

  async generateChart() {
    // const today=new Date()
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD forma
    // // const yAxisMax = Math.ceil(maxYValue / 100) * 10; // Round up to the nearest 10
    // const dataValues = [
    //   { date: '2024-02-12', value: 5000, vpvalu: 10200 },
    //   { date: '2024-02-13', value: 8000, vpvalu: 20200 },
    //   { date: '2024-02-14', value: 10000, vpvalu: 30200 },
    //   { date: '2024-04-17', value: 22000, vpvalu: 34200 },
    //   { date: '2024-04-18', value: '', vpvalu: 25000 },
    //   { date: '2024-04-21', value: '', vpvalu: 23200 },
    //   { date: '2024-04-23', value: '', vpvalu: 34200 },
    //   { date: '2024-04-26', value: '', vpvalu: 35000 },
    // ];
    const alldates = this.dateVlues;
    const values = this.yaxisValues;
    const preditvalues = this.yaxixpreditvalues;
    let textLabel;
    if (this.dropdownval === 'HG=F') {
      textLabel = 'Copper Price Per Ton($)';
    } else if (this.dropdownval === 'CL=F') {
      textLabel = 'Crude Oil Price Per Barrel ';
    } else if (this.dropdownval === 'a') {
      textLabel = 'Alumininum Price Per Ton($)';
    } else if (this.dropdownval === 'I') {
      textLabel = 'Iron Price Per Ton($)';
    } else {
      textLabel = 'Per ton';
    }

    console.log(preditvalues, 'preditvalues');
    // const pvalues = dataValues.map((item:any) => item.vpvalu);

    Highcharts.chart('timeChart', {
      credits: {
        enabled: false,
      },
      chart: {
        type: 'spline',
      },
      exporting: {
        enabled: false,
      },
      title: {
        text: '',
      },

      xAxis: {
        type: alldates,
        categories: alldates, // Use dates array for x-axis,
        gridLineWidth: 0.5,
        labels: {
          step: 1,
          align: 'center',
          rotation: -90,
          y: 40,
          x: 10,
        },

        plotLines: [
          {
            value: alldates.indexOf(today) + 0.5, // Find the index of today's date in the categories array
            color: 'red',
            width: 2,
            zIndex: 5, // Ensure the plot line is above other elements
            label: {
              text: 'Today',
            },
            dashStyle: 'Dot',
          },
        ],
      },

      yAxis: {
        gridLineWidth: 1,

        title: {
          text: textLabel,
          style: {
            fontWeight: '800',
          },
        },
        // min:9000,
        // max:11500,
        // tickInterval:200
      },
      plotOptions: {
        series: {
          dataLabels: {
            align: 'center',
            y: 5,
          },
          pointPlacement: 'between',
        },
      },

      series: [
        {
          type: 'spline', // Specify the type of series (e.g., line, column, etc.)
          name: 'Actual',

          data: values,
          color: 'orange',
        },
        {
          type: 'spline', // Specify the type of series (e.g., line, column, etc.)
          name: 'Predicted',

          data: preditvalues,
          color: 'blue',
        },
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              chart: {
                height: 300,
              },
              navigator: {
                enabled: false,
              },
            },
          },
        ],
      },
    });
  }

  generateMarket() {
    // const yAxisMax = Math.ceil(maxYValue / 100) * 10; // Round up to the nearest 10
    const value = this.forcastaccuracy; // Example value

    Highcharts.chart('marketSentiment', {
      credits: {
        enabled: false,
      },
      chart: {
        type: 'gauge',
        width: '300',
        height: '300',
        backgroundColor: 'transparent',
      },
      title: {
        text: '',
      },
      exporting: {
        enabled: false,
      },
      pane: {
        startAngle: -90,
        endAngle: 89.9,
        center: ['50%', '70%'],
        size: '50%',
        background: [
          {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
        ],
      },

      yAxis: {
        min: 0,
        max: 60,
        tickPixelInterval: 55,
        tickPosition: 'inside',
        tickColor: '#FFFFFF',
        tickLength: 20,
        tickWidth: 2,
        labels: {
          distance: 20,
          style: {
            fontSize: '14px',
          },
        },
        lineWidth: 0,
        plotBands: [
          {
            from: 0,
            to: 60,
            color: '#55BF3B', // green
            thickness: 20,
          },
          // {
          //   from: 120,
          //   to: 160,
          //   color: '#DDDF0D', // yellow
          //   thickness: 20,
          // },
          // {
          //   from: 160,
          //   to: 200,
          //   color: '#DF5353', // red
          //   thickness: 20,
          // },
        ],
      },
      plotOptions: {},

      series: [
        {
          type: 'gauge', // Specify the type of series (e.g., line, column, etc.)
          name: 'Actual',

          data: this.forcastaccuracy,
          tooltip: {
            valueSuffix: ' %',
          },
          dataLabels: {
            format: '{y} %',
            borderWidth: 0,
            color:
              (Highcharts.defaultOptions.title &&
                Highcharts.defaultOptions.title.style &&
                Highcharts.defaultOptions.title.style.color) ||
              '#333333',
            style: {
              fontSize: '16px',
            },
          },
          dial: {
            radius: '80%',
            backgroundColor: 'gray',
            baseWidth: 12,
            baseLength: '0%',
            rearLength: '0%',
          },
          pivot: {
            backgroundColor: 'gray',
            radius: 6,
          },
        },
      ],
    });
  }

  getColorForValue(value: number): string {
    if (value >= 0 && value <= 50) {
      return '#D92D20';
    } else if (value > 50 && value <= 90) {
      return '#DC6803';
    } else if (value >= 90 && value <= 100) {
      return '#039855';
    } else {
      return 'black';
    }
  }

  createHalfDoughnutChart() {
    const ctx = document.getElementById(
      'rul_graph_water5'
    ) as HTMLCanvasElement;

    const percentage = this.gaugeValue; // Assuming gaugeValue is a percentage
    console.log(this.gaugeValue, 'create');

    const myHalfDoughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [this.gaugeValue, 100 - this.gaugeValue], // Calculate remaining percentage
            backgroundColor: [
              this.getColorForValue(this.gaugeValue),
              'lightgray',
            ], // Green for filled part, lightgray for remaining
          },
        ],
      },
      options: {
        cutout: '50%',
        rotation: -0.5 * Math.PI,
        circumference: Math.PI,
      },
    });
  }
}
