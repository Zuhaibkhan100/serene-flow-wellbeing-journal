
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "@/components/ui/motion";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hi, I'm your Lovable wellness coach. How can I support you today?",
    sender: "assistant",
    timestamp: new Date()
  }
];

const Coach = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    
    // Simulate AI typing
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "What areas of your wellbeing would you like to focus on today?",
        "Remember that small, consistent habits can lead to significant improvements in your wellbeing.",
        "Have you tried the breathing exercises? They can help reduce stress and improve focus.",
        "Setting specific, achievable goals can help you make progress in your wellness journey.",
        "How have you been feeling lately? Tracking your mood can help identify patterns."
      ];
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container max-w-4xl mx-auto space-y-6 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-serif">Wellness Coach</h1>
        <p className="text-muted-foreground mt-2">AI wellness companion</p>
      </motion.div>
      
      <Card 
        className="h-[calc(100vh-240px)] flex flex-col relative overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
        }}
      >
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('/lovable-uploads/4770a3aa-b1f3-4aeb-9d07-83a894ba8edb.png')` }}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-300 to-green-300"
          style={{ 
            backgroundSize: '200% 200%',
            animation: 'gradientFlow 8s ease infinite'
          }}
        >
          {/* Empty div for gradient animation */}
        </motion.div>
        
        <CardHeader className="relative z-10 border-b border-white/20">
          <CardTitle className="text-xl text-primary flex items-center">
            <motion.span
              animate={{ 
                scale: [1, 1.03, 1],
                opacity: [0.9, 1, 0.9]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut" 
              }}
              className="mr-2 text-blue-500"
            >
              💬
            </motion.span>
            Chat with your wellness coach
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col overflow-hidden relative z-10 p-6">
          <div className="flex-1 overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
            {messages.map((message) => (
              <motion.div 
                key={message.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === "assistant" && (
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3,
                        ease: "easeInOut" 
                      }}
                    >
                      AI
                    </motion.div>
                  </div>
                )}
                
                <div className="max-w-[70%]">
                  <div 
                    className={`p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-primary/90 text-primary-foreground backdrop-blur-sm' 
                        : 'bg-white/60 backdrop-blur-sm border border-white/30 text-gray-700'
                    }`}
                  >
                    {message.content}
                  </div>
                  
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-xs text-gray-600">
                      {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                    </span>
                    
                    {message.sender === "assistant" && (
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/50">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/50">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {message.sender === "user" && (
                  <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center ml-3 flex-shrink-0">
                    You
                  </div>
                )}
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex mb-4 justify-start"
              >
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0">
                  AI
                </div>
                
                <div className="max-w-[70%]">
                  <div className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/30 text-gray-700">
                    <motion.div className="flex space-x-1">
                      <motion.span 
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="h-2 w-2 bg-blue-500 rounded-full"
                      ></motion.span>
                      <motion.span 
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="h-2 w-2 bg-blue-500 rounded-full"
                      ></motion.span>
                      <motion.span 
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="h-2 w-2 bg-blue-500 rounded-full"
                      ></motion.span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-2 mt-auto relative z-10"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-white/70 border-white/30 backdrop-blur-sm focus:border-blue-300 focus:ring-blue-200"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Send className="h-4 w-4" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Coach;
