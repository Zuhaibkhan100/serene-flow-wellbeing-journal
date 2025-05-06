
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Calendar } from "lucide-react";
import { useStore, formatDate } from "@/services/dataService";
import { format, subDays } from "date-fns";
import { HabitsList } from "@/components/habits/HabitsList";
import { HabitInsights } from "@/components/habits/HabitInsights";

const Habits = () => {
  const { habits, addHabit } = useStore();
  const [open, setOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitDescription, setNewHabitDescription] = useState("");

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

  return (
    <div className="container max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif">Habit Tracker</h1>
        <p className="text-muted-foreground mt-2">Build consistency with daily actions</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Daily Habits</CardTitle>
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
            </CardHeader>
            <CardContent>
              {habits.length > 0 ? (
                <HabitsList />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You haven't created any habits yet.</p>
                  <p className="mt-2">Start by adding your first daily habit!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <HabitInsights />
        </div>
      </div>
    </div>
  );
};

export default Habits;
