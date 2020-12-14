import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsSummary } from '../details';
import { DetailsDailyChart } from '../details';
import { DetailsLastPrice } from '../details';
import { DetailsHistorical } from '../details';
import { DetailsNews } from '../details';
import {DetailsService} from '../details.service';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search-details',
  templateUrl: './search-details.component.html',
  styleUrls: ['./search-details.component.css']
})
export class SearchDetailsComponent implements OnInit, OnDestroy {

  ticker = this.route.snapshot.paramMap.get('ticker').toUpperCase();
  showGeneralInfo = true;
  openMarket: boolean;
  isRaising: boolean;
  amount: string;
  price: string;
  amountPercent: string;
  curTime: string;
  markColor: string;
  imageUrl: string;
  messageToShow: string;
  Qt: number;
  timer: any;

  // Modal variables:
  closeResult = '';
  // Modal Variables.

  // Alert variables:
  check = false;
  loading = 0;
  showBoughtSuccess = false;
  showAddWatchlist = false;
  showRemoveWatchlist = false;
  // Alert variables.

  storage = window.localStorage; // (key,[inWatchList, holds])
  inList: boolean;

  dailyCharts: DetailsDailyChart[];
  historicals: DetailsHistorical[];
  news: DetailsNews[];
  summary: DetailsSummary;
  lastPrice: DetailsLastPrice;


  constructor(private route: ActivatedRoute, private detailService: DetailsService, private modalService: NgbModal) { }
  ngOnInit(): void {

    this.inList = this.ticker + '_1' in this.storage;

    console.log('searching details for: ' + this.ticker);
    this.detailService.getSummary(this.ticker).subscribe(data => {
        this.summary = data;
        console.log('summary got');
        console.log(data);
        console.log('In summary, name: ' + this.summary.name);
        this.loading += 1;
        console.log('loading status: ' + this.loading);
        if (this.summary.ticker) {
          console.log('Data valid');
          this.check = true;
        }
      },
      (e) => {
        this.loading += 1;
        console.log(e);
      });

    this.detailService.getDailyCharts(this.ticker).subscribe(data => {
        this.dailyCharts = data;
        console.log('dailyChart got');
        this.loading += 1;
        console.log('loading status: ' + this.loading);
      },
      (e) => {
        this.loading += 1;
        console.log(e);
      });

    this.detailService.getHistoricals(this.ticker).subscribe(data => {
        this.historicals = data;
        console.log('historical got');
        this.loading += 1;
        console.log('loading status: ' + this.loading);
      },
      (e) => {
        this.loading += 1;
        console.log(e);
      });

    this.detailService.getNews(this.ticker).subscribe(data => {
        this.news = data;
        console.log('news got');
        this.loading += 1;
        console.log('loading status: ' + this.loading);
      },
      (e) => {
        this.loading += 1;
        console.log(e);
      });

    this.detailService.getLastPrice(this.ticker).subscribe(data => {
        this.lastPrice = data[0];
        console.log('last price got');
        console.log(data);
        this.loading += 1;
        console.log('loading status: ' + this.loading);
        this.openMarket = this.timeCompareWith(this.lastPrice.timestamp);
        this.amount = this.priceAmountCompare(this.lastPrice.last, this.lastPrice.prevClose);
      },
      (e) => {
        this.loading += 1;
        console.log(e);
      });

    this.periodicUpdate();
  }

  ngOnDestroy(): void {
    console.log('Cancel timely updating');
    clearInterval(this.timer);
  }

  rotate(event: MatTabChangeEvent): void{
    const tab = event.tab.ariaLabel;
    if (tab === '1'){
      this.showGeneralInfo = true;
    }
    else{
      this.showGeneralInfo = false;
    }
  }

  private updatePrice(): void {
    this.detailService.getLastPrice(this.ticker).subscribe(data => {this.lastPrice = data[0]; console.log('lastPrice Updated');
                                                                    this.openMarket = this.timeCompareWith(this.lastPrice.timestamp);
                                                                    this.amount = this.priceAmountCompare(this.lastPrice.last, this.lastPrice.prevClose);
                                                                    },
      () => console.log('last price Update trail failed'));
  }

  private updateDaily(): void {
    this.detailService.getDailyCharts(this.ticker).subscribe(data => {this.dailyCharts = data; console.log('daily chart Updated'); },
      () => console.log('daily chart update trail failed'));
  }

  private periodicUpdate(): void{
    this.timer = setInterval(() => {
                                console.log('updating price');
                                this.updateDaily();
                                this.updatePrice(); }, 15000);
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
      console.log('Market closed');
      const offset = p.getTimezoneOffset();
      const t = new Date(p.getTime() - (offset * 60 * 1000));
      const w = t.toISOString();
      this.messageToShow = 'Market Closed on ' + w.substring(0, 10) + ' ' + w.substring(11, 19);
      return false;
    }
    else{
      console.log('Market opening');
      this.messageToShow = 'Market is open';
      return true;
    }
  }

  private priceAmountCompare(a: number, b: number): string{
    if (a >= b) {
      this.isRaising = true;
      this.markColor = 'green';
    }
    else{
      this.isRaising = false;
      this.markColor = 'red';
    }
    this.amountPercent = ((a - b) / b).toString();
    return (a - b).toString();
  }

  update_watchList(): void {
    if (this.inList) {
      this.storage.removeItem(this.ticker + '_1');
      this.inList = false;
      this.showRemoveWatchlist = true;
      this.showAddWatchlist = false;
    } else {
      this.storage.setItem(this.ticker + '_1', 'true');
      this.inList = true;
      this.showRemoveWatchlist = false;
      this.showAddWatchlist = true;
    }
  }

  // Modal Functions:
  open(content): void{
    this.modalService.open(content, {ariaLabelledBy: 'buyInterface'}).result.then((result) => {
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

  transact(qt): void{
    let price: number;
    this.detailService.getLastPrice(this.ticker).subscribe((data) => {price = data[0].last;
      console.log('buying at price: ', price);
      console.log('buying quantity: ', qt);
      if (this.storage.getItem(this.ticker + '_2')) {
        const newQt = parseFloat(this.storage.getItem(this.ticker + '_2')) + qt * 1;
        this.storage.setItem(this.ticker + '_2', newQt.toString());
        const newTotal = parseFloat(this.storage.getItem(this.ticker + '_3')) + qt * price;
        this.storage.setItem(this.ticker + '_3', newTotal.toString());
        console.log('Now the quantity is:' + this.storage.getItem(this.ticker + '_2'));
        console.log('Now the total value is: ' + this.storage.getItem(this.ticker + '_3'));
      }
      else{
        this.storage.setItem(this.ticker + '_2', qt);
        this.storage.setItem(this.ticker + '_3', (qt * price).toString());
        console.log('Now the quantity is:' + this.storage.getItem(this.ticker + '_2'));
        console.log('Now the total value is: ' + this.storage.getItem(this.ticker + '_3'));
      }
      this.Qt = undefined; });
  }

  fix(): void{
    console.log('resize window');
    window.resizeTo(300, 200);
  }
  // Modal Functions.
}
