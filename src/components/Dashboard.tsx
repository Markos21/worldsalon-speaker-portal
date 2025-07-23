import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  TrendingUp,
  Clock,
  MapPin,
  Plus,
  Eye
} from "lucide-react";

export const Dashboard = () => {
  const stats = [
    {
      title: "Upcoming Events",
      value: "3",
      description: "Next 30 days",
      icon: Calendar,
      trend: "+2 from last month"
    },
    {
      title: "Total Attendees",
      value: "247",
      description: "All events",
      icon: Users,
      trend: "+15% this month"
    },
    {
      title: "Messages",
      value: "12",
      description: "Unread",
      icon: MessageSquare,
      trend: "3 new today"
    },
    {
      title: "Profile Views",
      value: "89",
      description: "This month",
      icon: TrendingUp,
      trend: "+23% increase"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "AI in Healthcare: Future Perspectives",
      date: "2024-08-15",
      time: "2:00 PM",
      attendees: 45,
      status: "confirmed",
      location: "Virtual"
    },
    {
      id: 2,
      title: "Sustainable Technology Panel",
      date: "2024-08-20",
      time: "10:00 AM",
      attendees: 32,
      status: "pending",
      location: "San Francisco, CA"
    },
    {
      id: 3,
      title: "Innovation in EdTech",
      date: "2024-08-25",
      time: "3:30 PM",
      attendees: 67,
      status: "confirmed",
      location: "Virtual"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "rsvp",
      message: "Sarah Johnson accepted invitation to 'AI in Healthcare'",
      time: "2 hours ago",
      avatar: "/placeholder-avatar.jpg"
    },
    {
      id: 2,
      type: "message",
      message: "New message from event organizer",
      time: "4 hours ago",
      avatar: "/placeholder-avatar.jpg"
    },
    {
      id: 3,
      type: "event",
      message: "Event 'Sustainable Technology Panel' was updated",
      time: "1 day ago",
      avatar: "/placeholder-avatar.jpg"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, John!</h1>
          <p className="text-muted-foreground">Here's what's happening with your speaker activities</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-hover">
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <p className="text-xs text-accent font-medium mt-2">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Upcoming Events</span>
              <Button variant="ghost" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{event.title}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {event.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {event.time}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {event.location}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={event.status === 'confirmed' ? 'default' : 'secondary'}
                    className="mb-1"
                  >
                    {event.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{event.attendees} attendees</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};