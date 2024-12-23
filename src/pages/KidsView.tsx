import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function KidsView() {
  const { profileId } = useParams();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  useEffect(() => {
    const profiles = JSON.parse(localStorage.getItem("kidsProfiles") || "[]");
    const currentProfile = profiles.find((p: any) => p.id === profileId);
    
    if (currentProfile) {
      setProfile(currentProfile);
      // Check for temporary time limit
      const today = new Date().toISOString().split('T')[0];
      const timeLimit = currentProfile.temporaryTimeLimitDate === today
        ? currentProfile.temporaryTimeLimit
        : currentProfile.timeLimit;
      
      setTimeRemaining(timeLimit * 60); // Convert to seconds
      
      const allVideos = JSON.parse(localStorage.getItem("videos") || "[]");
      const allCategories = JSON.parse(localStorage.getItem("videoCategories") || "[]");
      
      setVideos(allVideos);
      setCategories(allCategories);
    } else {
      toast({
        title: "Error",
        description: "Profile not found",
        variant: "destructive",
      });
    }
  }, [profileId]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setSelectedVideo(null);
            toast({
              title: "Time's Up!",
              description: "Your viewing time has ended",
              variant: "destructive",
            });
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-safeflix-dark text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-safeflix-primary">
          Welcome, {profile?.name}!
        </h1>
        <div className="text-xl font-semibold">
          Time Remaining: {formatTime(timeRemaining)}
        </div>
      </div>

      {timeRemaining > 0 && (
        <div className="space-y-8">
          {selectedVideo && (
            <div className="w-full aspect-video mb-8 bg-black rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {categories.map((category) => {
            const categoryVideos = videos.filter(
              (video) => video.categoryId === category.id
            );

            if (categoryVideos.length === 0) return null;

            return (
              <div key={category.id}>
                <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryVideos.map((video) => (
                    <Card 
                      key={video.id}
                      className="cursor-pointer transition-transform hover:scale-105"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <CardHeader>
                        <CardTitle>{video.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video">
                          <img
                            src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {timeRemaining <= 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Time's Up!</h2>
          <p>Your viewing time has ended. Please come back later!</p>
        </div>
      )}
    </div>
  );
}