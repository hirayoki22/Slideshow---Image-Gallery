import { Component, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { Input, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';


interface Playback {
  timeout?: number;
}

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: [
    './slideshow.component.css',
    './alt-controls.component.css'
  ]
})
export class SlideshowComponent implements OnInit, AfterViewInit, OnChanges {
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
  @ViewChild('controls') controls: ElementRef;
  @ViewChildren('thumbnail') _thumbnails: QueryList<ElementRef>;
  private autoplayIndex: number = 0;
  private controlsTimeout: any;
  private thumbnails: HTMLElement[];
  public currentSlide: number = 0;

  constructor() { }

  ngOnChanges() {
  }

  ngOnInit(): void {
    this.loadDefaults();
  }

  ngAfterViewInit(): void {
    this.setDimensions();

    if(this.autoplay) { this.playSlideshow(); }

    if (this.controlsType == 4) {
      this.thumbnails = this._thumbnails
        .map(thumbnail => thumbnail.nativeElement);
    }
  }

  navThumbnails(position: string): void {
    const container: HTMLElement = 
      this.thumbnails[0].parentElement.parentElement;

    switch (position) {
      case 'before':
        container.scrollLeft -= 250;
        break;

      case 'next':
        container.scrollLeft += 250;
        break;
    
      default:
        console.error('Invalid option ', position);
        break;
    }
  }

  get slidesCount() {
    return `${this.currentSlide + 1}/${this.slides.length}`
  }

  get controlsStyles() {
    return {
      'round-controls':      this.controlsType == 1,
      'slim-controls':       this.controlsType == 2,
      'square-controls':     this.controlsType == 3,
      'thumbnails-controls': this.controlsType == 4
    }
  }

  private loadDefaults() {
    const limit = 25;

    this.slides = this.slides.length > limit ? 
      this.slides.slice(0, limit) : this.slides;
      
    this.width  = this.width  < 200 || !this.width ? 200 : this.width;
    this.height = this.height < 200 || !this.height ? 200 : this.height;
  }

  controlsVisibility(visible:boolean): void {
    if(!this.autohide) { return; }

    const controls = <HTMLElement>this.controls.nativeElement;

    if(visible) {
      controls.style.animation = 'slideUp 0.3s ease forwards';
      clearTimeout(this.controlsTimeout);
    } 
    else {
      this.controlsTimeout = setTimeout(() => {
        controls.style.animation = 'slideDown 0.5s ease forwards';
      }, 3000);
    }
  }

  private setDimensions(): void {
    const slides = <HTMLElement[]>Array
      .from(this.slidesStrip.nativeElement.children);

    this.offsetContainer.nativeElement.style.maxWidth = `${this.width}px`;
    this.offsetContainer.nativeElement.style.height = `${this.height}px`;
    
    if(['cards', 'fade'].indexOf(this.transition) !== -1) {
      slides.map(slide => slide.style.maxWidth = `${this.width}px`);
    } else {
      slides.map(slide => slide.style.width = `${this.width}px`);
    }
  }

  private playSlideshow(): void {
    this.autoplayIndex = this.autoplayIndex % this.slides.length;
    let timeout: number = typeof this.autoplay !== 'boolean' ? 
      this.autoplay.timeout : 3000;

    this.switchSlide(this.autoplayIndex);

    setTimeout(() => {
      this.autoplayIndex++;
      this.playSlideshow();
    }, timeout);
  }

  switchSlide(index: number): void {
    const slides = <HTMLElement[]>Array
      .from(this.slidesStrip.nativeElement.children);

    switch (this.transition) {
      case 'fade':
        this.fadeTransition(index, slides);
        break;

      case 'cards':
        this.cardsTransition(index, slides);
        break;
        
      default:
        this.stripTransition(index, slides);
        break;
    }
    this.currentSlide = index;
    this.autoplayIndex = this.currentSlide;

    setTimeout(() => {
      if (this.controlsType == 4) {
        this.thumbnails[index].scrollIntoView({ behavior: 'smooth' });
      }
    });
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
      if (slide !== slides[index]) {
        slide.style.visibility = 'hidden'
        slide.classList.remove('active-slide');
      }
    });
    slides[index].classList.add('active-slide');
  }

  private cardsTransition(index: number, slides: HTMLElement[]) {
    const path = index > this.currentSlide ? 'next' : 'before';

    slides.map(slide => {
      slide.style.zIndex = '-1'
      slide.classList.remove('active-next');
      slide.classList.remove('active-before');
    });

    slides[this.currentSlide].style.zIndex = '0';
    slides[index].style.zIndex = '1';    
    slides[index].classList.add(`active-${path}`);
  }

}
