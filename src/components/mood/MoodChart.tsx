
import { useState } from "react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { MoodEntry, formatDate } from "@/services/dataService";

interface MoodChartProps {
  moodEntries: MoodEntry[];
}

const MoodChart = ({ moodEntries }: MoodChartProps) => {
  const [timeRange, setTimeRange] = useState("week");
  const [chartType, setChartType] = useState("line");
  
  // Function to get mood value (1-10) from emoji
  const getMoodValue = (mood: string): number => {
    const moodMap: Record<string, number> = {
      "😁": 10, // Great
      "🙂": 8,  // Good
      "😐": 6,  // Okay
      "🙁": 4,  // Down
      "😔": 2   // Sad
    };
    return moodMap[mood] || 5;
  };

  // Format entries for chart
  const getChartData = () => {
    // Get last 7 days or 30 days based on timeRange
    const daysToShow = timeRange === "week" ? 7 : 30;
    
    // Create array of last n days
    const result = [];
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = formatDate(date);
      const entry = moodEntries.find(e => e.date === formattedDate);
      
      result.push({
        date: format(date, "EEE"),
        fullDate: format(date, "MMM dd"),
        value: entry ? getMoodValue(entry.mood) : null,
        mood: entry?.mood || null
      });
    }
    return result;
  };

  const chartData = getChartData();

  // Get color based on mood value
  const getMoodColor = (value: number | null) => {
    if (value === null) return "#e5e7eb";
    if (value <= 3) return "#f87171";
    if (value <= 5) return "#fb923c";
    if (value <= 7) return "#fbbf24";
    if (value <= 9) return "#4ade80";
    return "#22c55e";
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Mood Trends</h3>
          <p className="text-sm text-muted-foreground">Track how your mood changes over time</p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Past Week</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={chartType} onValueChange={setChartType} className="w-full mt-4">
        <TabsList className="grid grid-cols-2 max-w-[400px] mb-6">
          <TabsTrigger value="line">Line Chart</TabsTrigger>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
        </TabsList>
        
        <TabsContent value="line" className="h-72">
          <ChartContainer 
            config={{
              mood: {
                label: "Mood Level",
                color: "#8884d8"
              }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="mood"
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 6 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>
        
        <TabsContent value="bar" className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip
                formatter={(value, name, props) => {
                  const entry = props.payload;
                  return [
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Mood Level: {value}</span>
                        {entry.mood && <span className="text-lg">{entry.mood}</span>}
                      </div>
                      <span className="text-xs text-muted-foreground">{entry.fullDate}</span>
                    </div>
                  ];
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getMoodColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MoodChart;
