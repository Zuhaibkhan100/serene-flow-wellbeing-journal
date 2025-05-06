
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useStore, formatDate } from "@/services/dataService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const MoodAnalytics = () => {
  const { moodEntries } = useStore();
  const [month, setMonth] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState("week");
  const [chartType, setChartType] = useState("line");
  
  // Function to get mood value (1-10) from emoji
  const getMoodValue = (mood: string): number => {
    const moodMap: Record<string, number> = {
      "😁": 10, // very happy
      "🙂": 8,  // happy
      "😐": 6,  // neutral
      "🙁": 4,  // sad
      "😔": 2   // very sad
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
        date: format(date, "EEE"), // Abbreviated day name
        value: entry ? getMoodValue(entry.mood) : null
      });
    }
    return result;
  };

  const chartData = getChartData();

  // Calendar functions
  const handlePrevMonth = () => {
    setMonth(subMonths(month, 1));
  };
  
  const handleNextMonth = () => {
    setMonth(addMonths(month, 1));
  };

  // Get mood entry for a date
  const getMoodForDate = (date: Date) => {
    const entry = moodEntries.find(e => e.date === formatDate(date));
    return entry?.mood || null;
  };

  return (
    <div className="container max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif">Mood Analytics</h1>
        <p className="text-muted-foreground mt-2">Track and analyze your mood patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Mood Calendar</CardTitle>
            <p className="text-sm text-muted-foreground">View your daily mood entries</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <button onClick={handlePrevMonth} className="p-2">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-medium">{format(month, "MMMM yyyy")}</h2>
              <button onClick={handleNextMonth} className="p-2">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={undefined}
              className="rounded-md border"
              modifiers={{
                hasMood: (date) => getMoodForDate(date) !== null,
              }}
              modifiersStyles={{
                hasMood: { backgroundColor: "rgba(147, 197, 253, 0.2)" }
              }}
              components={{
                DayContent: (props) => {
                  const mood = getMoodForDate(props.date);
                  return (
                    <div className="flex flex-col items-center justify-center">
                      <div>{props.date.getDate()}</div>
                      {mood && <div className="text-xs">{mood}</div>}
                    </div>
                  );
                },
              }}
            />
            
            <div className="text-center mt-6 text-sm p-2 bg-muted/20 rounded-md">
              {format(new Date(), "MMMM d, yyyy")}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mood Trends</CardTitle>
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
          </CardHeader>
          <CardContent>
            <Tabs value={chartType} onValueChange={setChartType} className="w-full">
              <TabsList className="grid grid-cols-2 max-w-[400px] mb-6">
                <TabsTrigger value="line">Line Chart</TabsTrigger>
                <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              </TabsList>
              
              <TabsContent value="line" className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip formatter={(value) => [`Mood: ${value}`, 'Mood Level']} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 6 }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="bar" className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip formatter={(value) => [`Mood: ${value}`, 'Mood Level']} />
                    <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoodAnalytics;
