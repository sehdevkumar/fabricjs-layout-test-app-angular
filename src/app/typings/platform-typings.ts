
export type SN = string | number;

export interface CustomObject {
   id: SN;
}



export interface CustomCanvasConfig  {
   canvas_id: SN;
   canvasHeight: number;
   canvasWidth: number;
   canvasBackground: string;
}

// All Fabric Objects Custom Typings
export type CustomRectangleConfig = fabric.Rect & CustomObject;
