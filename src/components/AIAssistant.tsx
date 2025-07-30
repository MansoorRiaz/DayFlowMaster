"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
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

    // DayFlow features
    if (userInput.includes('feature') || userInput.includes('what can') || userInput.includes('help')) {
      return "DayFlow offers several powerful features:\n\n• Task Management: Create, edit, and organize your daily tasks\n• Habit Tracking: Build and monitor daily habits\n• Smart Notifications: Get reminders for tasks and habits\n• Weather Integration: Real-time weather and location data\n• Time Tracking: Live clock and time management tools\n• Custom Habits: Create personalized habit tracking\n• Progress Monitoring: Track your daily productivity\n\nIs there a specific feature you'd like to know more about?";
    }

    // Productivity tips
    if (userInput.includes('productivity') || userInput.includes('tip') || userInput.includes('improve')) {
      return "Here are some productivity tips:\n\n• Start with 3 main tasks each day\n• Use the Pomodoro Technique (25-minute focused work sessions)\n• Break large tasks into smaller, manageable pieces\n• Review and plan your day the night before\n• Take regular breaks to maintain focus\n• Use DayFlow's habit tracking to build consistent routines\n• Celebrate small wins to stay motivated";
    }

    // Technical questions
    if (userInput.includes('technology') || userInput.includes('tech') || userInput.includes('built with') || userInput.includes('framework')) {
      return "DayFlow is built with modern web technologies:\n\n• Frontend: Next.js 15, React 18, TypeScript\n• Styling: Tailwind CSS with custom components\n• UI Library: Radix UI components\n• State Management: React hooks and local storage\n• APIs: OpenWeatherMap for weather data\n• Notifications: Browser Push API\n• Icons: Lucide React\n\nThe app is designed for performance, accessibility, and user experience.";
    }

    // General assistance
    if (userInput.includes('hello') || userInput.includes('hi')) {
      return "Hello! I'm here to help you with DayFlow and answer any questions you might have. Feel free to ask about features, productivity tips, or the development team!";
    }

    // Default response
    return "I'm here to help! You can ask me about:\n\n• DayFlow features and how to use them\n• Productivity tips and best practices\n• Information about SoftwareHub (the development team)\n• Technical details about the app\n• General assistance with task management\n\nWhat would you like to know?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
        aria-label="Open AI Assistant"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {/* AI Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              AI Assistant
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4 border rounded-lg mb-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about DayFlow, productivity, or SoftwareHub..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 