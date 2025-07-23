import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { SpeakerProfile } from "@/components/SpeakerProfile";
import { EventManagement } from "@/components/EventManagement";
import { AuthenticationFlow } from "@/components/AuthenticationFlow";
import { ChatMicroservice } from "@/components/ChatMicroservice";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Show authentication flow if not authenticated
  if (!isAuthenticated) {
    return <AuthenticationFlow onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  // Render main application based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <SpeakerProfile />;
      case "events":
        return <EventManagement />;
      case "messages":
        return <ChatMicroservice />;
      case "settings":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-muted-foreground">Account settings and preferences coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
