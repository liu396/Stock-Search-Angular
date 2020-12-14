import { Component, OnInit, Input } from '@angular/core';
import { DetailsHistorical } from '../details';
import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts/highstock';
import IndicatorsCore from 'highcharts/indicators/indicators';
import vbp from 'highcharts/indicators/volume-by-price';

IndicatorsCore(Highcharts);
vbp(Highcharts);



@Component({
  selector: 'app-historical-graph',
  templateUrl: './historical-graph.component.html',
  styleUrls: ['./historical-graph.component.css'],
})
export class HistoricalGraphComponent implements OnInit {

  @Input() private historicalData;
  @Input() private chartTitle;

  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Options;
  chartType = 'StockChart';
  updateflag = true;

  OHLC = [];
  Volume = [];

  constructor() { }

  ngOnInit(): void {
    console.log('preparing historical data...');
    // console.log(this.historicalData);
    for (let i = 0; i < this.historicalData.length; i++) {
      const point = this.historicalData[i];
      console.log(point.date);
      // console.log(point.close);
      const time = new Date(point.date); // + (offset * 60 * 1000)
      // console.log ('data time: ' + time);
      const year = time.getFullYear();
      const month = time.getMonth();
      const date = time.getDate();
      const hour = time.getHours();
      const min = time.getMinutes();
      const sec = time.getSeconds();
      console.log('Year: ' + year + 'Month: ' + month + ' day: ' + date);
      const trueTime = Date.UTC(year, month, date, hour);
      // console.log(trueTime.toLocaleString());

      this.OHLC.push([trueTime, point.open, point.high, point.low, point.close]);
      this.Volume.push([trueTime, point.volume]);
    }

    // console.log('OHLC: ');
    // console.log(this.OHLC);
    // console.log(this.Volume);


    this.chartOptions = {
      title: {
        text: this.chartTitle + ' Historical'
      },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },
      plotOptions: {
        column: {
          maxPointWidth: 20
        },
        candlestick: {
          maxPointWidth: 20
        },
        series: {
          dataGrouping: {
            units: [['week', [1]], ['month', [1, 2, 3, 4, 5, 6]]]
          }
        }
      },
      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],
      tooltip: {
        split: true
      },
      series: [{
      data: this.OHLC,
      type: 'candlestick',
      name: this.chartTitle,
      id: 'oneChart',
      zIndex : 2
    }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: this.Volume,
        yAxis: 1
      }, {
          type: 'vbp',
          linkedTo: 'oneChart',
          params: {
            volumeSeriesID: 'volume'
          },
          dataLabels: {
            enabled: false
          },
          zoneLines: {
            enabled: false
          }
        }, {
        type: 'sma',
        linkedTo: 'oneChart',
        zIndex: 1,
        marker: {
          enabled: false
        }
      }]
    };
  }
}
