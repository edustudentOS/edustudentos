import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Play,
  FileText,
  Code2,
  CheckCircle2,
  Circle,
  ChevronRight,
  ArrowLeft,
  Lock,
  Video,
} from "lucide-react";

const Learning = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["learning-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("learning_courses")
        .select("*")
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["learning-lessons", selectedCourseId],
    queryFn: async () => {
      if (!selectedCourseId) return [];
      const { data, error } = await supabase
        .from("learning_lessons")
        .select("*")
        .eq("course_id", selectedCourseId)
        .order("order_index");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCourseId,
  });

  const selectedCourse = courses?.find((c) => c.id === selectedCourseId);

  // Course list view
  if (!selectedCourseId) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Learning Hub</h1>
          <p className="text-muted-foreground mt-1">Skill → Module → Lesson. Master one thing at a time.</p>
        </motion.div>

        {coursesLoading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : courses?.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No courses available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {courses?.map((course, i) => (
              <motion.button
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * (i + 1) }}
                onClick={() => setSelectedCourseId(course.id)}
                className="w-full text-left bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover border border-border/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 group-hover:scale-105 transition-transform">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-foreground text-base truncate">{course.title}</h3>
                      {course.is_paid && (
                        <Badge className="bg-warning/10 text-warning border-0 text-[10px]">
                          <Lock className="h-2.5 w-2.5 mr-0.5" /> Premium
                        </Badge>
                      )}
                    </div>
                    {course.description && (
                      <p className="text-sm text-muted-foreground mt-0.5 truncate">{course.description}</p>
                    )}
                    <Badge variant="secondary" className="mt-2 text-xs">{course.category}</Badge>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Lesson list view
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Button variant="ghost" size="sm" onClick={() => setSelectedCourseId(null)} className="mb-3">
          <ArrowLeft className="h-4 w-4 mr-1" /> All Courses
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl p-5 shadow-card border border-border/50"
      >
        <h1 className="text-xl font-display font-bold text-foreground">{selectedCourse?.title}</h1>
        {selectedCourse?.description && (
          <p className="text-sm text-muted-foreground mt-1">{selectedCourse.description}</p>
        )}
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">0%</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>
      </motion.div>

      {lessonsLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : lessons?.length === 0 ? (
        <div className="text-center py-12">
          <Video className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No lessons added yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lessons?.map((lesson, i) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * (i + 1) }}
              className="bg-card rounded-xl p-4 shadow-card border border-border/50 hover:shadow-card-hover transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-muted-foreground text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm">{lesson.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    {lesson.video_url && (
                      <span className="text-[10px] text-info flex items-center gap-0.5">
                        <Play className="h-2.5 w-2.5" /> Video
                      </span>
                    )}
                    {lesson.notes_url && (
                      <span className="text-[10px] text-accent flex items-center gap-0.5">
                        <FileText className="h-2.5 w-2.5" /> Notes
                      </span>
                    )}
                    {lesson.assignment && (
                      <span className="text-[10px] text-warning flex items-center gap-0.5">
                        <Code2 className="h-2.5 w-2.5" /> Practice
                      </span>
                    )}
                  </div>
                </div>
                <Circle className="h-5 w-5 text-muted-foreground/30 shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Learning;
