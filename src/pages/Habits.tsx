
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useStore, formatDate } from "@/services/dataService";
import { format, subDays } from "date-fns";

const Habits = () => {
  const { habits, addHabit, toggleHabitCompletion } = useStore();
  const [open, setOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitDescription, setNewHabitDescription] = useState("");

  // Get the last 7 days for display
  const recentDays = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      date,
      formattedFull: formatDate(date),
      formattedDay: format(date, "EEE")
    };
  }).reverse();

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit({
        name: newHabitName.trim(),
        description: newHabitDescription.trim() || undefined
      });
      
      // Reset form and close dialog
      setNewHabitName("");
      setNewHabitDescription("");
      setOpen(false);
    }
  };

  const handleToggleHabit = (habitId: string, date: string) => {
    toggleHabitCompletion(habitId, date);
  };

  return (
    <div className="container max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif">Habits</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>New Habit</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Morning meditation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={newHabitDescription}
                  onChange={(e) => setNewHabitDescription(e.target.value)}
                  placeholder="Spend 10 minutes in mindful meditation each morning"
                />
              </div>
              <Button 
                onClick={handleAddHabit} 
                className="w-full"
                disabled={!newHabitName.trim()}
              >
                Create Habit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Habits</CardTitle>
        </CardHeader>
        <CardContent>
          {habits.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="min-w-[180px] py-3 px-2">Habit</th>
                    {recentDays.map((day) => (
                      <th key={day.formattedFull} className="text-center py-3 px-2">
                        {day.formattedDay}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {habits.map((habit) => (
                    <tr key={habit.id} className="border-t hover:bg-muted/50">
                      <td className="py-4 px-2">
                        <div className="font-medium">{habit.name}</div>
                        {habit.description && (
                          <p className="text-xs text-muted-foreground mt-1">{habit.description}</p>
                        )}
                      </td>
                      {recentDays.map((day) => (
                        <td key={`${habit.id}-${day.formattedFull}`} className="text-center py-4 px-2">
                          <Checkbox
                            checked={habit.completedDates.includes(day.formattedFull)}
                            onCheckedChange={() => handleToggleHabit(habit.id, day.formattedFull)}
                            className="mx-auto"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>You haven't created any habits yet.</p>
              <p className="mt-2">Start by adding your first daily habit!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Habits;
