"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Task, Habit } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { TaskForm } from '@/components/TaskForm';
import { TaskCard } from '@/components/TaskCard';
import { HabitForm } from '@/components/HabitForm';
import { HabitCard } from '@/components/HabitCard';
import { CustomHabitForm } from '@/components/CustomHabitForm';
import { AIAssistant } from '@/components/AIAssistant';
import { Plus, Bell, Circle, CheckCircle, Loader2, Waves } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, isToday, isThisWeek, isAfter } from 'date-fns';

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [customHabits, setCustomHabits] = useState<Habit[]>([]);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false);
  const [isCustomHabitFormOpen, setIsCustomHabitFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const timeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Create Day Flow icon data URL for notifications
  const getDayFlowIcon = () => {
    // Create a simple SVG icon that represents the Day Flow waves
    const svgIcon = `
      <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" fill="#3B82F6" rx="12"/>
        <path d="M12 32 Q20 20 28 32 T44 32 T60 32" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M12 40 Q20 28 28 40 T44 40 T60 40" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M12 48 Q20 36 28 48 T44 48 T60 48" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5"/>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svgIcon)}`;
  };

  const resetDailyItems = useCallback(() => {
    const now = new Date();
    // Reset at 3 AM
    if (now.getHours() >= 3) {
      const todayStr = format(now, 'yyyy-MM-dd');
      
      const resetTaskStatus = (task: Task): Task => {
        if (task.repeat === 'daily' || (task.repeat === 'weekly' && isThisWeek(new Date(task.date), { weekStartsOn: 1 }))) {
           if (task.lastReset !== todayStr) {
             return { ...task, isDone: false, lastReset: todayStr };
           }
        }
        return task;
      };

      setTasks(prevTasks => prevTasks.map(resetTaskStatus));
    }
  }, []);

  const scheduleDailyReminders = useCallback(() => {
    console.log('Scheduling daily reminders, permission:', notificationPermission);
    
    if (notificationPermission !== 'granted') {
      console.log('Daily reminders not scheduled - permission not granted');
      return;
    }

    // Clear existing daily reminders
    if (timeouts.current.has('daily-6am')) {
      clearTimeout(timeouts.current.get('daily-6am'));
      timeouts.current.delete('daily-6am');
    }
    if (timeouts.current.has('daily-midnight')) {
      clearTimeout(timeouts.current.get('daily-midnight'));
      timeouts.current.delete('daily-midnight');
    }
    
    const now = new Date();
    
    // 6 AM reminder
    const next6AM = new Date();
    next6AM.setHours(6, 0, 0, 0);
    if (now > next6AM) {
      next6AM.setDate(next6AM.getDate() + 1);
    }
    console.log('Scheduling 6AM reminder for:', next6AM, 'in', next6AM.getTime() - now.getTime(), 'ms');
    const sixAMTimeout = setTimeout(() => {
      console.log('Sending 6AM notification');
      new Notification('Good Morning!', {
        body: `Ready to plan your day with Day Flow?`,
        icon: getDayFlowIcon(),
      });
      scheduleDailyReminders(); // Reschedule for the next day
    }, next6AM.getTime() - now.getTime());
    timeouts.current.set('daily-6am', sixAMTimeout);

    // Midnight congratulations
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0); // Start of next day
    console.log('Scheduling midnight reminder for:', nextMidnight, 'in', nextMidnight.getTime() - now.getTime(), 'ms');
    const midnightTimeout = setTimeout(() => {
      const todayTasks = tasks.filter(isTaskForToday);
      const allTasksDone = todayTasks.length > 0 && todayTasks.every(t => t.isDone);
      console.log('Checking midnight tasks, all done:', allTasksDone);
      if (allTasksDone) {
        console.log('Sending congratulations notification');
        new Notification('Congratulations!', {
          body: `You've completed all your tasks for today. Great job!`,
          icon: getDayFlowIcon(),
        });
      }
      scheduleDailyReminders(); // Reschedule for the next day
    }, nextMidnight.getTime() - now.getTime());
    timeouts.current.set('daily-midnight', midnightTimeout);

  }, [notificationPermission, tasks]);

  useEffect(() => {
    setCurrentDate(format(new Date(), 'EEEE, MMMM do'));
    
    // Update time every second
    const updateTime = () => {
      setCurrentTime(format(new Date(), 'HH:mm'));
    };
    updateTime(); // Set initial time
    const timeInterval = setInterval(updateTime, 1000);
    
    const storedName = localStorage.getItem('dayflow_userName');
    const storedTasks = localStorage.getItem('dayflow_tasks');
    const storedHabits = localStorage.getItem('dayflow_habits');
    const storedCustomHabits = localStorage.getItem('dayflow_customHabits');
    
    if (storedName) {
      setUserName(storedName);
    } else {
      setIsNameModalOpen(true);
    }
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    if (storedHabits) {
      const parsedHabits = JSON.parse(storedHabits).map((h: Habit) => ({
        ...h,
        completedDates: h.completedDates || [],
      }));
      setHabits(parsedHabits);
    }
    if (storedCustomHabits) {
      const parsedHabits = JSON.parse(storedCustomHabits).map((h: Habit) => ({
        ...h,
        completedDates: h.completedDates || [],
      }));
      setCustomHabits(parsedHabits);
    }

    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setNotificationPermission(currentPermission);
    }
    setIsLoading(false);
    
    resetDailyItems();
    const timer = setInterval(resetDailyItems, 60 * 60 * 1000); // Check every hour
    
    return () => {
      clearInterval(timer);
      clearInterval(timeInterval);
    };

  }, [resetDailyItems]);
  
  useEffect(() => {
    if(notificationPermission === 'granted') {
      scheduleDailyReminders();
    }
    return () => {
      if (timeouts.current.has('daily-6am')) clearTimeout(timeouts.current.get('daily-6am'));
      if (timeouts.current.has('daily-midnight')) clearTimeout(timeouts.current.get('daily-midnight'));
    }
  }, [notificationPermission, scheduleDailyReminders]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('dayflow_tasks', JSON.stringify(tasks));
      localStorage.setItem('dayflow_habits', JSON.stringify(habits));
      localStorage.setItem('dayflow_customHabits', JSON.stringify(customHabits));
    }
  }, [tasks, habits, customHabits, isLoading]);

  // Check if device is mobile
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Check if notifications are supported
  const isNotificationSupported = () => {
    return 'Notification' in window && 'serviceWorker' in navigator;
  };

  // Enhanced notification function that works on mobile and desktop
  const sendEnhancedNotification = (title: string, message: string) => {
    const mobile = isMobile();
    const supported = isNotificationSupported();

    if (mobile) {
      // Mobile-friendly notifications
      showMobileNotification(title, message);
    } else if (supported && Notification.permission === 'granted') {
      // Desktop notifications
      new Notification(title, {
        body: message,
        icon: getDayFlowIcon(),
        badge: getDayFlowIcon(),
        tag: 'dayflow-notification',
        requireInteraction: true,
        silent: false
      });
    } else {
      // Fallback for unsupported browsers
      showMobileNotification(title, message);
    }
  };

  // Mobile-friendly notification system
  const showMobileNotification = (title: string, message: string) => {
    // Create a prominent in-app notification
    toast({
      title: title,
      description: message,
      duration: 5000,
      action: (
        <Button variant="outline" size="sm" onClick={() => window.focus()}>
          Open App
        </Button>
      ),
    });

    // Add visual indicator
    addNotificationBadge();
    
    // Try to play sound (if user has allowed)
    playNotificationSound();
    
    // Try to vibrate (if supported)
    vibrateDevice();
  };

  // Add visual notification badge
  const addNotificationBadge = () => {
    // Add a small notification indicator to the page title
    const originalTitle = document.title;
    document.title = `🔔 ${originalTitle}`;
    
    // Remove badge after 5 seconds
    setTimeout(() => {
      document.title = originalTitle;
    }, 5000);
  };

  // Play notification sound
  const playNotificationSound = () => {
    try {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Sound notification not supported');
    }
  };

  // Vibrate device (if supported)
  const vibrateDevice = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const scheduleNotification = useCallback((task: Task) => {
    console.log('Scheduling notification for task:', task.title, 'Permission:', notificationPermission, 'Notifications enabled:', task.notifications, 'Task done:', task.isDone);
    
    if (notificationPermission !== 'granted' || !task.notifications || task.isDone) {
      console.log('Notification not scheduled - conditions not met');
      return;
    }
    
    const now = new Date();
    const taskDateTime = new Date(`${task.date}T${task.time}`);
    
    console.log('Task datetime:', taskDateTime, 'Current time:', now, 'Time difference (ms):', taskDateTime.getTime() - now.getTime());
    
    // Clear existing timeouts for this task
    if (timeouts.current.has(`exact-${task.id}`)) {
      clearTimeout(timeouts.current.get(`exact-${task.id}`));
      timeouts.current.delete(`exact-${task.id}`);
    }
    if (timeouts.current.has(`15min-${task.id}`)) {
      clearTimeout(timeouts.current.get(`15min-${task.id}`));
      timeouts.current.delete(`15min-${task.id}`);
    }

    if (taskDateTime > now) {
      const exactTimeout = setTimeout(() => {
        console.log('Sending exact time notification for:', task.title);
        sendEnhancedNotification('Task Starting!', `Your task "${task.title}" is starting now.`);
      }, taskDateTime.getTime() - now.getTime());
      timeouts.current.set(`exact-${task.id}`, exactTimeout);
      console.log('Scheduled exact notification for:', task.title, 'in', taskDateTime.getTime() - now.getTime(), 'ms');
    }

    const fifteenMinutesBefore = new Date(taskDateTime.getTime() - 15 * 60 * 1000);
    if (fifteenMinutesBefore > now) {
      const fifteenMinTimeout = setTimeout(() => {
        console.log('Sending 15min notification for:', task.title);
        sendEnhancedNotification(
          'Upcoming Task',
          `"${task.title}" starts in 15 minutes.`
        );
      }, fifteenMinutesBefore.getTime() - now.getTime());
      timeouts.current.set(`15min-${task.id}`, fifteenMinTimeout);
      console.log('Scheduled 15min notification for:', task.title, 'in', fifteenMinutesBefore.getTime() - now.getTime(), 'ms');
    }
  }, [notificationPermission, sendEnhancedNotification]);

  useEffect(() => {
    tasks.forEach(task => scheduleNotification(task));
    return () => {
      timeouts.current.forEach((timeoutId, key) => {
        if(!key.startsWith('daily-')) {
          clearTimeout(timeoutId)
        }
      });
    };
  }, [tasks, scheduleNotification]);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      localStorage.setItem('dayflow_userName', nameInput.trim());
      setIsNameModalOpen(false);
      
      if (notificationPermission === 'granted') {
         new Notification(`Welcome to Day Flow, ${nameInput.trim()}!`, {
          body: `Let's get your day organized.`,
          icon: getDayFlowIcon(),
        });
      }
    }
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'isDone' | 'lastReset'>) => {
    if (editingTask) {
      const updatedTask = { ...editingTask, ...taskData };
      setTasks(tasks.map((t) => (t.id === editingTask.id ? updatedTask : t)));
      toast({ title: "Task updated successfully!" });
      scheduleNotification(updatedTask);
    } else {
      const newTask = {
        ...taskData,
        id: Date.now().toString(),
        isDone: false,
        lastReset: '',
        // Automatically enable notifications for new tasks if permission is granted
        notifications: notificationPermission === 'granted' ? true : taskData.notifications,
      };
      setTasks([...tasks, newTask]);
      toast({ title: "Task added successfully!" });
      scheduleNotification(newTask);
    }
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const handleHabitSubmit = (habitData: Omit<Habit, 'id' | 'completedDates'>) => {
    const newHabit = { ...habitData, id: Date.now().toString(), completedDates: [] };
    setHabits([...habits, newHabit]);
    toast({ title: "Habit added successfully!" });
    setIsHabitFormOpen(false);
  };

  const handleCustomHabitSubmit = (habitData: Omit<Habit, 'id' | 'completedDates'>) => {
    const newHabit = { ...habitData, id: Date.now().toString(), completedDates: [] };
    setCustomHabits([...customHabits, newHabit]);
    toast({ title: "Custom habit added successfully!" });
    setIsCustomHabitFormOpen(false);
  };
  
  const handleDeleteHabit = (habitId: string) => {
    setHabits(habits.filter((h) => h.id !== habitId));
    toast({ title: "Habit deleted." });
  };

  const handleDeleteCustomHabit = (habitId: string) => {
    setCustomHabits(customHabits.filter((h) => h.id !== habitId));
    toast({ title: "Custom habit deleted." });
  };

  const handleToggleHabitDone = (habitId: string, isCustom: boolean) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const habitList = isCustom ? customHabits : habits;
    const setHabitList = isCustom ? setCustomHabits : setHabits;

    setHabitList(habitList.map(habit => {
      if (habit.id === habitId) {
        const completed = habit.completedDates.includes(today);
        let newCompletedDates;
        if (completed) {
          newCompletedDates = habit.completedDates.filter(d => d !== today);
        } else {
          newCompletedDates = [...habit.completedDates, today];
        }

        if (habit.frequency === 'daily') {
          // No change to logic, just mark/unmark for today
        } else if (habit.frequency === 'weekly') {
          // No change to logic, mark/unmark for today
        }
        
        return { ...habit, completedDates: newCompletedDates };
      }
      return habit;
    }));
  };


  const handleToggleDone = (taskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const updatedTask = { ...t, isDone: !t.isDone };
        if (updatedTask.isDone) {
          if (timeouts.current.has(`exact-${t.id}`)) clearTimeout(timeouts.current.get(`exact-${t.id}`));
          if (timeouts.current.has(`15min-${t.id}`)) clearTimeout(timeouts.current.get(`15min-${t.id}`));
        } else {
          scheduleNotification(updatedTask);
        }
        return updatedTask;
      }
      return t;
    }));
  };
  
  const handleDeleteTask = (taskId: string) => {
    if (timeouts.current.has(`exact-${taskId}`)) clearTimeout(timeouts.current.get(`exact-${taskId}`));
    if (timeouts.current.has(`15min-${taskId}`)) clearTimeout(timeouts.current.get(`15min-${taskId}`));
    setTasks(tasks.filter((t) => t.id !== taskId));
    toast({ title: "Task deleted." });
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleToggleNotification = (taskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const updatedTask = { ...t, notifications: !t.notifications };
        if (!updatedTask.notifications) {
          if (timeouts.current.has(`exact-${t.id}`)) clearTimeout(timeouts.current.get(`exact-${t.id}`));
          if (timeouts.current.has(`15min-${t.id}`)) clearTimeout(timeouts.current.get(`15min-${t.id}`));
        } else {
          scheduleNotification(updatedTask);
        }
        return updatedTask;
      }
      return t;
    }));
  };

  const requestNotificationPermission = async () => {
    const mobile = isMobile();
    const supported = isNotificationSupported();

    if (mobile) {
      // Mobile devices - show mobile-friendly message
      toast({
        title: "Mobile Notifications",
        description: "On mobile devices, you'll receive in-app notifications, sound alerts, and vibration. Desktop notifications are not supported on mobile browsers.",
        duration: 6000,
      });
      setNotificationPermission('granted');
      localStorage.setItem('notificationPermission', 'granted');
    } else if (supported) {
      // Desktop devices - request browser notifications
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        localStorage.setItem('notificationPermission', permission);
        
        if (permission === 'granted') {
          toast({
            title: "Notifications Enabled",
            description: "You'll receive desktop notifications for your tasks and habits.",
            duration: 3000,
          });
        } else {
          toast({
            title: "Notifications Disabled",
            description: "You can enable notifications later in your browser settings.",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        toast({
          title: "Notification Error",
          description: "Unable to request notification permission. You'll still receive in-app notifications.",
          duration: 3000,
        });
      }
    } else {
      // Unsupported browser - fallback to in-app notifications
      toast({
        title: "Notifications Unsupported",
        description: "Your browser doesn't support notifications. You'll receive in-app alerts instead.",
        duration: 4000,
      });
      setNotificationPermission('granted');
      localStorage.setItem('notificationPermission', 'granted');
    }
  };

  const sendExactTimeNotification = (taskName: string) => {
    console.log('Sending exact time notification for:', taskName);
    sendEnhancedNotification(
      'Task Reminder',
      `It's time for: ${taskName}`
    );
  };

  const sendFifteenMinuteNotification = (taskName: string) => {
    console.log('Sending 15-minute notification for:', taskName);
    sendEnhancedNotification(
      'Task Reminder',
      `${taskName} starts in 15 minutes`
    );
  };


  const todayDate = new Date();
  
  const isTaskForToday = (task: Task) => {
    const taskDate = new Date(task.date);
    if (task.repeat === 'daily') {
      return true;
    }
    if (task.repeat === 'weekly') {
      return isThisWeek(taskDate, { weekStartsOn: 1 });
    }
    return isToday(taskDate);
  }

  const todayTasks = tasks.filter(isTaskForToday);
  const otherTasks = tasks.filter(task => !isTaskForToday(task) && isAfter(new Date(task.date), todayDate));

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const isHabitVisible = (habit: Habit) => {
    if (habit.frequency === 'daily') return true;
    if (habit.frequency === 'weekly') return true;
    return false;
  }
  const visibleHabits = habits.filter(isHabitVisible);
  const visibleCustomHabits = customHabits.filter(isHabitVisible);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
          <>
        {/* Round digital clock in top-right corner of entire page */}
        <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-gray-200">
            <div className="text-black text-xs sm:text-sm md:text-xl font-mono font-bold tracking-wider">
              {currentTime}
            </div>
          </div>
        </div>
        
        <main className="flex min-h-screen w-full flex-col items-center bg-background p-2 sm:p-4 md:p-6 lg:p-8">
          {/* Add top margin on mobile to account for widgets */}
          <div className="w-full max-w-4xl mt-16 sm:mt-20 md:mt-0">
            <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <svg width="30" height="30" viewBox="0 0 100 100" className="text-white w-8 h-8 sm:w-10 sm:h-10">
                  <rect x="10" y="10" width="80" height="80" rx="8" fill="currentColor" opacity="0.9"/>
                  <rect x="15" y="15" width="70" height="15" fill="white" opacity="0.2" rx="2"/>
                  <circle cx="25" cy="22" r="2" fill="white" opacity="0.8"/>
                  <circle cx="35" cy="22" r="2" fill="white" opacity="0.8"/>
                  <rect x="15" y="35" width="70" height="50" fill="white" opacity="0.15" rx="2"/>
                  <circle cx="50" cy="70" r="8" fill="#FF6B35"/>
                  <path d="M 50 62 L 50 58 M 58 70 L 62 70 M 42 70 L 38 70 M 50 78 L 50 82 M 58 78 L 62 78 M 42 78 L 38 78" stroke="#FF6B35" strokeWidth="1.5" fill="none"/>
                  <path d="M 40 75 Q 50 65 60 75" stroke="white" strokeWidth="2" fill="none" opacity="0.8"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary font-headline tracking-tighter">Day Flow</h1>
                {userName && (
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{currentDate}</p>
                )}
              </div>
            </div>
             {userName && (
              <div className="text-left sm:text-right">
                <p className="text-lg sm:text-xl text-foreground/80">
                  Welcome, {userName}.
                </p>
              </div>
            )}
          </header>
          
          {/* Notification Permission Card */}
          {notificationPermission === 'default' && (
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {isMobile() ? 'Mobile Notifications' : 'Enable Notifications'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {isMobile() 
                        ? 'Get in-app alerts, sound notifications, and vibration for your tasks and habits. Perfect for mobile devices!'
                        : 'Get reminders for your tasks and habits with desktop notifications.'
                      }
                    </p>
                    <Button 
                      onClick={requestNotificationPermission}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isMobile() ? 'Enable Mobile Alerts' : 'Enable Notifications'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
            


          <div className="my-6 flex justify-center">
            <Button
              onClick={() => { setEditingTask(null); setIsTaskFormOpen(true); }}
              className="h-16 w-16 rounded-full bg-primary shadow-lg transition-transform hover:scale-110 active:scale-100"
              aria-label="Add new task"
            >
              <Plus className="h-8 w-8" />
            </Button>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 font-headline">Today's Tasks</h2>
              {todayTasks.length > 0 ? (
                <div className="grid gap-4">
                  {todayTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleDone={handleToggleDone}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                      onToggleNotification={handleToggleNotification}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No tasks for today. Add one!</p>
              )}
            </section>
            
            {otherTasks.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-4 font-headline">Upcoming</h2>
                <div className="grid gap-4">
                  {otherTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleDone={handleToggleDone}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                      onToggleNotification={handleToggleNotification}
                    />
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-primary font-headline">Habit Tracker</h2>
                <Button variant="outline" onClick={() => setIsHabitFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Habit
                </Button>
              </div>
              <Card>
                <CardContent className="p-4">
                  {visibleHabits.length > 0 ? (
                    <div className="grid gap-4">
                      {visibleHabits.map((habit) => (
                        <HabitCard
                          key={habit.id}
                          habit={habit}
                          onDelete={handleDeleteHabit}
                          onToggleDone={(id) => handleToggleHabitDone(id, false)}
                          isDone={habit.completedDates.includes(todayStr)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No habits yet. Add one to get started!</p>
                  )}
                </CardContent>
              </Card>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-primary font-headline">Customize Habit</h2>
                <Button variant="outline" onClick={() => setIsCustomHabitFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Custom Habit
                </Button>
              </div>
              <Card>
                <CardContent className="p-4">
                  {visibleCustomHabits.length > 0 ? (
                    <div className="grid gap-4">
                      {visibleCustomHabits.map((habit) => (
                        <HabitCard
                          key={habit.id}
                          habit={habit}
                          onDelete={handleDeleteCustomHabit}
                          onToggleDone={(id) => handleToggleHabitDone(id, true)}
                          isDone={habit.completedDates.includes(todayStr)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No custom habits yet. Add one to get started!</p>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>

      <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <TaskForm
            onSubmit={handleTaskSubmit}
            onCancel={() => { setIsTaskFormOpen(false); setEditingTask(null); }}
            initialData={editingTask}
            pastTasks={tasks}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isHabitFormOpen} onOpenChange={setIsHabitFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <HabitForm
            onSubmit={handleHabitSubmit}
            onCancel={() => setIsHabitFormOpen(false)}
            existingHabits={habits}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isCustomHabitFormOpen} onOpenChange={setIsCustomHabitFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <CustomHabitForm
            onSubmit={handleCustomHabitSubmit}
            onCancel={() => setIsCustomHabitFormOpen(false)}
            existingHabits={customHabits}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isNameModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Welcome to Day Flow!</AlertDialogTitle>
            <AlertDialogDescription>
              What should we call you?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter your name"
            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
          />
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSaveName}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AI Assistant */}
      <AIAssistant />
    </>
  );
}
