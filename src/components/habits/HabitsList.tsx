
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useStore, formatDate } from "@/services/dataService";

interface HabitsListProps {
  limit?: number;
}

export const HabitsList = ({ limit }: HabitsListProps) => {
  const { habits, toggleHabitCompletion } = useStore();
  
  // Show all habits or limit the number based on props
  const displayHabits = limit ? habits.slice(0, limit) : habits;
  
  const handleToggleHabit = (habitId: string) => {
    toggleHabitCompletion(habitId, formatDate(new Date()));
  };
  
  const getStreakDays = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;
    
    // This is a simplified streak calculation
    return habit.completedDates.length;
  };

  return (
    <div className="space-y-4">
      {displayHabits.map((habit) => {
        const isCompleted = habit.completedDates.includes(formatDate(new Date()));
        const streakDays = getStreakDays(habit.id);
        
        return (
          <div key={habit.id} className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={isCompleted}
                onCheckedChange={() => handleToggleHabit(habit.id)}
                className={isCompleted ? "bg-primary border-primary" : ""}
              />
              <div className={`${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                <p className="font-medium">{habit.name}</p>
                {habit.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {habit.description}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="font-medium">{streakDays} days</p>
            </div>
          </div>
        );
      })}
      
      {limit && habits.length > limit && (
        <Button variant="ghost" className="w-full" asChild>
          <a href="/habits">View all habits</a>
        </Button>
      )}
      
      {habits.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8">
          <Button variant="outline" asChild>
            <a href="/habits">
              <Plus className="mr-2 h-4 w-4" />
              Add new habit
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};
