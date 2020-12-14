import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AutoCompleteService} from '../auto-complete.service';
import {ICompany} from '../company';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SearchPageComponent implements OnInit {
  companyCtrl = new FormControl();
  observeChange: any;

  companies: ICompany[];
  loading = 0;


  ticker = '';
  timer: any;

  constructor(private autoCompleteService: AutoCompleteService) {
    console.log('Constructor activate');
    // this.filteredCompanies = this.autoCompleteService.getCompanies('aapl');
    // this.filteredCompanies.subscribe(() => console.log('change observed'));
  }

  ngOnInit(): void {
  }

  test(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => console.log(this.ticker), 2000);
    } else {
      this.timer = setTimeout(() => console.log(this.ticker), 2000);
    }
  }

  update(): void {
    if (!this.ticker){
      return;
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {this.loading = 1; this.autoCompleteService.getCompanies(this.ticker).subscribe(
        (data) => {
          this.companies = data;
          this.loading = 0;
        }); }, 1000);
    }
    else {
      this.timer = setTimeout(() => {this.loading = 1; this.autoCompleteService.getCompanies(this.ticker).subscribe(
        (data) => {
          this.companies = data;
          this.loading = 0;
        }); }, 1000);
    }
  }
}
