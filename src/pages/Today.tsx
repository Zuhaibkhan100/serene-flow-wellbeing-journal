
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Check, Heart, Smile } from "lucide-react";
import { useStore, ensureDailyAffirmation, formatDate, MoodType } from "@/services/dataService";
import AffirmationCard from "@/components/affirmations/AffirmationCard";
import MoodSelector from "@/components/mood/MoodSelector";

const Today = () => {
  ensureDailyAffirmation();
  
  const { 
    dailyAffirmation,
    addMoodEntry,
    addGratitudeEntry,
    getTodaysMoodEntry,
    getTodaysGratitudeEntry
  } = useStore();
  
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [gratitudeText, setGratitudeText] = useState("");
  
  const todaysMoodEntry = getTodaysMoodEntry();
  const todaysGratitudeEntry = getTodaysGratitudeEntry();

  // Initialize state from existing entries
  useEffect(() => {
    if (todaysMoodEntry) {
      setSelectedMood(todaysMoodEntry.mood);
      setMoodNote(todaysMoodEntry.note || "");
    }
    if (todaysGratitudeEntry) {
      setGratitudeText(todaysGratitudeEntry.text);
    }
  }, [todaysMoodEntry, todaysGratitudeEntry]);

  const handleSaveMood = () => {
    if (selectedMood) {
      addMoodEntry({
        date: formatDate(new Date()),
        mood: selectedMood,
        note: moodNote.trim() || undefined
      });
    }
  };

  const handleSaveGratitude = () => {
    if (gratitudeText.trim()) {
      addGratitudeEntry({
        date: formatDate(new Date()),
        text: gratitudeText.trim()
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto space-y-8 animate-fade-in">
      <h1 className="text-3xl font-serif text-center">Welcome to your day</h1>
      
      {/* Daily Affirmation */}
      <div className="flex justify-center">
        {dailyAffirmation && (
          <AffirmationCard affirmation={dailyAffirmation} className="max-w-xl w-full" />
        )}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="mood" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="mood" className="flex gap-2 items-center">
            <Smile className="h-4 w-4" />
            <span>Mood Check-in</span>
          </TabsTrigger>
          <TabsTrigger value="gratitude" className="flex gap-2 items-center">
            <Heart className="h-4 w-4" />
            <span>Gratitude</span>
          </TabsTrigger>
        </TabsList>

        {/* Mood Tab */}
        <TabsContent value="mood">
          <Card className="border border-serene-100">
            <CardHeader>
              <CardTitle className="text-center text-xl">How are you feeling today?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <MoodSelector 
                  selectedMood={selectedMood} 
                  onMoodSelect={setSelectedMood}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="mood-note" className="text-sm font-medium">Add a note (optional)</label>
                <Textarea
                  id="mood-note"
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="What's making you feel this way?"
                  className="min-h-[100px] resize-none"
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleSaveMood}
                disabled={!selectedMood}
              >
                <Check className="mr-2 h-4 w-4" />
                {todaysMoodEntry ? "Update" : "Save"} Mood
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gratitude Tab */}
        <TabsContent value="gratitude">
          <Card className="border border-serene-100">
            <CardHeader>
              <CardTitle className="text-center text-xl">What's one thing you're grateful for?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Textarea
                  value={gratitudeText}
                  onChange={(e) => setGratitudeText(e.target.value)}
                  placeholder="I'm grateful for..."
                  className="min-h-[150px] resize-none"
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleSaveGratitude}
                disabled={!gratitudeText.trim()}
              >
                <Check className="mr-2 h-4 w-4" />
                {todaysGratitudeEntry ? "Update" : "Save"} Gratitude
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Today;
