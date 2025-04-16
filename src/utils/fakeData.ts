
import { MotionDataPoint } from "@/types/motionData";

export const generateFakeMotionData = (pointCount: number = 100): MotionDataPoint[] => {
  const data: MotionDataPoint[] = [];
  const startTime = Date.now() - (pointCount * 1000); // Starting from 'pointCount' seconds ago
  
  for (let i = 0; i < pointCount; i++) {
    // Generate smooth but random-looking data using sin waves with different frequencies
    const t = i / pointCount;
    data.push({
      timestamp: startTime + (i * 1000),
      accel_x: Math.sin(t * 10) * 2 + Math.random() * 0.5,
      accel_y: Math.cos(t * 8) * 1.5 + Math.random() * 0.5,
      accel_z: Math.sin(t * 6) * 1.8 + Math.random() * 0.5,
      gyro_x: Math.sin(t * 4) * 45 + Math.random() * 5,
      gyro_y: Math.cos(t * 5) * 35 + Math.random() * 5,
      gyro_z: Math.sin(t * 7) * 40 + Math.random() * 5,
      lat: 37.7749 + (Math.sin(t * 2) * 0.01), // San Francisco coordinates with small variations
      lng: -122.4194 + (Math.cos(t * 2) * 0.01)
    });
  }
  
  return data;
};

