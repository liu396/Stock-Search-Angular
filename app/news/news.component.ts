import {Component, OnInit, Input} from '@angular/core';
import {DetailsNews} from '../details';
import {NgbModalModule, ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  @Input() public newsContent: DetailsNews[];

  private months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  closeResult = ' ';
  publisher: string;
  title: string;
  url: string;
  date: string;
  description: string;
  twitterShare: string;
  facebookShare: string;


  constructor( private modalService: NgbModal) { }



  ngOnInit(): void {
    console.log(this.newsContent);
  }

  showInfo(num): void{
    console.log('clicked on ' + num);
  }

  open(content, index): void {
    const singleOne = this.newsContent[index];
    this.publisher = singleOne.source.name;
    this.title = singleOne.title;
    this.description = singleOne.description;
    const dateString = singleOne.publishedAt;
    this.date = this.months[parseInt(dateString.substring(5, 7), 10) - 1] + ' '
      + dateString.substring(8, 10) + ', ' + dateString.substring(0, 4);
    this.url = singleOne.url;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.twitterShare = 'https://twitter.com/intent/tweet?text=' + this.title + '&url=' + this.url;
    console.log('twitterlink: ' + this.twitterShare);

    this.facebookShare = 'https://www.facebook.com/sharer/sharer.php?u=' + this.url;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



}
