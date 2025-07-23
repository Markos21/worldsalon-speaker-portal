import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Edit, 
  Eye, 
  Video,
  Mail,
  Copy,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MeetingIntegration, MEETING_PLATFORMS } from "@/components/MeetingIntegration";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  maxAttendees: number;
  currentAttendees: number;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  type: 'virtual' | 'in-person' | 'hybrid';
  meetingUrl?: string;
  meetingPlatform?: string;
  rsvpStatus: { yes: number; no: number; maybe: number };
}

export const EventManagement = () => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "AI in Healthcare: Future Perspectives",
      description: "A comprehensive discussion on how artificial intelligence is transforming healthcare delivery, from diagnostic tools to personalized treatment plans.",
      date: "2024-08-15",
      time: "14:00",
      duration: "90 minutes",
      location: "Virtual",
      maxAttendees: 100,
      currentAttendees: 45,
      status: 'published',
      type: 'virtual',
      meetingUrl: "https://zoom.us/j/123456789",
      meetingPlatform: MEETING_PLATFORMS.ZOOM,
      rsvpStatus: { yes: 35, no: 5, maybe: 5 }
    },
    {
      id: 2,
      title: "Sustainable Technology Panel",
      description: "Exploring innovative technologies that promote environmental sustainability and green innovation in the tech industry.",
      date: "2024-08-20",
      time: "10:00",
      duration: "120 minutes",
      location: "San Francisco, CA",
      maxAttendees: 50,
      currentAttendees: 32,
      status: 'published',
      type: 'in-person',
      rsvpStatus: { yes: 28, no: 2, maybe: 2 }
    },
    {
      id: 3,
      title: "Innovation in EdTech",
      description: "Discussing the latest trends and innovations in educational technology and their impact on learning outcomes.",
      date: "2024-08-25",
      time: "15:30",
      duration: "75 minutes",
      location: "Virtual",
      maxAttendees: 75,
      currentAttendees: 67,
      status: 'published',
      type: 'virtual',
      meetingUrl: "https://zoom.us/j/987654321",
      meetingPlatform: MEETING_PLATFORMS.ZOOM,
      rsvpStatus: { yes: 55, no: 7, maybe: 5 }
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    maxAttendees: 50,
    type: 'virtual' as 'virtual' | 'in-person' | 'hybrid'
  });

  const handleCreateEvent = () => {
    const event: Event = {
      id: events.length + 1,
      ...newEvent,
      currentAttendees: 0,
      status: 'draft',
      rsvpStatus: { yes: 0, no: 0, maybe: 0 }
    };
    setEvents([...events, event]);
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "",
      location: "",
      maxAttendees: 50,
      type: 'virtual'
    });
    setIsCreateDialogOpen(false);
    toast({
      title: "Event Created",
      description: "Your event has been created successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const copyMeetingLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Meeting link has been copied to clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Event Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary-hover">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="event-title">Event Title</Label>
                <Input
                  id="event-title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Enter event title..."
                />
              </div>
              
              <div>
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Describe your event..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event-date">Date</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="event-time">Time</Label>
                  <Input
                    id="event-time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event-duration">Duration</Label>
                  <Input
                    id="event-duration"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({...newEvent, duration: e.target.value})}
                    placeholder="e.g., 90 minutes"
                  />
                </div>
                <div>
                  <Label htmlFor="event-type">Event Type</Label>
                  <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent({...newEvent, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event-location">Location</Label>
                  <Input
                    id="event-location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    placeholder={newEvent.type === 'virtual' ? 'Virtual' : 'Enter location...'}
                  />
                </div>
                <div>
                  <Label htmlFor="event-max-attendees">Max Attendees</Label>
                  <Input
                    id="event-max-attendees"
                    type="number"
                    value={newEvent.maxAttendees}
                    onChange={(e) => setNewEvent({...newEvent, maxAttendees: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              {newEvent.type === 'virtual' && (
                <div className="space-y-2">
                  <Label>Meeting Platform</Label>
                  <MeetingIntegration 
                    eventTitle={newEvent.title || "New Event"}
                    eventDate={newEvent.date}
                    eventTime={newEvent.time}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent}>
                  Create Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="shadow-card hover:shadow-elegant transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                  <Badge variant={getStatusColor(event.status)} className="mb-2">
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {event.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-3 w-3" />
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-3 w-3" />
                  {event.duration}
                </div>
                <div className="flex items-center text-muted-foreground">
                  {event.type === 'virtual' ? (
                    <Video className="mr-2 h-3 w-3" />
                  ) : (
                    <MapPin className="mr-2 h-3 w-3" />
                  )}
                  {event.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="mr-2 h-3 w-3" />
                  {event.currentAttendees}/{event.maxAttendees} attendees
                </div>
              </div>

              {/* RSVP Status */}
              <div className="space-y-2">
                <div className="text-sm font-medium">RSVP Status:</div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">✓ Yes: {event.rsvpStatus.yes}</span>
                  <span className="text-red-600">✗ No: {event.rsvpStatus.no}</span>
                  <span className="text-yellow-600">? Maybe: {event.rsvpStatus.maybe}</span>
                </div>
              </div>

              {/* Meeting Link for Virtual Events */}
              {event.type === 'virtual' && event.meetingUrl && (
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div className="flex items-center text-sm">
                    <Video className="mr-2 h-3 w-3" />
                    {event.meetingPlatform === MEETING_PLATFORMS.ZOOM 
                      ? "Zoom Meeting" 
                      : event.meetingPlatform === MEETING_PLATFORMS.GOOGLE_MEET 
                        ? "Google Meet" 
                        : event.meetingPlatform === MEETING_PLATFORMS.MICROSOFT_TEAMS 
                          ? "Microsoft Teams" 
                          : "Virtual Meeting"}
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => copyMeetingLink(event.meetingUrl!)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => window.open(event.meetingUrl, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Mail className="mr-2 h-3 w-3" />
                  Send Reminder
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Users className="mr-2 h-3 w-3" />
                  Attendees
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};