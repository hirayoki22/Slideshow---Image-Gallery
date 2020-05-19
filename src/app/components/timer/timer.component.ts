import { Component, OnInit, OnChanges } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnChanges {
  @Input() time: string;
  @Output() timeout: EventEmitter<boolean> = new EventEmitter();
  isEnding: boolean = false;
  countDown: string;
  private timer: any;

  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(): void {
    this.initTimer();
  }

  private initTimer(): void {
    let hours = +this.time.split(':')[0];
    let mins  = +this.time.split(':')[1];
    let secs  = +this.time.split(':')[2];
    let duration = (hours * 3600) + (mins * 60) + secs;
    let styled = num => num > 9 ? num : `0${num}`;

    this.isEnding = secs > 10 ? false : true;
    this.countDown = `${styled(hours)}:${styled(mins)}:${styled(secs)}`;

    if (!duration) { return; }

    this.timer = setInterval(() => {
      if ((duration -= 1) == 0) {
        this.timeout.emit(true);

        clearInterval(this.timer);
      }

      // hours = mins > 0 ? hours : hours -= 1;
      mins  = secs > 0 ? mins : mins -= 1;
      secs  = secs > 0 ? secs -= 1 : 59;

      this.isEnding = secs > 10 ? false : true;
      this.countDown = `${styled(hours)}:${styled(mins)}:${styled(secs)}`;
    }, 1000);
  }
}
