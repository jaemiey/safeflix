import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CategorySelector } from "./profile/CategorySelector";
import { ProfileCard } from "./profile/ProfileCard";

export function ProfileForm() {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState(() => {
    return JSON.parse(localStorage.getItem("kidsProfiles") || "[]");
  });
  const [newProfile, setNewProfile] = useState({ name: "", age: "" });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const categories = JSON.parse(localStorage.getItem("videoCategories") || "[]");

  console.log("Categories loaded:", categories);

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
      categories: selectedCategories,
      timeLimit: 120,
      videoIds: [],
    };

    const updatedProfiles = [...profiles, profile];
    setProfiles(updatedProfiles);
    localStorage.setItem("kidsProfiles", JSON.stringify(updatedProfiles));

    setNewProfile({ name: "", age: "" });
    setSelectedCategories([]);
    toast({
      title: "Success",
      description: `Profile created for ${profile.name}`,
    });
  };

  const handleUpdateProfile = (updatedProfile) => {
    const updatedProfiles = profiles.map(profile =>
      profile.id === updatedProfile.id ? updatedProfile : profile
    );

    setProfiles(updatedProfiles);
    localStorage.setItem("kidsProfiles", JSON.stringify(updatedProfiles));
  };

  const handleDeleteProfile = (profileId) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    localStorage.setItem("kidsProfiles", JSON.stringify(updatedProfiles));
    toast({
      title: "Profile Deleted",
      description: `Profile has been removed`,
    });
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
          <CategorySelector
            selectedCategories={selectedCategories}
            onCategorySelect={(categoryId) => {
              setSelectedCategories((prev) => {
                if (prev.includes(categoryId)) {
                  return prev.filter(id => id !== categoryId);
                }
                return [...prev, categoryId];
              });
            }}
            categories={categories}
          />
          <Button onClick={handleCreateProfile} className="w-full">
            Create Profile
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            categories={categories}
            onUpdate={handleUpdateProfile}
            onDelete={handleDeleteProfile}
          />
        ))}
      </div>
    </div>
  );
}