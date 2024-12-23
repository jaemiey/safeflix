import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { VideoManager } from "@/components/dashboard/VideoManager";
import { CategoryManager } from "@/components/dashboard/CategoryManager";
import { TimeControls } from "@/components/dashboard/TimeControls";

export default function ParentDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profiles");

  return (
    <div className="min-h-screen bg-safeflix-dark text-white p-8">
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-safeflix-primary">SafeFlix Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={() => {
            localStorage.removeItem("isParentLoggedIn");
            window.location.href = "/";
          }}
        >
          Logout
        </Button>
      </nav>

      <Tabs defaultValue="profiles" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 gap-4 bg-safeflix-dark">
          <TabsTrigger value="profiles" className="data-[state=active]:bg-safeflix-primary">
            Kids Profiles
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-safeflix-primary">
            Categories
          </TabsTrigger>
          <TabsTrigger value="videos" className="data-[state=active]:bg-safeflix-primary">
            Videos
          </TabsTrigger>
          <TabsTrigger value="time" className="data-[state=active]:bg-safeflix-primary">
            Time Controls
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="mt-6">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>

        <TabsContent value="videos">
          <VideoManager />
        </TabsContent>

        <TabsContent value="time">
          <TimeControls />
        </TabsContent>
      </Tabs>
    </div>
  );
}