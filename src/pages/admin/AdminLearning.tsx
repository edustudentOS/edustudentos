import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  useCourses,
  useLessons,
  useCreateCourse,
  useTogglePublishCourse,
  useDeleteCourse,
  useAddLesson,
  useDeleteLesson,
} from "@/hooks/useAdminLearning";
import { GraduationCap, Plus, Eye, EyeOff, Trash2, BookOpen, Lock } from "lucide-react";

export default function AdminLearning() {
  const { toast } = useToast();
  const { data: courses, isLoading } = useCourses();
  const createCourse = useCreateCourse();
  const togglePublish = useTogglePublishCourse();
  const deleteCourse = useDeleteCourse();
  const addLesson = useAddLesson();
  const deleteLesson = useDeleteLesson();

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "programming", is_paid: false });
  const [lessonForm, setLessonForm] = useState({ title: "", video_url: "", notes_url: "", assignment: "" });

  const { data: lessons } = useLessons(selectedCourse);
  const selectedCourseData = courses?.find((c) => c.id === selectedCourse);

  const handleCreate = async () => {
    await createCourse.mutateAsync(form);
    setForm({ title: "", description: "", category: "programming", is_paid: false });
    setCreateOpen(false);
    toast({ title: "Course created" });
  };

  const handleAddLesson = async () => {
    if (!selectedCourse) return;
    await addLesson.mutateAsync({
      course_id: selectedCourse,
      ...lessonForm,
      order_index: lessons?.length ?? 0,
    });
    setLessonForm({ title: "", video_url: "", notes_url: "", assignment: "" });
    toast({ title: "Lesson added" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Learning Content</h1>
          <p className="text-muted-foreground">Manage courses, videos, and lessons</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Course</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Course</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Course title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="dsa">DSA</SelectItem>
                  <SelectItem value="web-dev">Web Development</SelectItem>
                  <SelectItem value="placement">Placement Prep</SelectItem>
                  <SelectItem value="soft-skills">Soft Skills</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-3">
                <Switch checked={form.is_paid} onCheckedChange={(v) => setForm({ ...form, is_paid: v })} />
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  {form.is_paid ? <><Lock className="h-3 w-3" />Paid Content</> : "Free Content"}
                </span>
              </div>
              <Button onClick={handleCreate} disabled={!form.title || createCourse.isPending} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><GraduationCap className="h-4 w-4" />Courses</CardTitle></CardHeader>
          <CardContent className="space-y-2 max-h-[60vh] overflow-auto">
            {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
            {courses?.map((c) => (
              <div
                key={c.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedCourse === c.id ? "border-accent bg-accent/5" : "border-border hover:bg-muted/50"}`}
                onClick={() => setSelectedCourse(c.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-foreground">{c.title}</span>
                  <div className="flex gap-1">
                    {c.is_paid && <Badge variant="outline" className="text-xs"><Lock className="h-3 w-3" /></Badge>}
                    <Badge variant={c.is_published ? "default" : "secondary"} className="text-xs">
                      {c.is_published ? "Live" : "Draft"}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{c.category}</p>
              </div>
            ))}
            {courses?.length === 0 && <p className="text-sm text-muted-foreground">No courses yet</p>}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {selectedCourseData ? (
            <>
              <Card>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-lg">{selectedCourseData.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublish.mutate({ id: selectedCourseData.id, is_published: !selectedCourseData.is_published })}
                    >
                      {selectedCourseData.is_published ? <><EyeOff className="h-4 w-4 mr-1" />Unpublish</> : <><Eye className="h-4 w-4 mr-1" />Publish</>}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => { deleteCourse.mutate(selectedCourseData.id); setSelectedCourse(null); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{selectedCourseData.description || "No description"}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4" />Lessons ({lessons?.length ?? 0})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input placeholder="Lesson title" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} />
                    <Input placeholder="Video URL" value={lessonForm.video_url} onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })} />
                    <Input placeholder="Notes URL" value={lessonForm.notes_url} onChange={(e) => setLessonForm({ ...lessonForm, notes_url: e.target.value })} />
                    <Button onClick={handleAddLesson} disabled={!lessonForm.title} size="sm" className="h-10"><Plus className="h-4 w-4 mr-1" />Add Lesson</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Video</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="w-16"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lessons?.map((l, i) => (
                        <TableRow key={l.id}>
                          <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                          <TableCell className="font-medium">{l.title}</TableCell>
                          <TableCell className="text-xs text-muted-foreground truncate max-w-[120px]">{l.video_url || "—"}</TableCell>
                          <TableCell className="text-xs text-muted-foreground truncate max-w-[120px]">{l.notes_url || "—"}</TableCell>
                          <TableCell>
                            <Button size="icon" variant="ghost" onClick={() => deleteLesson.mutate({ id: l.id, course_id: selectedCourse! })}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Select a course to manage</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
