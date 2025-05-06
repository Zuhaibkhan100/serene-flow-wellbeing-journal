
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useStore, formatDate, MoodEntry } from "@/services/dataService";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, isSameDay } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MoodAnalytics = () => {
  const { moodEntries } = useStore();
  const [month, setMonth] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState("week");
  const [chartType, setChartType] = useState("line");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  
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

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const entry = moodEntries.find(e => e.date === formatDate(date));
      setSelectedEntry(entry || null);
    } else {
      setSelectedEntry(null);
    }
  };

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
    <div className="container max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif">Mood Analytics</h1>
          <p className="text-muted-foreground mt-2">Track and analyze your mood patterns</p>
        </div>
        
        <Link to="/mood">
          <Button>
            Add New Entry
          </Button>
        </Link>
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
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border"
              modifiers={{
                hasMood: (date) => getMoodForDate(date) !== null,
                selected: (date) => selectedDate ? isSameDay(date, selectedDate) : false
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
            
            {selectedEntry && (
              <div className="mt-6 p-4 bg-accent/20 rounded-md space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{format(new Date(selectedEntry.date), "MMMM d, yyyy")}</h3>
                  <span className="text-2xl">{selectedEntry.mood}</span>
                </div>
                
                {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Activities:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedEntry.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedEntry.note && (
                  <div>
                    <Separator className="my-2" />
                    <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                    <p className="text-sm">{selectedEntry.note}</p>
                  </div>
                )}
              </div>
            )}
            
            {!selectedEntry && (
              <div className="text-center mt-6 text-sm p-2 bg-muted/20 rounded-md">
                {format(new Date(), "MMMM d, yyyy")}
              </div>
            )}
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
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getMoodColor(entry.value)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
            
            {moodEntries.length === 0 && (
              <div className="flex flex-col items-center justify-center h-52 text-muted-foreground">
                <Info className="h-12 w-12 mb-2 opacity-50" />
                <p>No mood entries yet. Start tracking your mood to see trends.</p>
                <Link to="/mood" className="mt-4">
                  <Button variant="secondary">Add Your First Entry</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoodAnalytics;
