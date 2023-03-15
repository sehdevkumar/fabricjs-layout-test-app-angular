import { GSWHzoneAPIResponseData, GSWHzonesAPIResponse } from './../typings/gs-wh-api-typings';
import { zoneInfo } from './../dummy-response/zoneInfo';
import { CustomRectangleConfig } from './../typings/platform-typings';
import { AfterContentInit, AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { ICanvasOptions, IEvent } from 'fabric/fabric-impl';
import { CustomCanvasConfig } from '../typings/platform-typings';
import * as Hammer from 'hammerjs';
import * as fromFabric from 'fabric-with-gestures';

@Component({
  selector: 'app-layout-renderer',
  templateUrl: './layout-renderer.component.html',
  styleUrls: ['./layout-renderer.component.scss']
})
export class LayoutRendererComponent implements OnInit, AfterViewInit , OnDestroy{
  output: any = [];


  get getCustomCanvasConfig(): CustomCanvasConfig {

    const config: CustomCanvasConfig = {
      canvas_id: '1',
      canvasHeight: this.CanvasWrapperRef?.nativeElement?.offsetHeight,
      canvasWidth: this.CanvasWrapperRef?.nativeElement?.offsetWidth,
      canvasBackground: 'red'
    };

    this.canvasConfig = config;

    return config;
  }

  constructor(private ngZone: NgZone) {

  }
  selection: boolean;
  @ViewChild('CanvasWrapperRef') CanvasWrapperRef: ElementRef<HTMLDivElement>;
   @ViewChild('CanvasRef') CanvasRef: ElementRef<HTMLCanvasElement>;

  canvasRef: fabric.Canvas;
  canvasConfig: CustomCanvasConfig;

  zoneInfo: GSWHzoneAPIResponseData;

  initialZoom = 0;

  // Mobile Devices Zoom and Pan Variables
  zoomLevel = 1;
  panX = 0;
  panY = 0;
  lastTouchDistance = null;
  lastPosX  = 0;
  lastPosY = 0;

  isDragging = false;

  pausePanning = false;
  zoomStartScale = 0;
  currentX;
  currentY;
  xChange;
  yChange;
  lastX;
  lastY;


  vpt: Array<number>  = [];

  ngOnInit(): void {
    this.initialZoom = 10;
    this.zoneInfo = zoneInfo as unknown as GSWHzoneAPIResponseData;

  }

  ngAfterViewInit(): void {

    this.ngZone.runOutsideAngular(() => {
         this.onSetCanvasConfigAndRender();
         this.onRenderCanvas();
         this.onRenderZones();
    });

  }

  onSetCanvasConfigAndRender() {

    // tslint:disable-next-line:max-line-length
    this.canvasRef = new fromFabric.fabric.Canvas(this.CanvasRef.nativeElement, {preserveObjectStacking: true, selection: false, controlsAboveOverlay: true,
        centeredScaling: true,
        allowTouchScrolling: true});
    this.canvasRef.setWidth(this.getCustomCanvasConfig?.canvasWidth);
    this.canvasRef.setHeight(this.getCustomCanvasConfig?.canvasHeight);
    this.canvasRef.setBackgroundColor('white', null);
    fabric.Object.prototype.objectCaching = false;
  }





  onRegisterMobileGuesturesEvents() {
     // tslint:disable-next-line:variable-name
    this.canvasRef.on('touch:gesture', e => {
      const evt = e as any;
      if (evt?.e?.touches && evt?.e?.touches.length === 2) {
          this.pausePanning = true;
          const point = new fromFabric.fabric.Point(evt.self?.x, evt.self?.y);
          if (evt.self?.state === 'start') {
              this.zoomStartScale = this.canvasRef.getZoom();
          }
          const delta = this.zoomStartScale * evt?.self?.scale;
          this.canvasRef.zoomToPoint(point, delta);

          this.pausePanning = false;
      }
    });


    this.canvasRef.on('touch:drag', e => {
        const evt = e as any;

        if (this.pausePanning === false && undefined !== evt.self.x && undefined !== evt.self.y) {
          this.currentX = evt.self.x;
          this.currentY = evt.self.y;
          this.xChange = this.currentX - this.lastX;
          this.yChange = this.currentY - this.lastY;

          if ( (Math.abs(this.currentX - this.lastX) <= 50) && (Math.abs(this.currentY - this.lastY) <= 50)) {
              const delta = new fromFabric.fabric.Point(this.xChange, this.yChange);
              this.canvasRef.relativePan(delta);
          }

          this.lastX = evt.self.x;
          this.lastY = evt.self.y;
        }
    });
  }




  onMouseMove(e: unknown | any) {

    const event = e?.e as TouchEvent;

    // Zoom
    if (event?.touches && event?.touches?.length === 2) {
        console.log('Zoom Enabled');
    }


    // Drag

    if (event?.touches && event?.touches?.length === 1) {
        console.log('dragged Enabled');
    }




  }







  onRenderCanvas() {
     this.canvasRef.setCursor('pointer');
     this.canvasRef.setZoom(this.initialZoom);
     this.canvasRef.renderAll();
    // For Desktop Zoom and Pan Can Achieved using the Wheel Event
     this.canvasRef.on('mouse:wheel', (e) =>       this.ngZone.run(() => { this.onTransformCanvas(e?.e); }) );
     this.canvasRef.on('mouse:move', (e) =>  this.ngZone.run(() => { this.onMouseMove(e as any); }) );

     this.onRegisterMobileGuesturesEvents();
     this.canvasRef.on('selection:created', e => {

      this.pausePanning = true;
    });

     this.canvasRef.on('selection:cleared', e => {

      this.pausePanning = false;
    });


  }



  requestRenderAll() {
       this.canvasRef.setZoom(this.vpt[4]);
       this.canvasRef.requestRenderAll();
  }





onTransformCanvas(e: WheelEvent) {
    this.canvasRef.setCursor('pointer');
    const delta = e?.deltaY;
    let zoom = this.canvasRef.getZoom();
    zoom *= 0.999 ** delta;
    //  if (zoom > 100) { zoom = 20; }
    //  if (zoom < 0.01) { zoom = 0.01; }
    this.canvasRef.zoomToPoint({ x: e.offsetX, y: e.offsetY }, zoom);
    this.initialZoom = zoom;
    e.preventDefault();
    //  e.stopPropagation();
    this.canvasRef.renderAll();
  }




onRenderZones() {
      this.ngZone.runOutsideAngular(() => {
        this.zoneInfo.zones?.forEach((zone => {

           this.onCreateInstanceAndRenderZone(zone);

        }));


      });

    }



onCreateInstanceAndRenderZone(zone: GSWHzonesAPIResponse) {
    const rect = new fabric.Rect({
      left: zone?.zone_coordinates?.x,
      top: zone?.zone_coordinates?.y,
      strokeWidth: 0,
      stroke: 'green',
      fill: 'red',
      width: zone?.zone_length,
      height: zone?.zone_width,
      selectable: false,
      hasRotatingPoint: false,
    }) as CustomRectangleConfig;




    rect.id = Math.random() * 1000;
    this.canvasRef.add(rect);
  }



ngOnDestroy(): void {
      this.canvasRef.dispose();
  }

}
