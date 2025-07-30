"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import type { Habit, HabitFrequency } from '@/lib/types';
import { availableIcons } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import * as LucideIcons from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

const customHabitSchema = z.object({
  name: z.string().min(1, 'Please enter a habit name.'),
  icon: z.string().min(1, 'Please select an icon.'),
  frequency: z.enum(['none', 'daily', 'weekly']),
});

type CustomHabitFormValues = z.infer<typeof customHabitSchema>;

interface CustomHabitFormProps {
  onSubmit: (data: Omit<Habit, 'id' | 'completedDates'>) => void;
  onCancel: () => void;
  existingHabits: Habit[];
}

export function CustomHabitForm({ onSubmit, onCancel, existingHabits }: CustomHabitFormProps) {
  const { toast } = useToast();

  const form = useForm<CustomHabitFormValues>({
    resolver: zodResolver(customHabitSchema),
    defaultValues: {
      name: '',
      icon: '',
      frequency: 'daily',
    },
  });

  const handleFormSubmit = (values: CustomHabitFormValues) => {
    if (existingHabits.some(h => h.name.toLowerCase() === values.name.toLowerCase())) {
        toast({ title: 'Habit Already Exists', description: 'A habit with this name already exists.', variant: 'destructive' });
        return;
    }

    onSubmit({
      ...values,
      frequency: values.frequency as HabitFrequency,
    });
    form.reset();
  };
  
  const recentHabits = existingHabits.slice(-20).reverse();

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add a Custom Habit</DialogTitle>
        <DialogDescription>
          Create your own habit to track.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Habit Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Practice guitar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-48">
                      <div className="grid grid-cols-4 gap-2 p-2">
                        {availableIcons.map((iconName) => {
                          const Icon = (LucideIcons as any)[iconName];
                          return (
                            <SelectItem key={iconName} value={iconName} className="flex justify-center items-center p-2">
                              <div className="flex flex-col items-center gap-1">
                                <Icon className="h-5 w-5" />
                                <span className="text-xs sr-only">{iconName}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Show On Main Card</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DialogFooter className="pt-4 flex-col items-start">
            {recentHabits.length > 0 && (
              <div className="w-full">
                <Separator className="my-4" />
                <p className="text-sm font-medium text-muted-foreground mb-2">Suggestions</p>
                <div className="flex flex-wrap gap-2">
                  {recentHabits.map((habit) => (
                    <Badge
                      key={habit.id}
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => form.setValue('name', habit.name)}
                    >
                      {habit.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="w-full flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
              <Button type="submit">Add Habit</Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
