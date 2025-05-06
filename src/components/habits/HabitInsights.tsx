
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/services/dataService";

export const HabitInsights = () => {
  const { habits } = useStore();

  // Get streak for each habit
  const streaks = habits.map(habit => {
    return {
      name: habit.name,
      streak: habit.completedDates.length // Simplified streak calculation
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Insights</CardTitle>
        <p className="text-sm text-muted-foreground">Your consistency patterns</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-md p-6 flex items-center justify-center min-h-52 bg-muted/20">
          <p className="text-muted-foreground text-center">
            Habit completion chart coming soon
          </p>
        </div>

        {habits.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Current Streak</h3>
            <div className="grid grid-cols-3 gap-4">
              {streaks.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-accent/30 rounded-lg p-4 flex flex-col items-center justify-center text-center"
                >
                  <span className="text-2xl font-bold">{item.streak}</span>
                  <span className="text-sm text-muted-foreground mt-1 line-clamp-1">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
