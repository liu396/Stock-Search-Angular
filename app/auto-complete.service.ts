import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ICompany} from './company';

@Injectable({
  providedIn: 'root'
})

export class AutoCompleteService {
  // urlPrefix = 'http://localhost:8080/';
  urlPrefix = 'https://price-request-chang1992.wl.r.appspot.com/';

  constructor(private http: HttpClient) { }

  getCompanies(ticker): Observable<ICompany[]>{
    const url = this.urlPrefix + 'autocomplete/' + ticker;
    console.log('url: ' + url);
    return this.http.get<ICompany[]>(url);
  }
}
