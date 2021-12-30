import { LngLat, TravelMode } from './index'

export interface IsoParams {
  center: LngLat;
  profile: string;
  minutes?: number | number[];
}

export interface SidebarParams {
  api: string;
  mode: string;
}
