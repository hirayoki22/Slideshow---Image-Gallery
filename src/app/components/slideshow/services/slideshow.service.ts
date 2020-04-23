import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SlideshowService {
  private slides: string[];

  private currentSlideSource = new BehaviorSubject<number>(0);
  currentSlide = this.currentSlideSource.asObservable();

  private autohideControlsSource = new BehaviorSubject<boolean>(false);
  autohideControls = this.autohideControlsSource.asObservable();

  constructor() { }

  loadSlides(slides: string[]) {
    this.slides = slides;
  }

  getSlides(): string[] {
    return this.slides;
  }

  setCurrentSlide(index: number) {
    this.currentSlideSource.next(index);
  }

  setAutohideControls(state: boolean) {
    this.autohideControlsSource.next(state);
  }
}
