import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function VideoManager() {
  const { toast } = useToast();
  const [videos, setVideos] = useState(() => {
    return JSON.parse(localStorage.getItem("videos") || "[]");
  });
  const categories = JSON.parse(localStorage.getItem("videoCategories") || "[]");
  const [newVideo, setNewVideo] = useState({ title: "", url: "", categoryId: "" });

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.url || !newVideo.categoryId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const videoId = getYouTubeVideoId(newVideo.url);
    if (!videoId) {
      toast({
        title: "Error",
        description: "Invalid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    const video = {
      id: Date.now().toString(),
      ...newVideo,
      videoId,
    };

    // Update both videos array and category's videos array
    const updatedVideos = [...videos, video];
    setVideos(updatedVideos);
    localStorage.setItem("videos", JSON.stringify(updatedVideos));

    // Update the category's videos array
    const updatedCategories = categories.map(category => {
      if (category.id === video.categoryId) {
        return {
          ...category,
          videos: [...category.videos, video.id]
        };
      }
      return category;
    });
    localStorage.setItem("videoCategories", JSON.stringify(updatedCategories));

    setNewVideo({ title: "", url: "", categoryId: "" });
    toast({
      title: "Success",
      description: `Video "${video.title}" has been added`,
    });
  };

  const handleCopyProfileLink = (profileId: string) => {
    const link = `${window.location.origin}/kids/${profileId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Profile link has been copied to clipboard",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add YouTube Video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Video title"
            value={newVideo.title}
            onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
          />
          <Input
            placeholder="YouTube URL"
            value={newVideo.url}
            onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
          />
          <Select
            value={newVideo.categoryId}
            onValueChange={(value) => setNewVideo({ ...newVideo, categoryId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddVideo} className="w-full">
            Add Video
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.id}>
            <CardHeader>
              <CardTitle>{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video mb-4">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p>Category: {categories.find(c => c.id === video.categoryId)?.name}</p>
              <Button 
                variant="destructive"
                className="mt-4"
                onClick={() => {
                  const updatedVideos = videos.filter(v => v.id !== video.id);
                  setVideos(updatedVideos);
                  localStorage.setItem("videos", JSON.stringify(updatedVideos));
                  toast({
                    title: "Video Deleted",
                    description: `${video.title} has been removed`,
                  });
                }}
              >
                Delete Video
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}