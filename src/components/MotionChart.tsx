
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { ChartType } from "@/types/motionData";

interface ChartProps {
  title: string;
  data: Record<string, any>[];
  dataKeys: { key: string; color: string; name: string }[];
  type: ChartType;
  unit?: string;
}

const MotionChart: React.FC<ChartProps> = ({ title, data, dataKeys, type, unit = "" }) => {
  const renderTooltipContent = (props: any) => {
    const { active, payload, label } = props;
    
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-3 rounded-md shadow-lg">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center gap-2 py-0.5">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium">{entry.name}: </span>
              <span className="text-sm">
                {entry.value.toFixed(2)}{unit ? ` ${unit}` : ""}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-secondary/40 border-secondary/60 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-1 sm:p-4">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                tick={{ fill: "hsl(var(--muted-foreground))" }} 
                stroke="hsl(var(--muted-foreground))"
                tickMargin={8}
              />
              <YAxis 
                tick={{ fill: "hsl(var(--muted-foreground))" }} 
                stroke="hsl(var(--muted-foreground))"
                tickMargin={8}
                width={40}
                domain={['auto', 'auto']}
              />
              <Tooltip content={renderTooltipContent} />
              <Legend 
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingLeft: 10 }}
              />
              {dataKeys.map((item, index) => (
                <Line
                  key={`line-${index}`}
                  type="monotone"
                  dataKey={item.key}
                  name={item.name}
                  stroke={item.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotionChart;
