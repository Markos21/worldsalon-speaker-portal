import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Send, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Message interface for type safety
interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

// Conversation interface for type safety
interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export const ChatMicroservice = () => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock user for current user context
  const currentUser = {
    id: "user-123",
    name: "John Doe",
    avatar: "",
  };

  // Simulate fetching conversations from API
  useEffect(() => {
    // In a real application, this would be an API call to a microservice
    const mockConversations: Conversation[] = [
      {
        id: "conv-1",
        participants: [
          { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
          { id: "user-456", name: "Jane Smith", avatar: "" }
        ],
        unreadCount: 2,
      },
      {
        id: "conv-2",
        participants: [
          { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
          { id: "user-789", name: "Alex Johnson", avatar: "" }
        ],
        unreadCount: 0,
      },
      {
        id: "conv-3",
        participants: [
          { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
          { id: "user-101", name: "Sarah Williams", avatar: "" },
          { id: "user-102", name: "Mike Davis", avatar: "" }
        ],
        unreadCount: 5,
      }
    ];
    
    setConversations(mockConversations);
  }, []);

  // Simulate fetching messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      // In a real application, this would be an API call to a MongoDB-backed microservice
      const mockMessages: ChatMessage[] = [
        {
          id: "msg-1",
          conversationId: activeConversation,
          senderId: "user-456",
          senderName: "Jane Smith",
          content: "Hi there! How are you preparing for your talk next week?",
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          isRead: true
        },
        {
          id: "msg-2",
          conversationId: activeConversation,
          senderId: currentUser.id,
          senderName: currentUser.name,
          content: "I'm working on my slides right now. Almost done with the introduction section!",
          timestamp: new Date(Date.now() - 82800000), // 23 hours ago
          isRead: true
        },
        {
          id: "msg-3",
          conversationId: activeConversation,
          senderId: "user-456",
          senderName: "Jane Smith",
          content: "That's great! Would you like me to review them before the event?",
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          isRead: false
        },
        {
          id: "msg-4",
          conversationId: activeConversation,
          senderId: "user-456",
          senderName: "Jane Smith",
          content: "Also, don't forget we have a pre-event meeting on Friday.",
          timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
          isRead: false
        }
      ];
      
      setMessages(mockMessages);
      
      // Mark conversation as read
      setConversations(prev => 
        prev.map(conv => 
          conv.id === activeConversation 
            ? { ...conv, unreadCount: 0 } 
            : conv
        )
      );
    }
  }, [activeConversation]);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    // In a real application, this would send to a Socket.io server or similar
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversation,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: newMessage,
      timestamp: new Date(),
      isRead: false
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    
    // Simulate receiving a reply after a short delay
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const recipient = conversations.find(c => c.id === activeConversation)?.participants.find(p => p.id !== currentUser.id);
        
        if (recipient) {
          const replyMsg: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            conversationId: activeConversation,
            senderId: recipient.id,
            senderName: recipient.name,
            content: "Thanks for your message! I'll get back to you soon.",
            timestamp: new Date(),
            isRead: false
          };
          
          setMessages(prev => [...prev, replyMsg]);
          
          toast({
            title: "New Message",
            description: `${recipient.name} has replied to your message.`,
          });
        }
      }, 3000);
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.id !== currentUser.id) || conversation.participants[0];
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="md:col-span-1 h-full overflow-hidden flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            <div className="space-y-1 px-3">
              {conversations.map(conversation => {
                const otherParticipant = getOtherParticipant(conversation);
                return (
                  <Button
                    key={conversation.id}
                    variant={activeConversation === conversation.id ? "secondary" : "ghost"}
                    className="w-full justify-start px-2 h-auto py-3"
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="flex items-center w-full">
                      <Avatar className="h-9 w-9 mr-2">
                        <AvatarImage src={otherParticipant.avatar} />
                        <AvatarFallback>
                          {otherParticipant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">
                            {conversation.participants.length > 2
                              ? `${otherParticipant.name} + ${conversation.participants.length - 2} others`
                              : otherParticipant.name}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="ml-auto text-xs rounded-full">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        {conversation.lastMessage && (
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        {/* Chat Area */}
        <Card className="md:col-span-2 h-full flex flex-col">
          {activeConversation ? (
            <>
              <CardHeader className="pb-3 border-b">
                {activeConversation && (
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {getOtherParticipant(conversations.find(c => c.id === activeConversation)!).name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">
                      {getOtherParticipant(conversations.find(c => c.id === activeConversation)!).name}
                    </CardTitle>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="flex-1 overflow-auto py-4">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.senderId === currentUser.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              <div className="p-3 border-t">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};