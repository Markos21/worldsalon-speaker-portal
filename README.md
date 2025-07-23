# World Salon Speaker Portal

A comprehensive speaker management platform built for World Salon's event ecosystem. This prototype demonstrates modern React architecture and professional UI/UX design for enterprise-grade applications.

## 🎯 Project Overview

The Speaker Portal is designed to streamline speaker management for World Salon's global event platform, enabling speakers to manage profiles, create events, track RSVPs, and communicate with attendees and organizers.

## ✨ Implemented Features

### 1. **Authentication System**

- Professional login/signup flow with elegant UI
- Form validation and user experience optimization
- Secure authentication patterns ready for backend integration

### 2. **Speaker Profile Management**

- Comprehensive profile creation and editing
- Professional information management (bio, contact, expertise)
- Social media integration
- Skills and expertise tagging system
- Profile picture management interface

### 3. **Event Creation & Management**

- Full-featured event creation with rich form inputs
- Event status tracking (draft, published, completed, cancelled)
- RSVP management and attendee tracking
- Support for virtual, in-person, and hybrid events
- Zoom integration interface for virtual events

### 4. **Dashboard Overview**

- Real-time statistics and metrics
- Upcoming events display
- Recent activity feed
- Professional data visualization
- Quick action buttons and navigation

## 🏗️ Architecture Design

### Frontend Architecture

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── Layout.tsx       # Main application layout
│   ├── Dashboard.tsx    # Analytics dashboard
│   ├── SpeakerProfile.tsx # Profile management
│   ├── EventManagement.tsx # Event CRUD operations
│   └── AuthenticationFlow.tsx # Login/signup
├── pages/               # Route-level components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── assets/              # Static assets
```

### Full-Stack Architecture (Proposed)

#### Frontend (Current Implementation)

- **React 18** with TypeScript for type safety
- **Tailwind CSS** with custom design system
- **shadcn/ui** for consistent component library
- **React Query** for server state management
- **React Router** for client-side routing

#### Backend (Recommended Implementation)

```
Backend Services/
├── API Gateway (Express.js/Node.js)
│   ├── SSO Authentication middleware (Google, Microsoft, SAML)
│   ├── Rate limiting & throttling
│   └── Request validation & routing
├── Core Microservices
│   ├── Auth Service (JWT + SSO providers)
│   ├── User Service (Profile & status management)
│   ├── Event Service (Multi-platform integration)
│   ├── Chat Microservice (MongoDB + Socket.io)
│   ├── Notification Service (Multi-channel)
│   └── Analytics Service (Metrics, reporting)
└── Database Layer
    ├── PostgreSQL (Users, events, status tracking)
    ├── MongoDB (Chat messages, real-time data)
    ├── Redis (Sessions, caching, pub/sub)
    └── S3 (File storage, media assets)
```

#### Integration Points

- **Multi-Platform Meeting APIs**: Zoom, Google Meet, Microsoft Teams integration
- **SSO Providers**: Google OAuth, Microsoft Azure AD, SAML 2.0
- **Notification Channels**: SendGrid/AWS SES, SMS, push notifications
- **Real-time Communication**: WebSocket/Socket.io for chat and live updates
- **Monitoring & Analytics**: AWS CloudWatch, custom metrics tracking

## 🔧 Technology Stack

### Current Implementation

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Build Tool**: Vite
- **State Management**: React hooks + Context (expandable to Zustand/Redux)
- **Routing**: React Router v6
- **UI Components**: Custom design system with semantic tokens

### Recommended Full-Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Primary Database**: PostgreSQL with Prisma ORM + status tracking
- **Chat Database**: MongoDB for scalable messaging
- **Authentication**: JWT + SSO (Google, Microsoft, SAML)
- **File Storage**: AWS S3
- **Real-time**: Socket.io with Redis pub/sub
- **Deployment**: AWS microservices architecture

## ☁️ AWS Deployment Strategy

### Infrastructure Components

#### 1. **Frontend Deployment**

- **AWS S3** + **CloudFront**: Static website hosting with global CDN
- **Route 53**: DNS management and custom domain setup
- **AWS Certificate Manager**: SSL/TLS certificates

#### 2. **Backend Services**

- **AWS ECS Fargate**: Containerized microservices deployment
- **Application Load Balancer**: Traffic distribution and SSL termination
- **Auto Scaling Groups**: Automatic scaling based on demand
- **AWS API Gateway**: RESTful API management and throttling

#### 3. **Database & Storage**

- **Amazon RDS (PostgreSQL)**: Primary database with Multi-AZ deployment
- **Amazon ElastiCache (Redis)**: Session storage and caching
- **Amazon S3**: File storage for profile pictures and documents
- **AWS Secrets Manager**: Secure storage for API keys and secrets

#### 4. **Monitoring & Security**

- **AWS CloudWatch**: Application monitoring and alerting
- **AWS WAF**: Web application firewall
- **AWS IAM**: Identity and access management
- **VPC**: Network isolation and security groups

### Deployment Pipeline

```yaml
CI/CD Pipeline:
1. Code Push → GitHub
2. GitHub Actions trigger build
3. Run tests and linting
4. Build Docker containers
5. Push to AWS ECR
6. Deploy to ECS Fargate
7. Update CloudFront distribution
8. Run smoke tests
9. Send deployment notifications
```

## 🔗 Multi-Platform Integration Strategy

### Meeting Platform Integrations

```typescript
// Meeting Service - Multi-platform abstraction
interface MeetingProvider {
  createMeeting(eventData: EventInput): Promise<MeetingData>;
  updateMeeting(meetingId: string, updates: Partial<EventInput>): Promise<void>;
  deleteMeeting(meetingId: string): Promise<void>;
}

class ZoomIntegration implements MeetingProvider {
  // Zoom-specific implementation
}

class GoogleMeetIntegration implements MeetingProvider {
  async createMeeting(eventData: EventInput): Promise<MeetingData> {
    const event = await googleCalendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: eventData.title,
        start: { dateTime: eventData.dateTime },
        end: { dateTime: eventData.endDateTime },
        conferenceData: {
          createRequest: {
            requestId: generateRequestId(),
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });
    return extractMeetingData(event);
  }
}

class MicrosoftTeamsIntegration implements MeetingProvider {
  // Teams-specific implementation using Graph API
}

class MeetingService {
  private providers = new Map<string, MeetingProvider>();

  constructor() {
    this.providers.set("zoom", new ZoomIntegration());
    this.providers.set("google-meet", new GoogleMeetIntegration());
    this.providers.set("teams", new MicrosoftTeamsIntegration());
  }

  async createMeeting(platform: string, eventData: EventInput) {
    const provider = this.providers.get(platform);
    if (!provider) throw new Error(`Unsupported platform: ${platform}`);
    return provider.createMeeting(eventData);
  }
}
```

### Platform Capabilities

- **Zoom**: Full API integration, webinars, recording management
- **Google Meet**: Calendar integration, Meet links, attendance tracking
- **Microsoft Teams**: Enterprise features, organization integration
- **Future**: WebRTC custom solution, other platforms

## 🔐 SSO Authentication Architecture

### Multi-Provider SSO Strategy

```typescript
// Auth Service - SSO Provider abstraction
interface SSOProvider {
  authenticate(token: string): Promise<UserProfile>;
  getUserInfo(accessToken: string): Promise<UserData>;
  refreshToken(refreshToken: string): Promise<TokenResponse>;
}

class GoogleSSOProvider implements SSOProvider {
  async authenticate(googleToken: string): Promise<UserProfile> {
    const userInfo = await google.auth.getUser(googleToken);
    return {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      provider: "google",
    };
  }
}

class MicrosoftSSOProvider implements SSOProvider {
  // Microsoft Azure AD integration
}

class SAMLProvider implements SSOProvider {
  // SAML 2.0 enterprise SSO
}

// Auth middleware with provider routing
app.use("/auth/:provider", (req, res, next) => {
  const provider = ssoProviders.get(req.params.provider);
  if (!provider) return res.status(400).json({ error: "Invalid provider" });
  // Route to appropriate SSO handler
});
```

### SSO Configuration

- **Google OAuth 2.0**: Consumer and enterprise Google Workspace
- **Microsoft Azure AD**: Enterprise single sign-on
- **SAML 2.0**: Enterprise identity providers (Okta, Auth0, etc.)
- **Traditional**: Email/password with MFA support

## 📊 Database Schema & Status Management

### PostgreSQL Schema (Core Data)

```sql
-- Users table with comprehensive status tracking
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    status user_status_enum DEFAULT 'active',
    profile_status profile_completion_enum DEFAULT 'incomplete',
    last_login_at TIMESTAMP,
    account_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Events with multi-platform support and status tracking
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    status event_status_enum DEFAULT 'draft',
    meeting_platform meeting_platform_enum,
    meeting_data JSONB, -- Platform-specific meeting info
    registration_status registration_status_enum DEFAULT 'closed',
    attendance_status attendance_status_enum DEFAULT 'pending',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- RSVP tracking with detailed status
CREATE TABLE event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id),
    user_id UUID REFERENCES users(id),
    rsvp_status rsvp_status_enum DEFAULT 'pending',
    attendance_status attendance_status_enum DEFAULT 'unknown',
    response_at TIMESTAMP,
    attended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Status enums
CREATE TYPE user_status_enum AS ENUM ('active', 'inactive', 'suspended', 'deleted');
CREATE TYPE event_status_enum AS ENUM ('draft', 'published', 'live', 'completed', 'cancelled');
CREATE TYPE rsvp_status_enum AS ENUM ('pending', 'accepted', 'declined', 'maybe');
CREATE TYPE meeting_platform_enum AS ENUM ('zoom', 'google-meet', 'teams', 'custom');
```

## 💬 Chat Microservice Architecture

### MongoDB Chat Service Design

```typescript
// Chat microservice with MongoDB
interface ChatMessage {
  _id: ObjectId;
  conversationId: string;
  senderId: string;
  senderName: string;
  message: string;
  messageType: "text" | "image" | "file" | "system";
  status: "sent" | "delivered" | "read";
  timestamp: Date;
  editedAt?: Date;
  metadata?: {
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    replyTo?: string;
  };
}

interface Conversation {
  _id: ObjectId;
  type: "direct" | "group" | "event";
  participants: Array<{
    userId: string;
    joinedAt: Date;
    lastSeen?: Date;
    status: "active" | "left";
  }>;
  eventId?: string; // For event-specific conversations
  lastMessage?: {
    content: string;
    timestamp: Date;
    senderId: string;
  };
  status: "active" | "archived" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}

// Chat service with Socket.io and Redis pub/sub
class ChatService {
  private io: SocketIOServer;
  private redisClient: Redis;
  private mongodb: MongoClient;

  async sendMessage(data: SendMessageData): Promise<ChatMessage> {
    // Save to MongoDB
    const message = await this.saveMessage(data);

    // Publish to Redis for real-time delivery
    await this.redisClient.publish(
      `conversation:${data.conversationId}`,
      JSON.stringify(message)
    );

    // Emit to Socket.io room
    this.io.to(data.conversationId).emit("new_message", message);

    return message;
  }

  async getConversationHistory(conversationId: string, page: number = 1) {
    return this.mongodb
      .collection("messages")
      .find({ conversationId })
      .sort({ timestamp: -1 })
      .skip((page - 1) * 50)
      .limit(50)
      .toArray();
  }
}
```

### Chat Service Features

- **Real-time messaging**: Socket.io with Redis pub/sub for scaling
- **Message persistence**: MongoDB for chat history and search
- **File sharing**: Integration with S3 for media/document sharing
- **Status tracking**: Message delivery and read receipts
- **Event integration**: Event-specific group conversations
- **Scalability**: Horizontal scaling with multiple chat service instances

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd worldsalon-speaker-portal

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🎨 Design System

### Color Palette

- **Primary**: Professional blue (#1e40af) - Corporate trust and reliability
- **Accent**: Warm amber (#f59e0b) - Energy and engagement
- **Background**: Light gray tones for readability
- **Status Colors**: Semantic colors for different states

### Key Design Principles

- **Professional First**: Enterprise-grade visual design
- **Accessibility**: WCAG 2.1 AA compliance ready
- **Responsive**: Mobile-first responsive design
- **Consistency**: Systematic use of design tokens
- **Performance**: Optimized for fast loading and smooth interactions

## 📋 Future Enhancements

### Phase 2 Features

- **Advanced Analytics**: Speaker performance metrics and insights
- **Calendar Integration**: Google Calendar, Outlook sync
- **Advanced Messaging**: File sharing, group conversations
- **Mobile App**: React Native companion app
- **AI Recommendations**: Speaker-event matching system

### Scalability Considerations

- **Microservices Architecture**: Service decomposition for independent scaling
- **Event-Driven Architecture**: Asynchronous processing for heavy operations
- **CDN Strategy**: Global content delivery optimization
- **Database Sharding**: Horizontal scaling for large datasets

_Built with React, TypeScript, and modern web technologies for World Salon's Speaker Portal assignment._
