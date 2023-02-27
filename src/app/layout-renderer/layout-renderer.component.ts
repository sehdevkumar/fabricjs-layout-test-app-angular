import { GSWHzoneAPIResponseData, GSWHzonesAPIResponse } from './../typings/gs-wh-api-typings';
import { zoneInfo } from './../dummy-response/zoneInfo';
import { CustomRectangleConfig } from './../typings/platform-typings';
import { AfterContentInit, AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { ICanvasOptions, IEvent } from 'fabric/fabric-impl';
import { CustomCanvasConfig } from '../typings/platform-typings';

@Component({
  selector: 'app-layout-renderer',
  templateUrl: './layout-renderer.component.html',
  styleUrls: ['./layout-renderer.component.scss']
})
export class LayoutRendererComponent implements OnInit, AfterViewInit , OnDestroy{
  @ViewChild('CanvasWrapperRef') CanvasWrapperRef: ElementRef<HTMLDivElement>;

  canvasRef: fabric.Canvas;
  canvasConfig: CustomCanvasConfig;

  zoneInfo: GSWHzoneAPIResponseData;

  initialZoom = 0;
  initialDistance = undefined;


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

    this.canvasRef = new fabric.Canvas('canvas', {preserveObjectStacking: true, selection: true, controlsAboveOverlay: true,
        centeredScaling: true,
        allowTouchScrolling: true});
    fabric.Object.prototype.objectCaching = false;
    this.canvasRef.setWidth(this.getCustomCanvasConfig?.canvasWidth);
    this.canvasRef.setHeight(this.getCustomCanvasConfig?.canvasHeight);
    this.canvasRef.setBackgroundColor('#191919', null);

  }


  onRenderCanvas() {
    this.canvasRef.setZoom(this.initialZoom);
    this.canvasRef.renderAll();
    // this.canvasRef.on({''}, null);
    this.canvasRef.on('mouse:wheel', (e) =>  this.ngZone.run(() => { this.onTransformCanvas(e?.e); }) );
    this.canvasRef.on('mouse:move', e => this.ngZone.run(() => this.onTransFormMobileDevices(e) ));
  }



  onTransFormMobileDevices(e: IEvent) {
    const pointer = e?.pointer;
    const event = e?.e as unknown as TouchEvent;

    if (event?.targetTouches?.length === 2 && event?.type === 'touch') {
      // tslint:disable-next-line:max-line-length
      const distance = this.onTwoPointDistance(event?.targetTouches[0]?.clientX, event?.targetTouches[0]?.clientY, event?.targetTouches[1]?.clientX, event?.targetTouches[1]?.clientY);

      if (this.initialDistance === undefined) {
         this.initialDistance = distance;
      }


      this.canvasRef.setZoom((distance  + this.canvasRef?.getZoom()) / this.initialDistance);
      console.log(distance, pointer);
    }


    event.preventDefault();
    event.stopPropagation();
    this.canvasRef.renderAll();
  }

 onTwoPointDistance(x1: number, y1: number, x2: number, y2: number) {
  const xDistance = x2 - x1;
  const yDistance = y2 - y1;
  const distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  return distance;
}



  onTransformCanvas(e: WheelEvent) {
     const delta = e?.deltaY;
     let zoom = this.canvasRef.getZoom();
     zoom *= 0.999 ** delta;
    //  if (zoom > 100) { zoom = 20; }
    //  if (zoom < 0.01) { zoom = 0.01; }
     this.canvasRef.zoomToPoint({ x: e.offsetX, y: e.offsetY }, zoom);
     this.initialZoom = zoom;
     e.preventDefault();
     e.stopPropagation();
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
