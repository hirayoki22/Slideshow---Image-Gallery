import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';

import { SlideshowService } from '../services/slideshow.service';

@Component({
  selector: 'slideshow-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('controls') controls: ElementRef<HTMLElement>;
  @ViewChildren('preview') previews: QueryList<ElementRef>;
  @ViewChild('indicator') indicator: ElementRef<HTMLElement>;
  @ViewChildren('navButton') navButtons: QueryList<ElementRef>;
  slides: string[];
  activePreview: number = 0;
  controlsType: number;
  autohide: boolean;
  showNavButtons: boolean = false;
  private controlsTimeout: any;

  constructor(private slideshowService: SlideshowService) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.setDefaults(), 50);
    window.addEventListener('resize', () => this.onResize());
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  private setDefaults() {
    if (this.controlsType == 4) {
      const controls = this.controls.nativeElement;
      
      if (controls.scrollWidth > controls.clientWidth) {
        this.showNavButtons = true;
      } 
    }
  }

  private onResize() {
    const controls = this.controls.nativeElement;

    if (controls.scrollWidth > controls.clientWidth) {
      this.showNavButtons = true;
      
    } else {
      this.showNavButtons = false;
    }
  }

  get controlsStyles() {
    return {
      'round-controls':      this.controlsType == 1,
      'slim-controls':       this.controlsType == 2,
      'square-controls':     this.controlsType == 3,
      'preview-controls':    this.controlsType == 4
    }
  }

  onPreviewClick(index: number) {
    this.slideshowService.setCurrentSlide(index);
    this.activePreview = index;
  
    this.previewNavigation(index);
    this.indicatorAnimation(index);
  }

  onPreviewKeydown(key: KeyboardEvent) {
    key.preventDefault();

    const previews = this.previews.toArray()
      .map(preview => preview.nativeElement);

    switch (key.key) {
      case 'ArrowLeft':
        this.activePreview = this.activePreview > 0 ?
          this.activePreview -= 1 : previews.length - 1;        
        break;

      case 'ArrowRight':
        this.activePreview = this.activePreview < previews.length - 1 ?
          this.activePreview += 1 : 0;
        break;
      default:
        break;
    }
    this.onPreviewClick(this.activePreview);
    
  }

  onNavButtonClick(direction: string) {
    const controls = this.controls.nativeElement;
    const step = { before: -250, next: 250 };

    this.setNavButtonsDisableState();
    controls.scrollBy({left: step[direction], behavior: 'smooth' });
  }

  private previewNavigation(index: number): void {
    if (this.controlsType !== 4) { return; }

    const previews = this.previews.toArray()
      .map(preview => preview.nativeElement);

    this.setNavButtonsDisableState();
    previews[index].scrollIntoView({
      block: 'nearest',
      inline: 'center',
      behavior: 'smooth'
    });
  }

  onAutoplay(index: number): void {
    this.activePreview = index;
    
    if (this.controlsType == 4) {
      this.previewNavigation(index);
      this.indicatorAnimation(index);
    }
  }

  private setNavButtonsDisableState() {
    if (!this.showNavButtons) { return; }

    const controls = this.controls.nativeElement;
    const navButtons = <HTMLButtonElement[]>this.navButtons.toArray()
      .map(button => button.nativeElement);
    const beforeBtn = navButtons[0];
    const nextBtn = navButtons[1];

    const onScroll = () => {
      const scrollable = controls.scrollWidth - controls.clientWidth;
      const scrolled = Math.ceil(controls.scrollLeft);
      
      if (scrolled > 0) {
        beforeBtn.disabled = false;
      } else {
        beforeBtn.disabled = true;
      }
      if (scrolled >= scrollable) {
        nextBtn.disabled = true;
      } else {
        nextBtn.disabled = false;
      }
    }
    controls.addEventListener('scroll', onScroll);
  }  

  controlsVisibility(isVisible: boolean): void {
    if(!this.autohide || this.controlsType == 4) { return; }

    const controls = <HTMLElement>this.controls.nativeElement;

    if(isVisible) {
      controls.style.animation = 'slideUp 0.3s ease forwards';
      clearTimeout(this.controlsTimeout);
    } 
    else {
      this.controlsTimeout = setTimeout(() => {
        controls.style.animation = 'slideDown 0.5s ease forwards';
      }, 3000);
    }
  }

  private indicatorAnimation(index: number) {
    if(this.controlsType !== 4) { return; }

    const previews = <HTMLElement[]>this.previews.toArray()
      .map(preview => preview.nativeElement);
    const indicator = this.indicator.nativeElement;

    const travel: number = previews.map((prev, i) => {
      if (i < index) { return 154.8; }
      else { return 0; }
    }).reduce((a, b) => a + b, 0);

    indicator.style.transform = `translateX(${travel}px)`;
  }


}
