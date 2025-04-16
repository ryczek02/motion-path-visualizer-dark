import { MotionDataPoint, ProcessedMotionData } from "@/types/motionData";

// Parse CSV data to structured format
export const parseCSVData = (csvText: string): MotionDataPoint[] => {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");
  
  // Validate required headers
  const requiredHeaders = ["timestamp", "accel_x", "accel_y", "accel_z", "gyro_x", "gyro_y", "gyro_z"];
  const hasRequiredHeaders = requiredHeaders.every(header => headers.includes(header));
  
  if (!hasRequiredHeaders) {
    throw new Error("CSV file is missing required headers. Required format: timestamp,accel_x,accel_y,accel_z,gyro_x,gyro_y,gyro_z");
  }
  
  // Parse data rows
  const dataPoints: MotionDataPoint[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(",");
    const dataPoint: MotionDataPoint = {
      timestamp: Number(values[headers.indexOf("timestamp")]),
      accel_x: Number(values[headers.indexOf("accel_x")]),
      accel_y: Number(values[headers.indexOf("accel_y")]),
      accel_z: Number(values[headers.indexOf("accel_z")]),
      gyro_x: Number(values[headers.indexOf("gyro_x")]),
      gyro_y: Number(values[headers.indexOf("gyro_y")]),
      gyro_z: Number(values[headers.indexOf("gyro_z")])
    };
    
    // Check for GPS data
    if (headers.includes("lat") && headers.includes("lng")) {
      dataPoint.lat = Number(values[headers.indexOf("lat")]);
      dataPoint.lng = Number(values[headers.indexOf("lng")]);
    }
    
    dataPoints.push(dataPoint);
  }
  
  return dataPoints;
};

// Process data points for charting and analysis
export const processMotionData = (dataPoints: MotionDataPoint[]): ProcessedMotionData => {
  // Sort by timestamp
  const sortedData = [...dataPoints].sort((a, b) => a.timestamp - b.timestamp);
  
  // Calculate estimated speed
  const dataWithSpeed = calculateSpeed(sortedData);
  
  const result: ProcessedMotionData = {
    timestamps: [],
    acceleration: { x: [], y: [], z: [], magnitude: [] },
    gyroscope: { x: [], y: [], z: [] },
    gps: { lat: [], lng: [] },
    speed: [],
    timeLabels: []
  };
  
  dataWithSpeed.forEach(point => {
    result.timestamps.push(point.timestamp);
    
    // Format timestamp for display
    const date = new Date(point.timestamp);
    result.timeLabels.push(date.toLocaleTimeString());
    
    // Acceleration
    result.acceleration.x.push(point.accel_x);
    result.acceleration.y.push(point.accel_y);
    result.acceleration.z.push(point.accel_z);
    
    // Calculate magnitude
    const magnitude = Math.sqrt(
      point.accel_x * point.accel_x + 
      point.accel_y * point.accel_y + 
      point.accel_z * point.accel_z
    );
    result.acceleration.magnitude.push(magnitude);
    
    // Gyroscope
    result.gyroscope.x.push(point.gyro_x);
    result.gyroscope.y.push(point.gyro_y);
    result.gyroscope.z.push(point.gyro_z);
    
    // GPS
    if (point.lat !== undefined && point.lng !== undefined) {
      result.gps.lat.push(point.lat);
      result.gps.lng.push(point.lng);
    }
    
    // Speed
    if (point.estimatedSpeed !== undefined) {
      result.speed.push(point.estimatedSpeed);
    }
  });
  
  return result;
};

// Estimate speed from acceleration data
const calculateSpeed = (dataPoints: MotionDataPoint[]): MotionDataPoint[] => {
  if (dataPoints.length < 2) return dataPoints;
  
  const result = [...dataPoints];
  let currentSpeed = 0;
  
  for (let i = 1; i < result.length; i++) {
    const prevPoint = result[i - 1];
    const currentPoint = result[i];
    
    // Time difference in seconds
    const dt = (currentPoint.timestamp - prevPoint.timestamp) / 1000;
    
    if (dt <= 0 || dt > 1) {
      currentPoint.estimatedSpeed = currentSpeed;
      continue;
    }

    // Calculate speed using both acceleration and GPS data
    let speedFromAccel = 0;
    let speedFromGPS = 0;

    // Speed from acceleration
    const accelMag = Math.sqrt(
      currentPoint.accel_x * currentPoint.accel_x +
      currentPoint.accel_y * currentPoint.accel_y +
      currentPoint.accel_z * currentPoint.accel_z
    ) - 9.81; // Remove gravity

    speedFromAccel = Math.max(0, currentSpeed + accelMag * dt);

    // Speed from GPS (if available)
    if (currentPoint.lat && currentPoint.lng && prevPoint.lat && prevPoint.lng) {
      const distance = calculateDistance(
        prevPoint.lat, prevPoint.lng,
        currentPoint.lat, currentPoint.lng
      );
      speedFromGPS = distance / dt; // m/s
    }

    // Combine both speed estimates (weighted average)
    currentSpeed = speedFromGPS > 0 ? 
      (speedFromAccel * 0.3 + speedFromGPS * 0.7) : // If GPS available, trust it more
      speedFromAccel;

    // Apply mild smoothing
    currentSpeed = currentSpeed * 0.95;
    currentSpeed = Math.max(0, currentSpeed);
    
    currentPoint.estimatedSpeed = currentSpeed;
  }
  
  return result;
};

// Calculate distance between two GPS points using the Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};
