"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Position {
  x: number;
  y: number;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 20, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. I can help you with DayFlow features, productivity tips, and answer questions about the development team. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      const rect = chatBoxRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && chatBoxRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Responsive dimensions
      const isMobile = window.innerWidth < 640;
      const chatWidth = isMobile ? 280 : 320;
      const chatHeight = isMobile ? 400 : 450;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - chatWidth;
      const maxY = window.innerHeight - chatHeight;
      const minY = isMobile ? 10 : 20; // minimum Y position to ensure input is visible
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(minY, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue.toLowerCase());
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    // SoftwareHub related responses
    if (userInput.includes('softwarehub') || userInput.includes('software hub') || userInput.includes('who developed') || userInput.includes('who made') || userInput.includes('developer')) {
      return "This website was developed by SoftwareHub, a leading software development company specializing in modern web applications and productivity tools. SoftwareHub is known for creating innovative solutions that enhance user productivity and experience. The DayFlow app was built using Next.js, React, and modern web technologies to provide a seamless task management experience.";
    }

    // DayFlow app information and features
    if (userInput.includes('app') || userInput.includes('dayflow') || userInput.includes('day flow') || userInput.includes('what is') || userInput.includes('about the app')) {
      return "DayFlow is a comprehensive productivity and task management application designed to help users organize their daily activities effectively. Here's what DayFlow offers:\n\n📱 **Core Features:**\n• **Task Management**: Create, edit, and organize daily tasks with priority levels\n• **Habit Tracking**: Build and monitor daily habits with progress tracking\n• **Smart Notifications**: Get reminders for tasks and habits (15 min before & exact time)\n• **Real-time Clock**: Live digital clock display\n• **Weather Integration**: Current weather and location data\n• **AI Assistant**: Built-in chat support (that's me!)\n• **Mobile Responsive**: Works perfectly on all devices\n\n🎯 **Key Functionality:**\n• **Task Organization**: Categorize tasks by priority and completion status\n• **Habit Building**: Track daily habits with completion dates\n• **Custom Habits**: Create personalized habit tracking\n• **Progress Monitoring**: Visual progress indicators\n• **Data Persistence**: All data saved locally\n• **User Personalization**: Custom username and preferences\n\n💡 **How to Use:**\n1. Enter your name when prompted\n2. Add tasks using the '+' button\n3. Create habits from the habit section\n4. Enable notifications for reminders\n5. Use the AI assistant for help (click the blue button)\n\n🛠 **Technical Features:**\n• Built with Next.js 15 and React 18\n• TypeScript for type safety\n• Tailwind CSS for responsive design\n• Local storage for data persistence\n• OpenWeatherMap API integration\n• Browser notifications support";
    }

    // DayFlow features
    if (userInput.includes('feature') || userInput.includes('what can') || userInput.includes('help') || userInput.includes('functionality')) {
      return "DayFlow offers several powerful features:\n\n📋 **Task Management:**\n• Create and edit tasks with descriptions\n• Set task priorities (High, Medium, Low)\n• Mark tasks as completed\n• Delete tasks when no longer needed\n• Task notifications (15 min before & exact time)\n• Task history and progress tracking\n\n📈 **Habit Tracking:**\n• Pre-built habits (Exercise, Read, Meditate, etc.)\n• Custom habit creation\n• Daily habit completion tracking\n• Visual progress indicators\n• Habit frequency options (Daily, Weekly)\n• Habit completion history\n\n⏰ **Time & Weather:**\n• Real-time digital clock display\n• Current weather information\n• Location-based weather data\n• City name display\n• Weather icons and descriptions\n• Temperature in Celsius\n\n🔔 **Notifications:**\n• Browser push notifications\n• Task reminder notifications\n• Habit reminder notifications\n• Custom notification timing\n• Notification permission management\n• DayFlow branded notification icons\n\n🤖 **AI Assistant:**\n• Built-in chat interface\n• Product information and help\n• Productivity tips and advice\n• Technical support\n• SoftwareHub information\n• Real-time responses\n\n📱 **Mobile Features:**\n• Fully responsive design\n• Touch-friendly interface\n• Mobile-optimized widgets\n• Responsive typography\n• Mobile-friendly AI chat\n• Optimized for all screen sizes\n\n🎨 **User Experience:**\n• Clean, modern interface\n• Intuitive navigation\n• Custom DayFlow branding\n• Smooth animations\n• Fast loading times\n• Offline functionality";
    }

    // Productivity tips
    if (userInput.includes('productivity') || userInput.includes('tip') || userInput.includes('improve') || userInput.includes('efficient')) {
      return "Here are some productivity tips to maximize your DayFlow experience:\n\n🎯 **Task Management Tips:**\n• Start with 3 main tasks each day\n• Use the Pomodoro Technique (25-minute focused work sessions)\n• Break large tasks into smaller, manageable pieces\n• Review and plan your day the night before\n• Take regular breaks to maintain focus\n• Use DayFlow's habit tracking to build consistent routines\n• Celebrate small wins to stay motivated\n\n📈 **Habit Building Strategies:**\n• Start with one new habit at a time\n• Use DayFlow's pre-built habits as templates\n• Track your progress daily\n• Set realistic goals\n• Create custom habits for your specific needs\n• Use the completion tracking to stay accountable\n• Review your habit history weekly\n\n⏰ **Time Management:**\n• Use the real-time clock to stay aware of time\n• Set specific times for important tasks\n• Use notifications to stay on track\n• Plan your day around your energy levels\n• Take advantage of the weather widget for planning outdoor activities\n• Use the city widget to stay connected to your location\n\n🤖 **AI Assistant Usage:**\n• Ask for help when you're stuck\n• Get productivity advice anytime\n• Learn about new features\n• Get technical support\n• Ask about SoftwareHub and the development team\n• Use the chat for quick questions\n\n💡 **General Productivity:**\n• Keep your task list manageable\n• Use the priority system effectively\n• Enable notifications for important reminders\n• Review your progress regularly\n• Use the mobile app for on-the-go productivity\n• Customize the interface to your preferences";
    }

    // Technical questions
    if (userInput.includes('technology') || userInput.includes('tech') || userInput.includes('built with') || userInput.includes('framework') || userInput.includes('technical')) {
      return "DayFlow is built with modern web technologies:\n\n🛠 **Frontend Technologies:**\n• **Next.js 15**: React framework for production\n• **React 18**: Modern UI library with hooks\n• **TypeScript**: Type-safe JavaScript development\n• **Tailwind CSS**: Utility-first CSS framework\n• **Radix UI**: Accessible component library\n• **Lucide React**: Beautiful icon library\n\n📱 **Mobile & Responsive:**\n• **Mobile-First Design**: Optimized for mobile devices\n• **Responsive Breakpoints**: sm:, md:, lg: classes\n• **Touch-Friendly Interface**: 44px minimum touch targets\n• **Viewport Optimization**: Proper mobile scaling\n• **Progressive Web App**: Fast loading and offline support\n\n🔧 **State Management:**\n• **React Hooks**: useState, useEffect, useCallback\n• **Local Storage**: Data persistence across sessions\n• **Context API**: Global state management\n• **Custom Hooks**: Reusable logic\n\n🌐 **APIs & Services:**\n• **OpenWeatherMap API**: Real-time weather data\n• **Geolocation API**: User location detection\n• **Browser Notifications**: Push notification system\n• **Local Storage API**: Data persistence\n\n🎨 **UI/UX Features:**\n• **Custom Components**: TaskCard, HabitCard, AIAssistant\n• **Responsive Design**: Works on all screen sizes\n• **Dark/Light Mode**: Theme support\n• **Accessibility**: ARIA labels and keyboard navigation\n• **Animations**: Smooth transitions and effects\n\n📊 **Performance:**\n• **Next.js Optimization**: Automatic code splitting\n• **Image Optimization**: Optimized assets\n• **Bundle Analysis**: Minimal JavaScript bundle\n• **Fast Refresh**: Hot reloading for development\n• **SEO Optimization**: Meta tags and structured data\n\n🔒 **Security & Privacy:**\n• **Client-Side Storage**: All data stays on your device\n• **No External Dependencies**: Minimal third-party code\n• **HTTPS Only**: Secure connections\n• **Privacy-First**: No data collection or tracking";
    }

    // How to use DayFlow
    if (userInput.includes('how to') || userInput.includes('use') || userInput.includes('guide') || userInput.includes('tutorial')) {
      return "Here's a complete guide on how to use DayFlow:\n\n🚀 **Getting Started:**\n1. **First Visit**: Enter your name when prompted\n2. **Enable Notifications**: Click the notification card to allow reminders\n3. **Explore Features**: Familiarize yourself with the interface\n\n📋 **Adding Tasks:**\n1. Click the '+' button next to 'Add Task'\n2. Enter task title and description\n3. Set priority (High, Medium, Low)\n4. Choose notification timing\n5. Click 'Add Task' to save\n\n📈 **Creating Habits:**\n1. Go to the 'Build Habits' section\n2. Click 'Add Habit' for pre-built habits\n3. Or click 'Add Custom Habit' for personalized ones\n4. Set habit frequency (Daily/Weekly)\n5. Track completion by clicking the habit card\n\n⏰ **Using the Clock & Weather:**\n• **Clock**: Real-time display in top-right corner\n• **Weather**: Current temperature and conditions\n• **City**: Your current location name\n• All widgets are responsive and mobile-friendly\n\n🔔 **Managing Notifications:**\n1. Click the notification permission card\n2. Allow notifications in your browser\n3. Receive reminders for tasks and habits\n4. Notifications appear 15 minutes before and at exact time\n\n🤖 **Using the AI Assistant:**\n1. Click the blue circular button (bottom-right)\n2. Type your question or request\n3. Get instant help and information\n4. Ask about features, productivity, or technical details\n\n📱 **Mobile Usage:**\n• **Touch Navigation**: All buttons are touch-friendly\n• **Responsive Layout**: Adapts to your screen size\n• **Widget Positioning**: Optimized for mobile screens\n• **AI Chat**: Full-screen dialog on mobile\n\n💡 **Pro Tips:**\n• **Task Priority**: Use High priority for important tasks\n• **Habit Tracking**: Click habits daily to build consistency\n• **Notifications**: Enable for important reminders\n• **AI Help**: Use the assistant whenever you need help\n• **Mobile First**: Works great on phones and tablets\n• **Data Persistence**: Your data is saved automatically";
    }

    // General assistance
    if (userInput.includes('hello') || userInput.includes('hi') || userInput.includes('help')) {
      return "Hello! I'm your DayFlow AI assistant. I can help you with:\n\n📚 **App Information:**\n• DayFlow features and functionality\n• How to use the app effectively\n• Technical details and capabilities\n• SoftwareHub development team info\n\n💡 **Productivity Support:**\n• Productivity tips and strategies\n• Task management advice\n• Habit building techniques\n• Time management guidance\n\n🛠 **Technical Help:**\n• App troubleshooting\n• Feature explanations\n• Technology stack details\n• Mobile optimization info\n\n🎯 **Quick Actions:**\n• Ask 'What is DayFlow?' for app overview\n• Ask 'How to use DayFlow?' for usage guide\n• Ask 'Productivity tips' for advice\n• Ask 'Who developed this?' for team info\n\nI'm here to help you get the most out of DayFlow! What would you like to know?";
    }

    // Default response
    return "I'm here to help you with DayFlow! You can ask me about:\n\n📱 **App Features:**\n• 'What is DayFlow?' - Complete app overview\n• 'How to use DayFlow?' - Step-by-step guide\n• 'DayFlow features' - All available features\n• 'Technical details' - Technology information\n\n💡 **Productivity Help:**\n• 'Productivity tips' - Advice and strategies\n• 'How to be more efficient' - Time management\n• 'Task management' - Organization tips\n• 'Habit building' - Consistency strategies\n\n🤖 **Support & Info:**\n• 'Who developed this?' - SoftwareHub information\n• 'Help' - General assistance\n• 'Technical support' - App troubleshooting\n• 'Mobile features' - Mobile optimization\n\nWhat would you like to know about DayFlow?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFloatingButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
    
    // Responsive positioning
    const isMobile = window.innerWidth < 640;
    const chatWidth = isMobile ? 280 : 320;
    const chatHeight = isMobile ? 400 : 450;
    const minY = isMobile ? 10 : 20;
    
    // Position the chat box higher on screen to ensure input is visible
    setPosition({
      x: Math.min(e.clientX - (chatWidth / 2), window.innerWidth - chatWidth),
      y: Math.max(minY, Math.min(e.clientY - (chatHeight + 50), window.innerHeight - chatHeight)),
    });
  };

  return (
    <>
      {/* Floating AI Button */}
      <Button
        onClick={handleFloatingButtonClick}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
        aria-label="Open AI Assistant"
      >
        <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      {/* Small Chat Box */}
      {isOpen && (
        <div
          ref={chatBoxRef}
          className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: window.innerWidth < 640 ? '280px' : '320px',
            height: window.innerWidth < 640 ? '400px' : '450px',
            cursor: isDragging ? 'grabbing' : 'default',
          }}
        >
          {/* Header - Draggable */}
          <div
            className={`flex items-center justify-between p-2 sm:p-3 bg-blue-600 text-white rounded-t-lg cursor-grab active:cursor-grabbing`}
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium">AI Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-white hover:bg-blue-700"
              >
                <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex flex-col h-full">
            {/* Messages */}
            <ScrollArea className="flex-1 p-2 sm:p-3 pb-0">
              <div className="space-y-1 sm:space-y-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-1.5 sm:p-2 rounded-lg text-xs ${
                        message.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 p-1.5 sm:p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                        <span className="text-xs">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input - Fixed at bottom */}
            <div className="p-2 sm:p-3 border-t border-gray-200 bg-white">
              <div className="flex gap-1 sm:gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 text-xs h-7 sm:h-8"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="sm"
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 