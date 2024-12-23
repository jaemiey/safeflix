import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function TimeControls() {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState(() => {
    return JSON.parse(localStorage.getItem("kidsProfiles") || "[]");
  });

  const handleUpdateTimeLimit = (profileId: string, newLimit: number, isTemporary: boolean = false) => {
    const updatedProfiles = profiles.map(profile => {
      if (profile.id === profileId) {
        return {
          ...profile,
          timeLimit: newLimit,
          temporaryTimeLimit: isTemporary ? newLimit : profile.temporaryTimeLimit,
          temporaryTimeLimitDate: isTemporary ? new Date().toISOString().split('T')[0] : profile.temporaryTimeLimitDate
        };
      }
      return profile;
    });

    setProfiles(updatedProfiles);
    localStorage.setItem("kidsProfiles", JSON.stringify(updatedProfiles));
    
    toast({
      title: "Time Limit Updated",
      description: isTemporary ? "Temporary time limit set for today" : "Default time limit has been saved",
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {profiles.map((profile) => (
        <Card key={profile.id}>
          <CardHeader>
            <CardTitle>{profile.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Daily Limit</label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  defaultValue={profile.timeLimit}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      handleUpdateTimeLimit(profile.id, value);
                    }
                  }}
                />
                <span>minutes</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Today's Override</label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  placeholder="Temporary limit"
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      handleUpdateTimeLimit(profile.id, value, true);
                    }
                  }}
                />
                <span>minutes</span>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Current limit: {profile.temporaryTimeLimitDate === new Date().toISOString().split('T')[0] 
                ? `${profile.temporaryTimeLimit} minutes (temporary)` 
                : `${profile.timeLimit} minutes`}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}