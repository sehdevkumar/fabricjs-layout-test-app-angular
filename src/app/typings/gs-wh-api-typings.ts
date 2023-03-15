import { IPoint } from 'fabric/fabric-impl';

export interface GSWHzoneAPIResponseData {
  warehouse_id: string;
  warehouse_name: string;
  warehouse_type: number;
  warehouse_width: number;
  warehouse_length: number;
  stacking_type: number;
  lanes?: Array<GSWHLanesAPIResponse>;
  shutters: Array<GSWHShuttersAPIResponse>;
  un_usable_area?: Array<GSWHUnusableAreasAPIResponse>;
  zones: Array<GSWHzonesAPIResponse>;
  out_side_warehouse: Array<GSWHOutSideWareHouse>;
}

export interface GSWHShuttersAPIResponse {
  shutter_id: string;
  shutter_name: string;
  shutter_operation_type: number;
  shutter_length: number;
  shutter_width: number;
  shutter_coordinates: {
    x: number
    y: number
  };
}

export interface GSWHUnusableAreasAPIResponse {
  unusable_area_id: string;
  unusable_area_name: string;
  unusable_area_coordinates: {
    x: number
    y: number
  };
  unusable_area_length: number;
  unusable_area_width: number;
}

export interface GSWHzonesAPIResponse {
  zone_id: string;
  zone_name: string;
  zone_coordinates: {
    x: number
    y: number
  };
  no_of_rows: number;
  no_of_cols: number;
  zone_width: number;
  zone_length: number;
  zone_position: number;
  zone_type?: ZoneTypeEnum;
}

export interface GSWHLanesAPIResponse {
  lane_name: string;
  lane_coordinates: {
    x: number
    y: number
  };
  lane_length: number;
  lane_width: number;
}

export interface GSWHMainBlocksAPIResponse {
  zone_id: string;
  zone_name: string;
  no_of_rows: number;
  no_of_cols: number;
  blocks: Array<GSWHBlocksAPIResponse>;
}

export interface GSWHBlocksAPIResponse {
  block_id: string;
  block_name: string;
  block_area: number;
  block_width: number;
  block_length: number;
  block_available_area: number;
  no_of_rows: number;
  no_of_cols: number;
  filter: number;
  cells: Array<GSWHCellsAPIResponse>;
  block_coordinates: IPoint;
  x: number;
  y: number;
}

export interface GSWHCellsAPIResponse {
  cell_height: number;
  cell_width: number;
  cell_id: string;
  cell_name: string;
  cell_area: number;
  cell_row_no: number;
  cell_col_no: number;
  is_occupied: boolean;
  occupancy_status: OccupancyStatus;
  cell_order: number;
  x: number;
  y: number;
}

export interface GSWHOutSideWareHouse {
  coordinates: IPoint;
  length: number;
  name: string;
  width: number;
}

export interface GSWHFilterList {
  filter_name: string;
  colour: string;
  container_flag: number;
  filter_id: number;
  is_bonded: boolean;
  cargo_type: number;
  categories: Array<GSWHCategories>;
  warehouse_id: string;
}

export interface GSWHCategories {
  category_name: string;
  category_id: number;
}

export enum ZoneTypeEnum {
  ASYMMETRIC = 2,
  SYMMETRIC = 1,
}

export enum OccupancyStatus {
  AVAILABLE = 0,
  IN_PROGRESS = 1,
  IN_COMPLETED = 2,
  OUT_PROGRESS = 3,
}
