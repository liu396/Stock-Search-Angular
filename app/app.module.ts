import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchPageComponent } from './search-page/search-page.component';
import { WatchlistPageComponent } from './watchlist-page/watchlist-page.component';
import { PortfolioPageComponent } from './portfolio-page/portfolio-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AutoCompleteService} from './auto-complete.service';
import { SearchDetailsComponent } from './search-details/search-details.component';
import {DetailsService} from './details.service';
import { DailyGraphComponent } from './daily-graph/daily-graph.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { NewsComponent } from './news/news.component';
import { HistoricalGraphComponent } from './historical-graph/historical-graph.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchPageComponent,
    WatchlistPageComponent,
    PortfolioPageComponent,
    SearchDetailsComponent,
    DailyGraphComponent,
    NewsComponent,
    HistoricalGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HighchartsChartModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
