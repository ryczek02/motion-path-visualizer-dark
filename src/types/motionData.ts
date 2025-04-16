
export interface MotionDataPoint {
  timestamp: number;
  accel_x: number;
  accel_y: number;
  accel_z: number;
  gyro_x: number;
  gyro_y: number;
  gyro_z: number;
  lat?: number;
  lng?: number;
  estimatedSpeed?: number;
}

export interface ChartDataSeries {
  name: string;
  data: number[];
}

export interface ProcessedMotionData {
  timestamps: number[];
  acceleration: {
    x: number[];
    y: number[];
    z: number[];
    magnitude: number[];
  };
  gyroscope: {
    x: number[];
    y: number[];
    z: number[];
  };
  gps: {
    lat: number[];
    lng: number[];
  };
  speed: number[];
  timeLabels: string[];
}

export type ChartType = 'acceleration' | 'gyroscope' | 'speed' | 'location';
