import { svgToDataUri } from '../../../utils/utils';
import { DefaultPoiIconSvg } from '../../Icons/DefaultPoiIcon/DefaultPoiIcon';
import { DefaultPoiSelectedIconSvg } from '../../Icons/DefaultPoiSelectedIcon/DefaultPoiSelectedIcon';

export const SITUM_DOMAIN = 'https://dashboard.situm.com';
export const BUILDING_NUMBER_OF_CORNERS = 4;
export const MARKER_SIZE = 32;
export const POI_FLY_TO_ZOOM = 20;
export const POI_FLY_TO_DURATION = 500;
export const BUILDING_FILL_COLOR = '#088';
export const BUILDING_FILL_OPACITY = 0.1;
export const BUILDING_BORDER_WIDTH = 2;
export const FLOOR_PLAN_OPACITY = 0.85;

export const DEFAULT_POI_ICON_DATA_URI = svgToDataUri(DefaultPoiIconSvg);
export const DEFAULT_POI_SELECTED_ICON_DATA_URI = svgToDataUri(DefaultPoiSelectedIconSvg);

export const LAYER_CONFIG = {
  buildingFill: {
    id: 'building-fill',
    type: 'fill' as const,
    paint: {
      'fill-color': BUILDING_FILL_COLOR,
      'fill-opacity': BUILDING_FILL_OPACITY,
    },
  },
  buildingBorder: {
    id: 'building-border',
    type: 'line' as const,
    paint: {
      'line-color': BUILDING_FILL_COLOR,
      'line-width': BUILDING_BORDER_WIDTH,
    },
  },
  floorPlan: {
    id: 'floor-plan-layer',
    type: 'raster' as const,
    paint: {
      'raster-opacity': FLOOR_PLAN_OPACITY,
      'raster-fade-duration': 0,
    },
  },
} as const;
