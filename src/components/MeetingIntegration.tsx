import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Video, VideoOff, Copy, ExternalLink } from "lucide-react";

// Meeting platform interface for extensibility
export interface MeetingPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  createMeeting: (eventDetails: any) => Promise<string>;
  joinMeeting: (meetingUrl: string) => void;
}

// Define supported meeting platforms
export const MEETING_PLATFORMS = {
  ZOOM: "zoom",
  GOOGLE_MEET: "google_meet",
  MICROSOFT_TEAMS: "microsoft_teams",
};

interface MeetingIntegrationProps {
  eventId?: string;
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  existingMeetingUrl?: string;
  onMeetingCreated?: (meetingUrl: string) => void;
}

export const MeetingIntegration = ({
  eventId,
  eventTitle = "My Event",
  eventDate,
  eventTime,
  existingMeetingUrl,
  onMeetingCreated,
}: MeetingIntegrationProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(MEETING_PLATFORMS.ZOOM);
  const [meetingUrl, setMeetingUrl] = useState(existingMeetingUrl || "");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateMeeting = async () => {
    setIsCreating(true);
    
    try {
      // Simulate API call to create meeting
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock meeting URL based on selected platform
      let newMeetingUrl = "";
      
      switch (selectedPlatform) {
        case MEETING_PLATFORMS.ZOOM:
          newMeetingUrl = `https://zoom.us/j/${Math.floor(Math.random() * 900000000) + 100000000}`;
          break;
        case MEETING_PLATFORMS.GOOGLE_MEET:
          newMeetingUrl = `https://meet.google.com/${generateRandomString(10)}`;
          break;
        case MEETING_PLATFORMS.MICROSOFT_TEAMS:
          newMeetingUrl = `https://teams.microsoft.com/l/meetup-join/${generateRandomString(36)}`;
          break;
        default:
          newMeetingUrl = `https://zoom.us/j/${Math.floor(Math.random() * 900000000) + 100000000}`;
      }
      
      setMeetingUrl(newMeetingUrl);
      
      if (onMeetingCreated) {
        onMeetingCreated(newMeetingUrl);
      }
      
      toast({
        title: "Meeting created!",
        description: "The meeting link has been generated successfully.",
      });
      
      // Close dialog after creation
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Failed to create meeting",
        description: "There was an error creating the meeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyMeetingLink = () => {
    if (meetingUrl) {
      navigator.clipboard.writeText(meetingUrl);
      toast({
        title: "Link copied!",
        description: "The meeting link has been copied to your clipboard.",
      });
    }
  };

  const openMeetingLink = () => {
    if (meetingUrl) {
      window.open(meetingUrl, "_blank");
    }
  };

  // Helper function to generate random string for meeting IDs
  const generateRandomString = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return (
    <div className="space-y-4">
      {meetingUrl ? (
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Video className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-sm font-medium">Virtual Meeting</h3>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={copyMeetingLink}
                className="flex items-center"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button 
                size="sm"
                onClick={openMeetingLink}
                className="flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Join
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground break-all">{meetingUrl}</p>
        </div>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Video className="h-4 w-4 mr-2" />
              Create Virtual Meeting
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Virtual Meeting</DialogTitle>
              <DialogDescription>
                Set up a virtual meeting for your event using your preferred platform.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Meeting Platform</Label>
                <Select
                  value={selectedPlatform}
                  onValueChange={setSelectedPlatform}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MEETING_PLATFORMS.ZOOM}>Zoom</SelectItem>
                    <SelectItem value={MEETING_PLATFORMS.GOOGLE_MEET}>Google Meet</SelectItem>
                    <SelectItem value={MEETING_PLATFORMS.MICROSOFT_TEAMS}>Microsoft Teams</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title</Label>
                <Input
                  id="event-title"
                  value={eventTitle}
                  readOnly
                />
              </div>
              
              {eventDate && eventTime && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input
                      id="event-date"
                      value={eventDate}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Time</Label>
                    <Input
                      id="event-time"
                      value={eventTime}
                      readOnly
                    />
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateMeeting} 
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Meeting"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};