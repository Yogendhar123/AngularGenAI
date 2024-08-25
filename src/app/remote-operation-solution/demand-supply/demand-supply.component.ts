import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);
HighchartsAccessibility(Highcharts);

interface ResponseData {
  SKU: string;
  Gower: string;
  Allocated: number;
}

@Component({
  selector: 'app-demand-supply',
  templateUrl: './demand-supply.component.html',
  styleUrls: ['./demand-supply.component.scss'],
})
export class DemandSupplyComponent implements OnInit {
  constructor(private location: Location, private http: HttpClient,  private snackBar: MatSnackBar) {}
  loader = false;
  data: ResponseData[] = [];
  sku1Data: ResponseData[] = [];
  sku2Data: ResponseData[] = [];
  sku3Data: ResponseData[] = [];
  colors: string[] = ['17-20', '19-21', '18-20', '17-21'];
  selectedColorSKU1: string = this.colors[0]; // Default value
  selectedColorSKU2: string = this.colors[0]; // Default value
  selectedColorSKU3: string = this.colors[0]; // Default value
  specificgravity: string[] = [
    '1.5-2.5',
    '1.8-3',
    '1.5-3.2',
    '1.5-2',
    '1.8-3',
    '1.5-3',
    '1.4-3.2',
  ];
  currentSlide = 0;
  supplierStock = 0;
  stock = 0;
  sku1Color!: string;
  //  sku1 inputs
  sku1Quality: number = 0;
  sku1Factor: number = 0;
  sku1Raw: number = 0;
  //  sku2 inputs
  sku2Quality: number = 0;
  sku2Factor: number = 0;
  sku2Raw: number = 0;
  //  sku3 inputs
  sku3Quality: number = 0;
  sku3Factor: number = 0;
  sku3Raw: number = 0;
  // supplier inputs
  supplier1: any = 0;
  supplier2: any = 0;
  supplier3: any = 0;
  supplier4: any = 0;
  supplier5: any = 0;
  supplier6: any = 0;
  Supplier_Stock_Avaliability: any = 0;
  Supplier_Stock_Consumption:any=0

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.generatebarChartFYP();
    this.supplierStockTotal();
  }
  goback(): void {
    this.location.back();
  }

  onColorChangeSku1(event: any): void {
    this.selectedColorSKU1 = event.target.value;
  }
  onColorChangeSku2(event: any): void {
    this.selectedColorSKU2 = event.target.value;
  }
  onColorChangeSku3(event: any): void {
    this.selectedColorSKU3 = event.target.value;
  }

  navigate(direction: string): void {
    const totalSlides = document.querySelectorAll('.slide').length;
 
    if (direction === 'next') {
      this.currentSlide = (this.currentSlide + 1) % totalSlides;
    } else if (direction === 'prev') {
      this.currentSlide = (this.currentSlide - 1 + totalSlides) % totalSlides;
    }
  }

  
  navigateStock(direction: string): void {
    const slides = document.querySelectorAll('.slide1');
    const totalSlides = slides.length;

    if (direction === 'next') {
      this.supplierStock = (this.supplierStock + 1) % totalSlides;
    } else {
      this.supplierStock = (this.supplierStock - 1 + totalSlides) % totalSlides;
    }
  }

  navigateScheduler(direction: string): void {
    const slides = document.querySelectorAll('.slide2');
    const totalSlides = slides.length;

    if (direction === 'next') {
      this.stock = (this.stock + 1) % totalSlides;
    } else {
      this.stock = (this.stock - 1 + totalSlides) % totalSlides;
    }
  }

  // sku1 functions
  sku1Rawinput() {
    this.sku1Raw = this.sku1Quality * this.sku1Factor;
  }
  sku1FactorySlider(value: number) {
    this.sku1Quality = value + 1000;
  }
  updateSku1Demad() {
    this.sku1Raw = this.sku1Quality * this.sku1Factor;
  }
  updateSku1Factor() {
    this.sku1Raw = this.sku1Quality * this.sku1Factor;
  }

  // sku2 functions
  sku2Rawinput() {
    this.sku2Raw = this.sku2Quality * this.sku2Factor;
  }
  sku2FactorySlider(value: number) {
    this.sku2Quality = value + 1000;
  }
  updatesku2Demad() {
    this.sku2Raw = this.sku2Quality * this.sku2Factor;
  }
  updatesku2Factor() {
    this.sku2Raw = this.sku2Quality * this.sku2Factor;
  }

  // sku3 functions
  sku3Rawinput() {
    this.sku3Raw = this.sku3Quality * this.sku3Factor;
  }
  sku3FactorySlider(value: number) {
    this.sku3Quality = value + 1000;
  }
  updatesku3Demad() {
    this.sku3Raw = this.sku3Quality * this.sku3Factor;
  }
  updatesku3Factor() {
    this.sku3Raw = this.sku3Quality * this.sku3Factor;
  }

  supplierStockTotal(): void {
    const sup1 = parseFloat(this.supplier1) || 0;
    const sup2 = parseFloat(this.supplier2) || 0;
    const sup3 = parseFloat(this.supplier3) || 0;
    const sup4 = parseFloat(this.supplier4) || 0;
    const sup5 = parseFloat(this.supplier5) || 0;
    const sup6 = parseFloat(this.supplier6) || 0;

    const supplierStockValue = sup1 + sup2 + sup3 + sup4 + sup5 + sup6;
    console.log(supplierStockValue);
    this.Supplier_Stock_Avaliability = supplierStockValue;
  }
  // sku1 select
  Sku1Select(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.sku1Color = selectedValue.replace(/"/g, '');
    console.log(this.sku1Color);
  }

  demadSupplierPostApi() {
   

    if(this.supplier1=="0"){
      this.showSnackbar('Please add availability for supplier', 'error-snackbar');

    }else{
      this.loader = true;
    const [part1Sku1, part2Sku1] = this.selectedColorSKU1
      .split('-')
      .map(Number);
    const [part1Sku2, part2Sku2] = this.selectedColorSKU2
      .split('-')
      .map(Number);
    const [part1Sku3, part2Sku3] = this.selectedColorSKU3
      .split('-')
      .map(Number);
    const data = {
      demand: {
        SKU1: this.sku1Quality,
        SKU2: this.sku2Quality,
        SKU3: this.sku3Quality,
      },
      requirements: {
        SKU1: this.sku1Raw,
        SKU2: this.sku2Raw,
        SKU3: this.sku3Raw,
      },
      color: {
        SKU1: [part1Sku1, part2Sku1],
        SKU2: [part1Sku2, part2Sku2],
        SKU3: [part1Sku3, part2Sku3],
      },
      raw: {
        Grower1: this.supplier1,
        Grower2: this.supplier2,
        Grower3: this.supplier3,
        Grower4: this.supplier4,
        Grower5: this.supplier5,
        Grower6: this.supplier6,
      },
    };
    this.http
      .post<ResponseData[]>(environment.API_URL + 'sku/details', data)
      .subscribe(
        (response) => {
          console.log('Textarea value sent successfully:', response);
          this.loader = false;

          this.data = response;
          this.filterData();
          const spnum =response.find(item=>typeof item==="number")
          console.log(spnum,"spnum")
          this.Supplier_Stock_Consumption=spnum
        
          
        },
        (error) => {
          this.loader = false;
          console.error(error);
          this.showSnackbar('Interanl Server Error Please try after sometime', 'error-snackbar');

        }
      );
    }
    
  }
 

  filterData(): void {
    this.sku1Data = this.data.filter((item) => item.SKU === 'SKU1');
    this.sku2Data = this.data.filter((item) => item.SKU === 'SKU2');
    this.sku3Data = this.data.filter((item) => item.SKU === 'SKU3');
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
      // series: [
      //   {
      //     type: 'column',
      //     name: '2022',
      //     data: [58, 88, 75, 250, 176],
      //   },
      //   {
      //     type: 'line',
      //     step: 'center',
      //     name: 'Average',
      //     data: [47, 83.33, 70.66, 239.33, 175.66],
      //     marker: {
      //       lineWidth: 2,
      //       lineColor: 'red',

      //       fillColor: 'white',
      //     },
      //   },
      // ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 550,
            },
          },
        ],
      },
    });
  }


  showSnackbar(message: string, panelClass: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [panelClass]
    });
  }
}
