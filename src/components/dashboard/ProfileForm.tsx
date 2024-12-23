import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Check, ChevronsUpDown, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ProfileForm() {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState(() => {
    return JSON.parse(localStorage.getItem("kidsProfiles") || "[]");
  });
  const [newProfile, setNewProfile] = useState({ name: "", age: "" });
  const [editingProfile, setEditingProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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

  const handleEditProfile = () => {
    if (!editingProfile.name || !editingProfile.age) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const updatedProfiles = profiles.map(profile =>
      profile.id === editingProfile.id ? editingProfile : profile
    );

    setProfiles(updatedProfiles);
    localStorage.setItem("kidsProfiles", JSON.stringify(updatedProfiles));
    setEditDialogOpen(false);
    setEditingProfile(null);

    toast({
      title: "Success",
      description: `Profile updated for ${editingProfile.name}`,
    });
  };

  const getVideoCount = (profile) => {
    const videos = JSON.parse(localStorage.getItem("videos") || "[]");
    const profileVideos = videos.filter(video => 
      profile.categories.some(catId => video.categoryId === catId)
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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedCategories.length > 0
                  ? `${selectedCategories.length} categories selected`
                  : "Select categories..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search categories..." />
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <CommandItem
                        key={category.id}
                        onSelect={() => {
                          setSelectedCategories((prev) => {
                            if (prev.includes(category.id)) {
                              return prev.filter(id => id !== category.id);
                            }
                            return [...prev, category.id];
                          });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCategories.includes(category.id) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {category.name}
                      </CommandItem>
                    ))
                  ) : (
                    <CommandItem disabled>No categories available</CommandItem>
                  )}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <Button onClick={handleCreateProfile} className="w-full">
            Create Profile
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <Card key={profile.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {profile.name}
                <Dialog open={editDialogOpen && editingProfile?.id === profile.id} onOpenChange={(open) => {
                  if (open) {
                    setEditingProfile({...profile});
                  }
                  setEditDialogOpen(open);
                }}>
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {editingProfile?.categories?.length > 0
                              ? `${editingProfile.categories.length} categories selected`
                              : "Select categories..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search categories..." />
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {categories && categories.length > 0 ? (
                                categories.map((category) => (
                                  <CommandItem
                                    key={category.id}
                                    onSelect={() => {
                                      setEditingProfile(prev => ({
                                        ...prev,
                                        categories: prev.categories.includes(category.id)
                                          ? prev.categories.filter(id => id !== category.id)
                                          : [...prev.categories, category.id]
                                      }));
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        editingProfile?.categories?.includes(category.id) ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {category.name}
                                  </CommandItem>
                                ))
                              ) : (
                                <CommandItem disabled>No categories available</CommandItem>
                              )}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
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