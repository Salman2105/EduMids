  import React from 'react'
 import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Play, FileText, Link2 } from "lucide-react";
import ReactPlayer from "react-player";

export default function StudentProgressCard() {
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  // Fetch all progress for the logged-in student
  const { data: progresses = [], isLoading } = useQuery({
    queryKey: ["/api/progress/my-progress"],
    queryFn: async () => {
      const res = await fetch("/api/progress/my-progress");
      if (!res.ok) throw new Error("Failed to fetch progress");
      return res.json();
    },
  });

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  if (!progresses.length) return <div className="p-8 text-center">No enrolled courses found.</div>;

  // Helper to sum total video time for a course
  const getTotalVideoTime = (lessons) => {
    const totalSeconds = lessons
      .filter(l => l.type === "video")
      .reduce((sum, l) => sum + (l.duration || 0), 0);
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min}m ${sec}s`;
  };

  // Helper to get icon by lesson type
  const getLessonIcon = (type) => {
    if (type === "video") return <Play className="text-blue-600" />;
    if (type === "pdf") return <FileText className="text-red-600" />;
    if (type === "url") return <Link2 className="text-green-600" />;
    return null;
  };

  // Handle lesson actions
  const handleLessonAction = (lesson) => {
    if (lesson.type === "video") {
      setCurrentVideo(lesson.url);
      setShowPlayer(true);
    } else if (lesson.type === "pdf") {
      window.open(lesson.url, "_blank");
    } else if (lesson.type === "url") {
      window.open(lesson.url, "_blank");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      {progresses.map((progress) => (
        <Card key={progress._id} className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{progress.courseId?.title}</span>
              <Badge>{progress.courseId?.category?.name}</Badge>
            </CardTitle>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-gray-600">Instructor: {progress.courseId?.instructor?.firstName} {progress.courseId?.instructor?.lastName}</span>
              <span className="text-sm text-gray-600">Total Video: {getTotalVideoTime(progress.courseId?.lessons || [])}</span>
            </div>
            <div className="mt-2">
              <Progress value={progress.progressPercentage} className="h-2" />
              <span className="text-xs text-gray-500">{progress.progressPercentage.toFixed(1)}% completed</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {(progress.courseId?.lessons || []).map((lesson, idx) => (
                <div key={lesson._id || idx} className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div>{getLessonIcon(lesson.type)}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{lesson.title}</div>
                    {lesson.type === "video" && (
                      <span className="text-xs text-gray-500">{Math.floor((lesson.duration || 0) / 60)}:{String((lesson.duration || 0) % 60).padStart(2, '0')} min</span>
                    )}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleLessonAction(lesson)}>
                    {lesson.type === "video" ? "Watch" : lesson.type === "pdf" ? "Download" : "Open"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Video Player Modal */}
      {showPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full relative">
            <button className="absolute top-2 right-2 text-gray-600" onClick={() => setShowPlayer(false)}>
              ✕
            </button>
            <ReactPlayer
              url={currentVideo}
              controls
              width="100%"
              height="360px"
            />
          </div>
        </div>
      )}
    </div>
  );
}
