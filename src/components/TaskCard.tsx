"use client";

import type { Task } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Bell, BellOff, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO, isToday, differenceInDays, endOfWeek } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onToggleDone: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onToggleNotification: (id: string) => void;
}

const priorityStyles = {
  low: {
    indicator: 'bg-accent',
    badge: 'border-accent text-accent',
  },
  medium: {
    indicator: 'bg-yellow-500',
    badge: 'border-yellow-500 text-yellow-600',
  },
  high: {
    indicator: 'bg-destructive',
    badge: 'border-destructive text-destructive',
  },
};

export function TaskCard({ task, onToggleDone, onDelete, onEdit, onToggleNotification }: TaskCardProps) {
  const styles = priorityStyles[task.priority];
  const taskDate = new Date(task.date + 'T00:00:00');

  const getRepeatText = () => {
    if (task.repeat === 'none') return '';
    if (task.repeat === 'daily') return 'Repeats daily';
    if (task.repeat === 'weekly') {
      const today = new Date();
      const endOfWeekDate = endOfWeek(taskDate, { weekStartsOn: 1 });
      const daysRemaining = differenceInDays(endOfWeekDate, today);
      if (daysRemaining < 0) return 'Weekly task ended';
      return `Weekly (${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left)`;
    }
    return '';
  }

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-md",
      task.isDone ? 'bg-card/50' : 'bg-card'
    )}>
      <div className={cn("absolute left-0 top-0 h-full w-1.5", styles.indicator)} />
      <CardContent className="p-4 pl-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => onToggleDone(task.id)} aria-label={task.isDone ? 'Mark as not done' : 'Mark as done'}>
          {task.isDone ? <CheckCircle className="h-6 w-6 text-green-500" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
        </Button>
        <div className="flex-grow">
          <p className={cn("font-medium", task.isDone && "line-through text-muted-foreground")}>
            {task.title}
          </p>
          <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
            <span>{task.time}</span>
            {!isToday(taskDate) && task.repeat === 'none' && <span>{format(taskDate, 'MMM d')}</span>}
            {task.repeat !== 'none' && <Badge variant="outline" className="text-xs">{getRepeatText()}</Badge>}
            <Badge variant="outline" className={cn('capitalize', styles.badge)}>{task.priority}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onToggleNotification(task.id)} aria-label={task.notifications ? 'Disable notification' : 'Enable notification'}>
            {task.notifications ? <Bell className="h-4 w-4 text-accent" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(task)} aria-label="Edit task">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(task.id)} aria-label="Delete task">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

    