export type Priority = 'low' | 'medium' | 'high';
export type Repeat = 'none' | 'daily' | 'weekly';

export interface Task {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  priority: Priority;
  repeat: Repeat;
  isDone: boolean;
  notifications: boolean;
  lastReset?: string; // YYYY-MM-DD
}

export type HabitFrequency = 'none' | 'daily' | 'weekly';

export interface Habit {
  id: string;
  name: string;
  frequency: HabitFrequency;
  icon: string;
  completedDates: string[];
}

export const availableHabits: Omit<Habit, 'id' | 'frequency' | 'completedDates'>[] = [
  { name: 'Drink Water', icon: 'GlassWater' },
  { name: 'Read Book', icon: 'BookOpen' },
  { name: 'Exercise', icon: 'Dumbbell' },
  { name: 'Meditate', icon: 'BrainCircuit' },
  { name: 'Journal', icon: 'Book' },
  { name: 'Walk', icon: 'Footprints' },
  { name: 'No Sugar', icon: 'MilkOff' },
  { name: 'Sleep Early', icon: 'Bed' },
];

export const availableIcons: string[] = [
  'GlassWater', 'BookOpen', 'Dumbbell', 'BrainCircuit', 'Book', 'Footprints', 'MilkOff', 'Bed',
  'Activity', 'AlarmClock', 'Award', 'Bike', 'Briefcase', 'Brush', 'Carrot', 'CheckSquare',
  'ClipboardList', 'Cloud', 'Coffee', 'Cpu', 'CreditCard', 'DollarSign', 'Droplet', 'Feather',
  'Flag', 'Flame', 'Gift', 'GitBranch', 'Globe', 'Heart', 'Home', 'Image', 'Key', 'Laptop',
  'Leaf', 'Lightbulb', 'Lock', 'MapPin', 'Mic', 'Moon', 'Music', 'PenTool', 'Phone', 'Pizza',
  'Plane', 'Puzzle', 'Save', 'School', 'Settings', 'ShoppingBag', 'Smile', 'Star', 'Sun',
  'Sunrise', 'Sunset', 'Target', 'Train', 'TreePine', 'Trophy', 'Users', 'Video', 'Watch',
  'Wind', 'Zap'
];

    