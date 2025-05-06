
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Heart, Smile, Clock, MessageSquare, ChevronRight } from "lucide-react";
import { useStore, ensureDailyAffirmation, formatDate } from "@/services/dataService";
import AffirmationCard from "@/components/affirmations/AffirmationCard";
import MoodSelector from "@/components/mood/MoodSelector";
import { Link } from "react-router-dom";
import { HabitsList } from "@/components/habits/HabitsList";
import { StudyTimer } from "@/components/focus/StudyTimer";
import { BreathingExercise } from "@/components/meditation/BreathingExercise";

const Today = () => {
  ensureDailyAffirmation();
  
  const { 
    dailyAffirmation,
    habits,
    getTodaysMoodEntry,
  } = useStore();
  
  const todaysMoodEntry = getTodaysMoodEntry();
  const completedHabits = habits.filter(habit => 
    habit.completedDates.includes(formatDate(new Date()))
  ).length;

  return (
    <div className="container max-w-6xl mx-auto space-y-8 animate-fade-in">
      <h1 className="text-3xl font-serif text-center">Welcome to SereniFlow</h1>
      
      {/* Daily Affirmation */}
      <div className="flex justify-center">
        {dailyAffirmation && (
          <AffirmationCard affirmation={dailyAffirmation} className="max-w-xl w-full" />
        )}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood Section */}
        <Card className="border border-serene-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">
              <div className="flex items-center gap-2">
                <Smile className="h-5 w-5" />
                <span>Today's Mood</span>
              </div>
            </CardTitle>
            <Link to="/mood">
              <Button variant="ghost" size="sm" className="gap-1">
                <span>View Details</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {todaysMoodEntry ? (
              <div className="flex flex-col items-center gap-4">
                <div className="text-5xl">{todaysMoodEntry.mood}</div>
                <p className="text-muted-foreground text-center">
                  {todaysMoodEntry.note || "No notes added for today."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-muted-foreground">You haven't logged your mood today</p>
                <Link to="/mood">
                  <Button>
                    <Smile className="mr-2 h-4 w-4" />
                    Check In
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Habits Section */}
        <Card className="border border-serene-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>Daily Habits</span>
              </div>
            </CardTitle>
            <Link to="/habits">
              <Button variant="ghost" size="sm" className="gap-1">
                <span>View All</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {habits.length > 0 ? (
              <>
                <div className="text-sm mb-4 text-muted-foreground">
                  {completedHabits} of {habits.length} habits completed today
                </div>
                <HabitsList limit={3} />
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-muted-foreground">You haven't created any habits yet</p>
                <Link to="/habits">
                  <Button>
                    <Check className="mr-2 h-4 w-4" />
                    Create Habits
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Access Tools */}
        <Card className="border border-serene-100 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Quick Access Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="breathe" className="w-full">
              <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-4">
                <TabsTrigger value="breathe" className="flex gap-2 items-center">
                  <Clock className="h-4 w-4" />
                  <span>Breathe</span>
                </TabsTrigger>
                <TabsTrigger value="timer" className="flex gap-2 items-center">
                  <Clock className="h-4 w-4" />
                  <span>Focus Timer</span>
                </TabsTrigger>
                <TabsTrigger value="coach" className="flex gap-2 items-center">
                  <MessageSquare className="h-4 w-4" />
                  <span>AI Coach</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="breathe">
                <BreathingExercise />
              </TabsContent>
              
              <TabsContent value="timer">
                <StudyTimer />
              </TabsContent>
              
              <TabsContent value="coach">
                <div className="flex flex-col items-center gap-4 py-4">
                  <p className="text-muted-foreground text-center">
                    Chat with your AI wellness coach for personalized advice and support
                  </p>
                  <Link to="/coach">
                    <Button>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Open Coach
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Today;
