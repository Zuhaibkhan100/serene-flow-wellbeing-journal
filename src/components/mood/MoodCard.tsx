
import { Card, CardContent } from "@/components/ui/card";
import { MoodEntry, MoodType } from "@/services/dataService";

// Emoji and color mapping for different mood types
const moodEmoji: Record<MoodType, string> = {
  happy: "😊",
  calm: "😌",
  neutral: "😐",
  sad: "😔",
  anxious: "😰"
};

const moodColors: Record<MoodType, string> = {
  happy: "bg-glow-50",
  calm: "bg-calm-50",
  neutral: "bg-gray-50",
  sad: "bg-serene-50",
  anxious: "bg-red-50"
};

const moodLabels: Record<MoodType, string> = {
  happy: "Happy",
  calm: "Calm",
  neutral: "Neutral",
  sad: "Sad",
  anxious: "Anxious"
};

interface MoodCardProps {
  moodEntry: MoodEntry;
}

const MoodCard = ({ moodEntry }: MoodCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className={`${moodColors[moodEntry.mood]} py-2 px-4 flex items-center gap-2`}>
        <span className="text-xl">{moodEmoji[moodEntry.mood]}</span>
        <h3 className="font-medium">{moodLabels[moodEntry.mood]}</h3>
      </div>
      {moodEntry.note && (
        <CardContent className="p-4">
          <p>{moodEntry.note}</p>
        </CardContent>
      )}
    </Card>
  );
};

export default MoodCard;
