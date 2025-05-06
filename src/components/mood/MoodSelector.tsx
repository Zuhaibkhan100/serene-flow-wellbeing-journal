
import { cn } from "@/lib/utils";
import { MoodType } from "@/services/dataService";

interface MoodSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (mood: string) => void;
}

const moods: { type: string; emoji: string; label: string }[] = [
  { type: "😁", emoji: "😁", label: "Great" },
  { type: "🙂", emoji: "🙂", label: "Good" },
  { type: "😐", emoji: "😐", label: "Neutral" },
  { type: "🙁", emoji: "🙁", label: "Down" },
  { type: "😔", emoji: "😔", label: "Sad" }
];

const MoodSelector = ({ selectedMood, onMoodSelect }: MoodSelectorProps) => {
  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {moods.map((mood) => (
        <button
          key={mood.type}
          className={cn(
            "flex flex-col items-center gap-1 p-3 rounded-full transition-all",
            selectedMood === mood.type
              ? "bg-serene-100 ring-2 ring-serene-400 scale-110"
              : "hover:bg-serene-50"
          )}
          onClick={() => onMoodSelect(mood.type)}
          type="button"
        >
          <span className="text-3xl">{mood.emoji}</span>
          <span className="text-xs font-medium">{mood.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
