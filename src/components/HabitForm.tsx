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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import type { Habit, HabitFrequency } from '@/lib/types';
import { availableHabits } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const habitSchema = z.object({
  name: z.string().min(1, 'Please select a habit.'),
  frequency: z.enum(['none', 'daily', 'weekly']),
});

type HabitFormValues = z.infer<typeof habitSchema>;

interface HabitFormProps {
  onSubmit: (data: Omit<Habit, 'id' | 'completedDates'>) => void;
  onCancel: () => void;
  existingHabits: Habit[];
}

export function HabitForm({ onSubmit, onCancel, existingHabits }: HabitFormProps) {
  const { toast } = useToast();

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: '',
      frequency: 'daily',
    },
  });

  const handleFormSubmit = (values: HabitFormValues) => {
    const selectedHabitInfo = availableHabits.find(h => h.name === values.name);
    if (!selectedHabitInfo) {
      toast({ title: 'Error', description: 'Selected habit not found.', variant: 'destructive' });
      return;
    }

    if (existingHabits.some(h => h.name === values.name)) {
        toast({ title: 'Habit Already Exists', description: 'You are already tracking this habit.', variant: 'destructive' });
        return;
    }

    onSubmit({
      ...values,
      icon: selectedHabitInfo.icon,
      frequency: values.frequency as HabitFrequency,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add a new Habit</DialogTitle>
        <DialogDescription>
          Choose a habit to track and how often you want to be reminded.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Habit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a habit to track" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableHabits.map((habit) => (
                      <SelectItem key={habit.name} value={habit.name}>
                        {habit.name}
                      </SelectItem>
                    ))}
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
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Add Habit</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
