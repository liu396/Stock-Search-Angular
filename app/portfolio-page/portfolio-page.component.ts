import { Component, OnInit, OnDestroy } from '@angular/core';
import {DetailsService} from '../details.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-portfolio-page',
  templateUrl: './portfolio-page.component.html',
  styleUrls: ['./portfolio-page.component.css']
})
export class PortfolioPageComponent implements OnInit, OnDestroy {

  closeResult = '';
  numCounted = -1;
  loading = 0;
  tickers = [];
  stockFinance = {};
  stockName = {};
  buyingOrSelling: number;
  storage = window.localStorage;
  Qt: number;
  focusedTicker: string;
  openMarket: boolean;
  timer: any;
  curTime: any;

  constructor(private askInfo: DetailsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    for (const key in this.storage) {
      if (key.split('_')[1] === '2'){
        this.tickers.push(key.split('_')[0].toUpperCase());
      }
    }

    this.numCounted = this.tickers.length;
    console.log('You have ' + this.tickers.length + ' stocks in hand');
    console.log(this.tickers);

    for (const stock of this.tickers) {
      this.askInfo.getLastPrice(stock).subscribe(data => {this.stockFinance[stock] = data[0].last;
      this.loading += 1; this.openMarket = this.timeCompareWith(data[0].timestamp); }, () => this.loading += 1);
    }

    for (const stock of this.tickers) {
      this.askInfo.getSummary(stock).subscribe(data => this.stockName[stock] = data.name);
    }

    // this.timelyUpdate();


  }

  ngOnDestroy(): void{
    console.log('Cancel update');
    clearInterval(this.timer);
  }

  open(content, name): void{
    console.log('opening modal...');
    this.modalService.open(content, {ariaLabelledBy: name}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC){
      return 'by pressing ESC';
    }
    else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    }
    else{
      return `with: ${reason}`;
    }
  }

  transact(ticker, qt): void{
    if (this.buyingOrSelling === 0){
      const newQt = parseFloat(this.storage.getItem(ticker + '_2')) + qt * 1;
      this.storage.setItem(ticker + '_2', newQt.toString());
      let price;
      this.askInfo.getLastPrice(ticker).subscribe(data => {
        price = data[0].last;
        console.log('Buying at price of ' + price);
        const newTotal = parseFloat(this.storage.getItem(ticker + '_3')) + qt * price;
        this.storage.setItem(ticker + '_3', newTotal.toString());
        console.log('Now the quantity is:' + this.storage.getItem(ticker + '_2'));
        console.log('Now the total value is: ' + this.storage.getItem(ticker + '_3'));
      });
    }
    else{
      if (qt === parseFloat(this.storage.getItem(ticker + '_2'))){
        console.log(ticker + ' sold out!');
        this.storage.removeItem(ticker + '_2');
        this.storage.removeItem(ticker + '_2');
        delete this.stockName[ticker];
        delete this.stockFinance[ticker];
        this.numCounted -= 1;
        this.loading -= 1;
      }
      else{
        const newQt = parseFloat(this.storage.getItem(ticker + '_2')) - qt * 1;
        this.storage.setItem(ticker + '_2', newQt.toString());
        let price;
        this.askInfo.getLastPrice(ticker).subscribe(data => {
          price = data[0].last;
          console.log('Selling at price of ' + price);
          const newTotal = parseFloat(this.storage.getItem(ticker + '_3')) - qt * price;
          this.storage.setItem(ticker + '_3', newTotal.toString());
          console.log('Now the quantity is:' + this.storage.getItem(ticker + '_2'));
          console.log('Now the total value is: ' + this.storage.getItem(ticker + '_3'));
        });
      }
    }

    this.singleUpdate();
    this.Qt = undefined;
  }

  timelyUpdate(): void{
    console.log('Updating price...');
    this.timer = setInterval(() => {
      for (const stock of Object.keys(this.stockName)){
        this.askInfo.getLastPrice(stock).subscribe(data => {
          this.stockFinance[stock] = data[0].last;
          this.openMarket = this.timeCompareWith(data[0].timestamp);
        });
      }
      console.log('Open Market is ' + this.openMarket);
    }, 15000);
  }

  singleUpdate(): void{
    console.log('Updating price...');
    for (const stock of Object.keys(this.stockName)){
      this.askInfo.getLastPrice(stock).subscribe(data => {
        this.stockFinance[stock] = data[0].last;
        this.openMarket = this.timeCompareWith(data[0].timestamp);
      });
    }
  }


  private timeCompareWith(timestamp: string): boolean{  // this function also update current time
    const d = new Date();
    const p = new Date(timestamp);
    // console.log(d);
    // console.log(p);
    const localOffset = d.getTimezoneOffset();
    const tLocal = new Date(d.getTime() - (localOffset * 60 * 1000));
    const x = tLocal.toISOString();
    this.curTime = x.substring(0, 10) + ' ' + x.substring(11, 19);

    if (d.getTime() - p.getTime() > 60000){
      return false;
    }
    else{
      return true;
    }
  }

  getColor(ticker): string{
    if (this.stockFinance[ticker] - this.storage[(ticker + '_3')] / this.storage[(ticker + '_2')] > 0.0001) {
      return 'green';
    }
    else if (this.stockFinance[ticker] - this.storage[(ticker + '_3')] / this.storage[(ticker + '_2')] < -0.0001) {
      return 'red';
    }
    else{
      return 'black';
    }
  }





}
