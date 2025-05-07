
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "@/services/dataService";
import MoodChart from "@/components/mood/MoodChart";
import MoodCalendarView from "@/components/mood/MoodCalendarView";

const MoodAnalytics = () => {
  const { moodEntries } = useStore();

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
            <MoodCalendarView moodEntries={moodEntries} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Mood Trends</CardTitle>
            <p className="text-sm text-muted-foreground">Track how your mood changes over time</p>
          </CardHeader>
          <CardContent>
            {moodEntries.length > 0 ? (
              <MoodChart moodEntries={moodEntries} />
            ) : (
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
