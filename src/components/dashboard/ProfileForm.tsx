import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function ProfileForm() {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState(() => {
    return JSON.parse(localStorage.getItem("kidsProfiles") || "[]");
  });
  const [newProfile, setNewProfile] = useState({ name: "", age: "" });

  const handleCreateProfile = () => {
    if (!newProfile.name || !newProfile.age) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const profileId = Date.now().toString();
    const profile = {
      id: profileId,
      ...newProfile,
      categories: [],
      timeLimit: 120, // Default 2 hours in minutes
      videoIds: [],
    };

    const updatedProfiles = [...profiles, profile];
    setProfiles(updatedProfiles);
    localStorage.setItem("kidsProfiles", JSON.stringify(updatedProfiles));

    setNewProfile({ name: "", age: "" });
    toast({
      title: "Success",
      description: `Profile created for ${profile.name}`,
    });
  };

  // Get videos from localStorage to count them
  const getVideoCount = (profile) => {
    const videos = JSON.parse(localStorage.getItem("videos") || "[]");
    const profileVideos = videos.filter(video => 
      profile.categories.includes(video.categoryId)
    );
    return profileVideos.length;
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Kid Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Kid's name"
              value={newProfile.name}
              onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Age"
              value={newProfile.age}
              onChange={(e) => setNewProfile({ ...newProfile, age: e.target.value })}
            />
          </div>
          <Button onClick={handleCreateProfile} className="w-full">
            Create Profile
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <Card key={profile.id}>
            <CardHeader>
              <CardTitle>{profile.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Age: {profile.age}</p>
              <p>Videos: {getVideoCount(profile)}</p>
              <p>Time Limit: {profile.timeLimit} minutes</p>
              <div className="mt-4 space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/kids/${profile.id}`;
                    navigator.clipboard.writeText(shareUrl);
                    toast({
                      title: "Link Copied",
                      description: "Share this link with your kid",
                    });
                  }}
                >
                  Share Link
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    const updatedProfiles = profiles.filter(p => p.id !== profile.id);
                    setProfiles(updatedProfiles);
                    localStorage.setItem("kidsProfiles", JSON.stringify(updatedProfiles));
                    toast({
                      title: "Profile Deleted",
                      description: `${profile.name}'s profile has been removed`,
                    });
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}