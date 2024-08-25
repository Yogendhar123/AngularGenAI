import {
  Component,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { Location } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { VibrateComponentService } from './vibrate-component.service';
import * as Highcharts from 'highcharts';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vibration-meter',
  templateUrl: './vibration-meter.component.html',
  styleUrls: ['./vibration-meter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VibrationMeterComponent implements AfterViewInit {
  @ViewChild('iframeElement')
  iframeElement!: ElementRef;
  loader: boolean = false;
  toggleState: boolean = false;
  MachineID: string = '1';
  MAchineName: string = 'Centrifugal Pump';
  Power: string = '7.5HP';
  FlowRate: string = '7.8 m3/hr';
  xAxis: any;
  series: any;
  public rul_dial_water: any;
  timerInterval: any; // To hold the timer interval
  elapsedTime: number = 0; // To track elapsed time
  chartInstances: Highcharts.Chart[] = []; // To store chart instances
  clasNameUpdate:string=''

  

  data: any[] = [
    // Your data here
  ];
  currentClassName: string = '';

  constructor(
    private location: Location,
    private renderer: Renderer2,
    private apiService: VibrateComponentService,
    private http: HttpClient
  ) {}

  // ngAfterViewInit() {
  //   this.setIframeHeight();
  //   this.chartOptions.chart.events.load = this.onLoad.bind(this);
  //   Highcharts.chart('container', this.chartOptions);
  // }

  setIframeHeight() {
    console.log(this.iframeElement);
    const iframe = this.iframeElement.nativeElement;
    const parentDiv = iframe.parentElement;
    console.log(parentDiv);
    const parentHeight = parentDiv.clientHeight;
    console.log(parentHeight);

    this.renderer.setStyle(iframe, 'height', parentHeight + 'px');
  }

  ngAfterViewInit() {
    if (this.data.length > 0) {
      this.renderCharts();
    }
    this.GuageChart();
  }
  goback(): void {
    this.location.back();
  }
  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.elapsedTime++;
      document.getElementById('timerDisplay')!.innerText = `Elapsed Time: ${this.elapsedTime}s`;
    }, 1000); // Update timer every second
  }
 
  stopTimer(): void {
    clearInterval(this.timerInterval);
    this.elapsedTime = 0;
    document.getElementById('timerDisplay')!.innerText = `Elapsed Time: ${this.elapsedTime}s`;
  }
 
  onToggleChange(event: any): void {
    this.toggleState = event.checked;
    if (this.toggleState) {
      this.loader = true;

      this.apiService.getVibrate({}).subscribe(
        (response) => {
          console.log('Response:', response);
          this.loader = false;
          this.data = response;
          if (this.data.length > 0) {
            this.renderCharts();
            this.GuageChart();
            this.startTimer();
          }
        },
        (error) => {
          console.error('Error:', error);
          this.loader = false;
        }
      );
    } else {
      this.onStop()
    }
  }

  renderCharts() {
    const timeSeries = this.data.map((item) => item.TimeStamp);
    this.createChart(
      'chart-x',
      'X Axis Data',
      this.data.map((item) => item.x),
      timeSeries,
      this.data,
      'xPointDisplay',
      '#F04438'
    );
    this.createChart(
      'chart-y',
      'Y Axis Data',
      this.data.map((item) => item.y),
      timeSeries,
      this.data,
      'yPointDisplay',
      '#F79009'
    );
    this.createChart(
      'chart-z',
      'Z Axis Data',
      this.data.map((item) => item.z),
      timeSeries,
      this.data,
      'zPointDisplay',
      '#12B76A'
    );
  }

  createChart(
    container: string,
    title: string,
    seriesData: number[],
    categories: string[],
    data: any[],
    pointDisplayId: string,
    color: string
  ): void {
    const component = this; // Capture component context
    let chartInstance: Highcharts.Chart; // Variable to hold the chart instance
    let intervalId: any; // Variable to hold the interval ID

    const startEvent = () => {
      let dataIndex = 0; // Start from the beginning

      const interval = setInterval(() => {
        if (dataIndex < seriesData.length) {
          // Update class name and data points display
          const currentData = data[dataIndex];
          const className = currentData.className;
          const pointValue = seriesData[dataIndex];
          console.log(className,"class")
          this.clasNameUpdate=className


          // document.getElementById(
          //   'classNameDisplay'
          // )!.innerText = `${className}`;
          
          document.getElementById(pointDisplayId)!.innerText = `${pointValue}`;

          // Update visual effects based on className
          component.updateVisualEffects(className);

          // Add point to the series
          chartInstance.series[0].addPoint(seriesData[dataIndex], true, true);

          dataIndex++;
        } else {
          clearInterval(interval);
          setTimeout(startEvent, 2000); // Restart after a delay
        }
      }, 2000); // Adjust the interval to 2000 milliseconds (2 seconds)
    }

    Highcharts.chart(container, {
      chart: {
        type: 'spline',
        scrollablePlotArea: {
          minWidth: 100,
          scrollPositionX: 1,
        },
        events: {
          load: function () {
            chartInstance = this; // Assign the chart instance to the variable
            startEvent(); // Start the event when the chart loads
          },
        },
      },
      title: {
        text: '',
      },
      exporting: {
        enabled: false,
      },
      xAxis: {
        categories: categories,
        labels: {
          enabled: false, // Disable x-axis labels
        },
      },
      yAxis: {
        title: {
          text: null, // Remove y-axis title
        },
      },

      series: [
        {
          data: seriesData.slice(0, 10), // Initialize with the first 10 points
          type: 'spline',
          name: '', // Optional: Assign a name to the series
          color: color,
        },
      ],
      legend: {
        enabled: false, // Hide legend
      },
      credits: {
        enabled: false,
      },
    });
  }

  updateClassName() {
    setInterval(() => {
      const currentIndex = Math.min(10, this.data.length - 1);
      this.currentClassName = this.data[currentIndex].className;

      // Update visual effects based on className
      this.updateVisualEffects(this.currentClassName);
    }, 2000); // Adjust the interval to 2000 milliseconds (2 seconds)
  }

  updateVisualEffects(className: string) {
    // Reset all divs
    this.resetDivs();

    // Update specific divs based on className
    switch (className) {
      case 'normal':
        document.getElementById('normalDiv')?.classList.add('highlight');
        break;
      case 'bearing':
        document.getElementById('bearingDiv')?.classList.add('highlight');
        break;
      case 'misalignment':
        document.getElementById('misalignmentDiv')?.classList.add('highlight');
        break;
      case 'unbalanced':
        document.getElementById('unbalancedDiv')?.classList.add('highlight');
        break;
      default:
        // Handle other classes as needed
        break;
    }
  }


  getClassNameDisplay(className: string): string {
    switch (className) {
      case 'normal': return 'Normal';
      case 'bearing': return 'Bearing Fault';
      case 'misalignment': return 'Mis-alignment';
      case 'unbalanced': return 'Unbalanced';
      default: return 'NA';
    }
  }

  resetDivs() {
    // Reset all divs to default state
    const divIds = ['normalDiv', 'bearingDiv', 'misalignmentDiv', 'otherDiv']; // Adjust as per your HTML structure

    divIds.forEach((id) => {
      const div = document.getElementById(id);
      if (div) {
        div.classList.remove('highlight');
      }
    });
  }

  GuageChart() {
    Highcharts.chart('GuageLoad', {
      chart: {
        type: 'gauge',
      },
      title: {
        text: '',
      },
      exporting: {
        enabled: false,
      },
      pane: {
        startAngle: -120,
        endAngle: 120,
        background: [
          {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
        ],
      },
      yAxis: {
        min: 0,
        max: 10,

        minorTickInterval: 0,
        tickColor: '#ffffff',
        tickLength: 40,
        tickPixelInterval: 40,
        tickWidth: 2,
        lineWidth: 0,
        title: {
          text: '',
        },
        labels: {
          distance: 15,
        },
        plotBands: [
          {
            from: 0,
            to: 5,
            color: '#55BF3B',
            innerRadius: '82%',
            outerRadius: '50%',
          },
          {
            from: 5,
            to: 7,
            color: '#DDDF0D',
            innerRadius: '82%',
            outerRadius: '50%',
            zIndex: 1,
          },
          {
            from: 7,
            to: 10,
            color: '#DF5353',
            innerRadius: '82%',
            outerRadius: '50%',
          },
        ],
      },

      series: [
        {
          data: [7.5],
          type: 'gauge',
          name: 'Power', // Optional: Assign a name to the series
          tooltip: {
            valueSuffix: 'HP',
          },
          dataLabels: {
            enabled: false,
          },
        },
      ],
      legend: {
        enabled: false, // Hide legend
      },
      credits: {
        enabled: false,
      },
    });

    Highcharts.chart('GuageSpeed', {
      chart: {
        type: 'gauge',
      },
      title: {
        text: '',
      },
      exporting: {
        enabled: false,
      },
      pane: {
        startAngle: -120,
        endAngle: 120,
        background: [
          {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
        ],
      },
      yAxis: {
        min: 0,
        max: 10,

        minorTickInterval: 0,
        tickColor: '#ffffff',
        tickLength: 40,
        tickPixelInterval: 40,
        tickWidth: 2,
        lineWidth: 0,
        title: {
          text: '',
        },
        labels: {
          distance: 15,
        },
        plotBands: [
          {
            from: 0,
            to: 5,
            color: '#55BF3B',
            innerRadius: '82%',
            outerRadius: '50%',
          },
          {
            from: 5,
            to: 7,
            color: '#DDDF0D',
            innerRadius: '82%',
            outerRadius: '50%',
            zIndex: 1,
          },
          {
            from: 7,
            to: 10,
            color: '#DF5353',
            innerRadius: '82%',
            outerRadius: '50%',
          },
        ],
      },

      series: [
        {
          data: [7.8],
          type: 'gauge',
          name: 'Power', // Optional: Assign a name to the series
          tooltip: {
            valueSuffix: 'HP',
          },
          dataLabels: {
            enabled: false,
          },
        },
      ],
      legend: {
        enabled: false, // Hide legend
      },
      credits: {
        enabled: false,
      },
    });
  }



  resetCharts(): void {
    this.chartInstances.forEach(chart => {
      chart.series.forEach(series => {
        series.setData([], true); // Clear the series data
      });
    });
  }
 
  onStop(): void {
    this.stopTimer();
  
    this.resetCharts();
    
  }
}
