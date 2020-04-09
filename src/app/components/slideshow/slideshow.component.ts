import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Input, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';

import { SlideshowService } from './services/slideshow.service';
import { ControlsComponent } from './controls/controls.component';

interface Playback {
  timeout?: number;
}

@Component({
  selector: 'slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements OnInit, AfterViewInit {
  @Input('slides') slides: string[] = [];
  @Input('width') width: number;
  @Input('height') height: number;
  @Input('transition') transition: string;
  @Input('counter') showCounter: boolean = true;
  @Input('controls') showControls: boolean = true;
  @Input('controls-type') controlsType: number = 1;
  @Input('controls-autohide') autohide: boolean = false;
  @Input('autoplay') autoplay: boolean | Playback;
  @ViewChild('offsetContainer') offsetContainer: ElementRef;
  @ViewChild('slidesStrip') slidesStrip: ElementRef;
  @ViewChild(ControlsComponent) controlsComponent: ControlsComponent;
  private autoplayIndex: number = 0;
  currentSlide: number = 0;


  constructor(private slideshowService: SlideshowService) { }


  ngOnInit(): void {
    this.slideshowService.loadSlides(this.slides);
  }

  ngAfterViewInit(): void {
    this.setDefaults();

    this.slideshowService.currentSlide.subscribe(index => {
      this.slideAnimation(index);
    });

    if(this.autoplay) { this.playSlideshow(); }

    if (this.showControls) {
      setTimeout(() => {
        this.controlsComponent.slides = this.slides;
        this.controlsComponent.controlsType = this.controlsType;
        this.controlsComponent.autohide = this.autohide;
      });
    }
  }

  private setDefaults() {
    const limit = 25;

    this.slides = this.slides.length > limit ? 
      this.slides.slice(0, limit) : this.slides;
      
    this.setDimensions();
  }

  private setDimensions(): void {
    const slides = <HTMLElement[]>Array
      .from(this.slidesStrip.nativeElement.children);

    this.width  = this.width  < 200 || !this.width ? 200 : this.width;
    this.height = this.height < 200 || !this.height ? 200 : this.height;

    this.offsetContainer.nativeElement.style.maxWidth = `${this.width}px`;
    this.offsetContainer.nativeElement.style.height = `${this.height}px`;
    
    if(['cards', 'fade', 'blackout'].indexOf(this.transition) !== -1) {
      slides.map(slide => slide.style.maxWidth = `${this.width}px`);
    } else {
      slides.map(slide => slide.style.width = `${this.width}px`);
    }
  }

  get slidesCount() {
    return `${this.currentSlide + 1}/${this.slides.length}`;
  }

  private playSlideshow(): void {
    this.autoplayIndex = this.autoplayIndex % this.slides.length;
    let timeout: number = typeof this.autoplay !== 'boolean' ? 
      this.autoplay.timeout : 3000;

    this.slideAnimation(this.autoplayIndex);

    setTimeout(() => {
      this.autoplayIndex++;
      this.playSlideshow();
    }, timeout);
  }

  private slideAnimation(index: number): void {
    if (this.currentSlide == index) { return; }

    const slides = <HTMLElement[]>Array
      .from(this.slidesStrip.nativeElement.children);

    switch (this.transition) {
      case 'fade':
        this.fadeTransition(index, slides);
        break;

      case 'blackout':
        this.blackoutTransition(index, slides);
        break;

      case 'cards':
        this.cardsTransition(index, slides);
        break;
        
      default:
        this.stripTransition(index, slides);
        break;
    }
    this.currentSlide = index;
    
    if (this.autoplay) {
      this.autoplayIndex = this.currentSlide;
      this.controlsComponent.onAutoplay(index);
    }
  }

  private stripTransition(index: number, slides: HTMLElement[]) {
    const position: number = slides.map((slide, i) => {
      if (i < index) { return slide.clientWidth; }
      else { return 0; }
    }).reduce((a, b) => a + b, 0) * -1;
    
    this.slidesStrip.nativeElement
      .style.transform = `translateX(${position}px)`;
  }

  private fadeTransition(index: number, slides: HTMLElement[]) {
    slides.map(slide => {
      slide.style.zIndex = '-1';
      slide.classList.remove('active-slide');
    });
    
    slides[this.currentSlide].style.zIndex = '1';
    slides[index].style.zIndex = '0';
    slides[this.currentSlide].classList.add('active-slide');
  }

  private blackoutTransition(index: number, slides: HTMLElement[]) {
    slides.map(slide => {
      slide.style.visibility = 'hidden';
      slide.classList.remove('visible-slide');
    });

    slides[index].style.visibility = 'visible';
    slides[index].classList.add('visible-slide');
  }

  private cardsTransition(index: number, slides: HTMLElement[]) {
    const path = index > this.currentSlide ? 'next' : 'before';

    slides.map(slide => {
      slide.style.zIndex = '-1';
      slide.classList.remove('active-next');
      slide.classList.remove('active-before');
    });

    slides[this.currentSlide].style.zIndex = '0';
    slides[index].style.zIndex = '1';    
    slides[index].classList.add(`active-${path}`);
  }

  controlsVisibility(visible: boolean): void {
    this.controlsComponent.controlsVisibility(visible);
  }
}
