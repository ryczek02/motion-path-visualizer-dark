
import React from "react";
import { Activity, GaugeCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MotionChart from "./MotionChart";
import { ProcessedMotionData } from "@/types/motionData";
import { generateFakeMotionData } from "@/utils/fakeData";
import { processMotionData } from "@/utils/dataProcessor";

const Dashboard: React.FC = () => {
  const fakeData = generateFakeMotionData(100);
  const data = processMotionData(fakeData);

  const generateChartData = () => {
    if (!data) return [];
    
    return data.timeLabels.map((time, index) => ({
      time,
      accel_x: data.acceleration.x[index],
      accel_y: data.acceleration.y[index],
      accel_z: data.acceleration.z[index],
      accel_mag: data.acceleration.magnitude[index],
      gyro_x: data.gyroscope.x[index],
      gyro_y: data.gyroscope.y[index],
      gyro_z: data.gyroscope.z[index],
      speed: data.speed[index] || 0
    }));
  };

  const chartData = generateChartData();

  const calculateStats = () => {
    if (!data || !data.speed.length) return { avg: 0, max: 0 };
    
    const speeds = data.speed.filter(s => !isNaN(s) && s !== undefined);
    const avg = speeds.reduce((sum, val) => sum + val, 0) / speeds.length;
    const max = Math.max(...speeds);
    
    return { avg, max };
  };
  
  const { avg, max } = calculateStats();

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" strokeWidth={1.5} />
          <span>Motion Path Visualizer</span>
        </h1>
        <p className="text-muted-foreground">
          Analyzing motion data with speed estimation
        </p>
      </header>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-secondary/40 border-secondary/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Data Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fakeData.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary/40 border-secondary/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Speed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avg.toFixed(2)} m/s</div>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary/40 border-secondary/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Max Speed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{max.toFixed(2)} m/s</div>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary/40 border-secondary/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Time Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {data && data.timeLabels.length > 0 ? (
                  <>
                    {data.timeLabels[0]} - {data.timeLabels[data.timeLabels.length - 1]}
                  </>
                ) : "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MotionChart
            title="Acceleration Data"
            data={chartData}
            dataKeys={[
              { key: "accel_x", color: "#00e5ff", name: "X-axis" },
              { key: "accel_y", color: "#ff00e5", name: "Y-axis" },
              { key: "accel_z", color: "#0077ff", name: "Z-axis" },
              { key: "accel_mag", color: "#7fff00", name: "Magnitude" }
            ]}
            type="acceleration"
            unit="m/s²"
          />
          
          <MotionChart
            title="Gyroscope Data"
            data={chartData}
            dataKeys={[
              { key: "gyro_x", color: "#00e5ff", name: "X-axis" },
              { key: "gyro_y", color: "#ff00e5", name: "Y-axis" },
              { key: "gyro_z", color: "#0077ff", name: "Z-axis" }
            ]}
            type="gyroscope"
            unit="rad/s"
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <MotionChart
            title="Estimated Speed"
            data={chartData}
            dataKeys={[
              { key: "speed", color: "#00e5ff", name: "Speed" },
            ]}
            type="speed"
            unit="m/s"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
