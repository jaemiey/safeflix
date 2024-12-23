import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Pencil } from "lucide-react";
import { CategorySelector } from "./CategorySelector";
import { useState } from "react";

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    age: string;
    categories: string[];
    timeLimit: number;
  };
  categories: Array<{ id: string; name: string }>;
  onUpdate: (updatedProfile: any) => void;
  onDelete: (profileId: string) => void;
}

export function ProfileCard({ profile, categories, onUpdate, onDelete }: ProfileCardProps) {
  const { toast } = useToast();
  const [editingProfile, setEditingProfile] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const getVideoCount = (profile) => {
    const videos = JSON.parse(localStorage.getItem("videos") || "[]");
    return videos.filter(video => 
      profile.categories.some(catId => video.categoryId === catId)
    ).length;
  };

  const handleEditProfile = () => {
    if (!editingProfile?.name || !editingProfile?.age) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    onUpdate(editingProfile);
    setEditDialogOpen(false);
    setEditingProfile(null);

    toast({
      title: "Success",
      description: `Profile updated for ${editingProfile.name}`,
    });
  };

  return (
    <Card key={profile.id}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {profile.name}
          <Dialog 
            open={editDialogOpen} 
            onOpenChange={(open) => {
              if (open) {
                setEditingProfile({...profile});
              }
              setEditDialogOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Kid's name"
                    value={editingProfile?.name || ""}
                    onChange={(e) => setEditingProfile({
                      ...editingProfile,
                      name: e.target.value
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Age"
                    value={editingProfile?.age || ""}
                    onChange={(e) => setEditingProfile({
                      ...editingProfile,
                      age: e.target.value
                    })}
                  />
                </div>
                <CategorySelector
                  selectedCategories={editingProfile?.categories || []}
                  onCategorySelect={(categoryId) => {
                    setEditingProfile(prev => ({
                      ...prev,
                      categories: prev.categories.includes(categoryId)
                        ? prev.categories.filter(id => id !== categoryId)
                        : [...prev.categories, categoryId]
                    }));
                  }}
                  categories={categories}
                  open={open}
                  onOpenChange={setOpen}
                />
                <Button onClick={handleEditProfile} className="w-full">
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Age: {profile.age}</p>
        <p>Videos: {getVideoCount(profile)}</p>
        <p>Time Limit: {profile.timeLimit} minutes</p>
        <p>Categories: {profile.categories.map(catId => 
          categories.find(c => c.id === catId)?.name
        ).join(", ")}</p>
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
            onClick={() => onDelete(profile.id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}