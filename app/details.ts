export interface DetailsSummary{
  description: string;
  endDate: string;
  exchangeCode: string;
  startDate: string;
  name: string;
  ticker: string;
}

export interface DetailsLastPrice{
  prevClose: number;
  mid: number;
  bidPrice: number;
  volume: number;
  lastSaleTimestamp: string;
  askPrice: number;
  low: number;
  ticker: string;
  bidSize: number;
  lastSize: number;
  tngoLast: number;
  open: number;
  askSize: number;
  quoteTimestamp: string;
  last: number;
  timestamp: string;
  high: number;
}

export interface DetailsHistorical{
  date: string;
  close: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  adjClose: number;
  adjHigh: number;
  adjLow: number;
  adjOpen: number;
  adjVolume: number;
  divCash: number;
  splitFactor: number;
}

export interface DetailsDailyChart{
  date: string;
  close: string;
  high: string;
  low: string;
  open: string;
}

export interface DetailsNews{
  source: {id: string, name: string, d};
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}
