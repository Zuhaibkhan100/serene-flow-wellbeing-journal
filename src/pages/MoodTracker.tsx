
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useStore, formatDate, MoodType } from "@/services/dataService";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import MoodSelector from "@/components/mood/MoodSelector";

interface ActivityTag {
  name: string;
  selected: boolean;
}

const MoodTracker = () => {
  const { addMoodEntry } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State for mood selection
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [moodLevel, setMoodLevel] = useState<number>(5);
  const [note, setNote] = useState<string>("");
  
  // State for activity tags
  const [activityTags, setActivityTags] = useState<ActivityTag[]>([
    { name: "Exercise", selected: false },
    { name: "Work", selected: false },
    { name: "Family", selected: false },
    { name: "Friends", selected: false },
    { name: "Sleep", selected: false },
    { name: "Meditation", selected: false },
    { name: "Reading", selected: false },
    { name: "Travel", selected: false },
    { name: "Outdoors", selected: false },
    { name: "Food", selected: false },
    { name: "Creative", selected: false },
    { name: "Learning", selected: false },
    { name: "Self-care", selected: false },
    { name: "Resting", selected: false },
  ]);

  // Toggle activity tag selection
  const toggleActivityTag = (index: number) => {
    const updatedTags = [...activityTags];
    updatedTags[index].selected = !updatedTags[index].selected;
    setActivityTags(updatedTags);
  };

  // Save mood entry
  const handleSaveEntry = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Pick an emoji that represents how you're feeling.",
        variant: "destructive"
      });
      return;
    }

    // Get selected activity tags
    const selectedTags = activityTags
      .filter(tag => tag.selected)
      .map(tag => tag.name);

    // Create mood entry
    addMoodEntry({
      date: formatDate(new Date()),
      mood: selectedMood,
      note: note,
      tags: selectedTags
    });

    toast({
      title: "Mood tracked successfully!",
      description: "Your mood entry has been saved.",
    });

    // Navigate to analytics page
    navigate("/mood/analytics");
  };

  const getMoodLevelLabel = () => {
    if (moodLevel <= 3) return "Not good";
    if (moodLevel <= 7) return "Neutral";
    return "Amazing";
  };

  return (
    <div className="container max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif">Track Your Mood</h1>
        <p className="text-muted-foreground mt-2">
          Record how you're feeling and reflect on your day
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Select an emoji that best describes how you're feeling right now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Mood Emoji Selection */}
          <MoodSelector selectedMood={selectedMood} onMoodSelect={setSelectedMood} />
          
          {/* Mood Level Slider */}
          <div className="space-y-2">
            <p className="text-center font-medium">Fine-tune your mood level (1-10)</p>
            <Slider
              value={[moodLevel]}
              min={1}
              max={10}
              step={1}
              onValueChange={(values) => setMoodLevel(values[0])}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Not good</span>
              <span>{getMoodLevelLabel()}</span>
              <span>Amazing</span>
            </div>
          </div>

          {/* Activity Tags */}
          <div className="space-y-2">
            <p className="font-medium">What activities have you done today? (optional)</p>
            <ScrollArea className="h-24">
              <div className="flex flex-wrap gap-2">
                {activityTags.map((tag, index) => (
                  <Badge
                    key={tag.name}
                    variant={tag.selected ? "default" : "outline"}
                    className={`cursor-pointer hover:bg-accent/50 ${tag.selected ? "" : "bg-background"}`}
                    onClick={() => toggleActivityTag(index)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <p className="font-medium">Add some notes about your day (optional)</p>
            <Textarea
              placeholder="What's on your mind today?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button onClick={handleSaveEntry}>
              Save Entry
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodTracker;
