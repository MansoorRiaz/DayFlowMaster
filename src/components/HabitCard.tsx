"use client";

import type { Habit } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, CheckCircle, Circle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onDelete: (id: string) => void;
  onToggleDone: (id: string) => void;
  isDone: boolean;
}

const frequencyText = {
  none: 'Not shown on main',
  daily: 'Daily',
  weekly: 'Weekly',
};

export function HabitCard({ habit, onDelete, onToggleDone, isDone }: HabitCardProps) {
  const Icon = (LucideIcons as any)[habit.icon] || LucideIcons.Smile;

  return (
    <Card className={cn(
      "relative transition-all duration-300 hover:shadow-md",
      isDone ? 'bg-card/50' : 'bg-card'
    )}>
      <CardContent className="p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => onToggleDone(habit.id)} aria-label={isDone ? 'Mark as not done' : 'Mark as done'}>
          {isDone ? <CheckCircle className="h-6 w-6 text-green-500" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
        </Button>
        <div className="flex-grow flex items-center gap-4">
          <Icon className={cn("h-7 w-7", isDone ? "text-green-500" : "text-accent")} />
          <div>
            <p className={cn("font-medium", isDone && "line-through text-muted-foreground")}>{habit.name}</p>
            <Badge variant="outline" className="text-xs capitalize mt-1">{frequencyText[habit.frequency]}</Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(habit.id)} aria-label="Delete habit">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
