import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[image-loader]'
})
export class ImageLoaderDirective {

  constructor(private image: ElementRef<HTMLImageElement>) { 
    this.defaultStyle();
  }

  @HostListener('load') onImageLoad() {
    const image = this.image.nativeElement;
    const interval = setInterval(() => {
      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        this.afterRenderStyle();
        clearInterval(interval);
      }
    }, 10);
  }

  private defaultStyle(): void {
    const image = this.image.nativeElement;

    image.style.visibility = 'hidden';
    image.style.opacity = '0';
    image.style.transition = 'opacity 0.7s ease';
  }

  private afterRenderStyle(): void {
    const image = this.image.nativeElement;

    image.style.visibility = 'visible';
    image.style.opacity = '1';
  }
}
