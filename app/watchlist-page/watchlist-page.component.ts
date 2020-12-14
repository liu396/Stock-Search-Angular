import { Component, OnInit } from '@angular/core';
import {DetailsService} from '../details.service';

@Component({
  selector: 'app-watchlist-page',
  templateUrl: './watchlist-page.component.html',
  styleUrls: ['./watchlist-page.component.css']
})
export class WatchlistPageComponent implements OnInit {
  storage = window.localStorage;
  countingDone = false;
  tickers = [];
  stockInfo = {};
  stockName = {};
  loading = 0;
  numCounted = -1;
  constructor(private detailService: DetailsService) { }

  ngOnInit(): void {
    for (const key in this.storage) {
      if (key.split('_')[1] === '1'){
        this.tickers.push(key.split('_')[0].toUpperCase());
      }
    }

    this.numCounted = this.tickers.length;

    console.log('You have ' + this.tickers.length + ' stocks in watch');
    console.log(this.tickers);

    for (const ticker of this.tickers){
      this.detailService.getLastPrice(ticker).subscribe(data => {
        this.stockInfo[ticker] = [data[0].last, data[0].prevClose]; // For each ticker, save two values.
        // The first is the last price. The second is the previous price.
        this.loading += 1;
      }, (e) => { console.log(e); this.loading += 1; });
    }

    for (const ticker of this.tickers) {
      this.detailService.getSummary(ticker).subscribe(data =>
        this.stockName[ticker] = data.name);
    }

    console.log(this.stockInfo);





  }

  sizeOf(): number{
    return Object.keys(this.stockInfo).length;
  }

  remove(name: string): void {
    this.loading -= 1;
    this.numCounted -= 1 ;
    delete this.stockName[name];
    delete this.stockInfo[name];
    delete this.storage[(name + '_1')];
  }

  contentUpdate(): void{
    const keys = Object.keys(this.stockInfo);
    for (const key of keys){
      this.detailService.getLastPrice(key).subscribe(data => {
        this.stockInfo[key] = [data[0].last, data[0].prevClose]; // For each ticker, save two values.
        // The first is the last price. The second is the previous price.
        console.log(this.stockInfo[key]);
      }, (e) => { console.log(e); });
    }
  }

}
