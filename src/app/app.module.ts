import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SlideshowComponent } from './components/slideshow/slideshow.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ControlsComponent } from './components/slideshow/controls/controls.component';
import { ImageLoaderDirective } from './shared/image-loader.directive';


@NgModule({
  declarations: [
    AppComponent,
    SlideshowComponent,
    DashboardComponent,
    ControlsComponent,
    ImageLoaderDirective,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
