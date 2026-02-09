import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  useProjectTemplates,
  useCreateProjectTemplate,
  useTogglePublishProject,
  useDeleteProjectTemplate,
} from "@/hooks/useAdminProjects";
import { FolderKanban, Plus, Eye, EyeOff, Trash2 } from "lucide-react";

export default function AdminProjectManager() {
  const { toast } = useToast();
  const { data: projects, isLoading } = useProjectTemplates();
  const createProject = useCreateProjectTemplate();
  const togglePublish = useTogglePublishProject();
  const deleteProject = useDeleteProjectTemplate();

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "beginner",
    category: "web",
    explanation: "",
  });

  const handleCreate = async () => {
    await createProject.mutateAsync(form);
    setForm({ title: "", description: "", difficulty: "beginner", category: "web", explanation: "" });
    setCreateOpen(false);
    toast({ title: "Project template created" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Project Manager</h1>
          <p className="text-muted-foreground">Manage project templates and interview Q&A</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Project Template</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
                  <SelectTrigger><SelectValue placeholder="Difficulty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web App</SelectItem>
                    <SelectItem value="mobile">Mobile App</SelectItem>
                    <SelectItem value="api">API / Backend</SelectItem>
                    <SelectItem value="ml">ML / AI</SelectItem>
                    <SelectItem value="fullstack">Full Stack</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea placeholder="Explanation / How to present in interview" value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} />
              <Button onClick={handleCreate} disabled={!form.title || createProject.isPending} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><FolderKanban className="h-4 w-4" />All Projects ({projects?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects?.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div>
                        <span className="font-medium">{p.title}</span>
                        {p.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{p.description}</p>}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{p.category}</Badge></TableCell>
                    <TableCell><Badge variant="secondary">{p.difficulty}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={p.is_published ? "default" : "secondary"}>
                        {p.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => togglePublish.mutate({ id: p.id, is_published: !p.is_published })}
                        >
                          {p.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteProject.mutate(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {projects?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No projects yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
