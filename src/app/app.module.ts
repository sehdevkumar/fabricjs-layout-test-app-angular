import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutRendererComponent } from './layout-renderer/layout-renderer.component';
import { CanvasRectsComponent } from './canvas-rects/canvas-rects.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutRendererComponent,
    CanvasRectsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
