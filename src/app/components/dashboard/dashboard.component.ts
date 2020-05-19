import { Component, OnInit, } from '@angular/core';
import { Observable } from 'rxjs';

import { SlideService } from './services/slide.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ SlideService ]
})
export class DashboardComponent implements OnInit {
  slides$: Observable<string[]>;

  constructor(private slideService: SlideService) { }

  ngOnInit(): void {
    this.slides$ = this.slideService.getSlides();
  }

}
