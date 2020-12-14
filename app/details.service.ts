import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetailsSummary } from './details';
import { DetailsDailyChart } from './details';
import { DetailsLastPrice } from './details';
import { DetailsHistorical } from './details';
import { DetailsNews } from './details';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  // urlPrefix = 'http://localhost:8080/';
  urlPrefix = 'https://price-request-chang1992.wl.r.appspot.com/';
  constructor(private http: HttpClient) { }

  getNews(ticker): Observable<DetailsNews[]>{
    const url = this.urlPrefix + 'news/' + ticker;
    console.log('url: ' + url);
    return this.http.get<DetailsNews[]>(url);
  }

  getSummary(ticker): Observable<DetailsSummary>{
    const url = this.urlPrefix + 'summary/' + ticker;
    console.log('url: ' + url);
    return this.http.get<DetailsSummary>(url);
  }

  getLastPrice(ticker): Observable<DetailsLastPrice[]>{
    const url = this.urlPrefix + 'lastprice/' + ticker;
    console.log('url: ' + url);
    return this.http.get<DetailsLastPrice[]>(url);
  }

  getHistoricals(ticker): Observable<DetailsHistorical[]>{
    const url = this.urlPrefix + 'historical/' + ticker;
    console.log('url: ' + url);
    return this.http.get<DetailsHistorical[]>(url);
  }

  getDailyCharts(ticker): Observable<DetailsDailyChart[]>{
    const url = this.urlPrefix + 'dailychart/' + ticker;
    console.log('url: ' + url);
    return this.http.get<DetailsDailyChart[]>(url);
  }
}
