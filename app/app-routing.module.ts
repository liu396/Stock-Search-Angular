import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchPageComponent } from './search-page/search-page.component';
import { PortfolioPageComponent } from './portfolio-page/portfolio-page.component';
import { WatchlistPageComponent } from './watchlist-page/watchlist-page.component';
import { SearchDetailsComponent} from './search-details/search-details.component';


const routes: Routes = [
  {path: '', component: SearchPageComponent},
  {path: 'portfolio', component: PortfolioPageComponent},
  {path: 'watchlist', component: WatchlistPageComponent},
  {path: 'details/:ticker', component: SearchDetailsComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
