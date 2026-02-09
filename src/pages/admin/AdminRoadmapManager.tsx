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
  useRoadmaps,
  useRoadmapSkills,
  useRoadmapProjects,
  useCreateRoadmap,
  useTogglePublishRoadmap,
  useDeleteRoadmap,
  useAddSkill,
  useDeleteSkill,
  useAddProject,
  useDeleteProject,
} from "@/hooks/useAdminRoadmaps";
import { Map, Plus, Eye, EyeOff, Trash2, Layers, FolderKanban } from "lucide-react";

export default function AdminRoadmapManager() {
  const { toast } = useToast();
  const { data: roadmaps, isLoading } = useRoadmaps();
  const createRoadmap = useCreateRoadmap();
  const togglePublish = useTogglePublishRoadmap();
  const deleteRoadmap = useDeleteRoadmap();
  const addSkill = useAddSkill();
  const deleteSkill = useDeleteSkill();
  const addProject = useAddProject();
  const deleteProject = useDeleteProject();

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "web-dev", duration: "" });
  const [skillForm, setSkillForm] = useState({ skill_name: "", description: "", tools: "" });
  const [projectForm, setProjectForm] = useState({ title: "", description: "", difficulty: "beginner" });

  const { data: skills } = useRoadmapSkills(selectedRoadmap);
  const { data: projects } = useRoadmapProjects(selectedRoadmap);

  const handleCreate = async () => {
    await createRoadmap.mutateAsync(form);
    setForm({ title: "", description: "", category: "web-dev", duration: "" });
    setCreateOpen(false);
    toast({ title: "Roadmap created" });
  };

  const handleAddSkill = async () => {
    if (!selectedRoadmap) return;
    await addSkill.mutateAsync({
      roadmap_id: selectedRoadmap,
      ...skillForm,
      order_index: skills?.length ?? 0,
    });
    setSkillForm({ skill_name: "", description: "", tools: "" });
    toast({ title: "Skill added" });
  };

  const handleAddProject = async () => {
    if (!selectedRoadmap) return;
    await addProject.mutateAsync({
      roadmap_id: selectedRoadmap,
      ...projectForm,
      order_index: projects?.length ?? 0,
    });
    setProjectForm({ title: "", description: "", difficulty: "beginner" });
    toast({ title: "Project added" });
  };

  const selectedRoadmapData = roadmaps?.find((r) => r.id === selectedRoadmap);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Roadmap Manager</h1>
          <p className="text-muted-foreground">Create and manage career roadmaps</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Roadmap</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Roadmap</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="web-dev">Web Development</SelectItem>
                  <SelectItem value="mobile-dev">Mobile Development</SelectItem>
                  <SelectItem value="data-science">Data Science</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="ai-ml">AI / ML</SelectItem>
                  <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Duration (e.g., 3 months)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              <Button onClick={handleCreate} disabled={!form.title || createRoadmap.isPending} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roadmaps list */}
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Map className="h-4 w-4" />Roadmaps</CardTitle></CardHeader>
          <CardContent className="space-y-2 max-h-[60vh] overflow-auto">
            {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
            {roadmaps?.map((r) => (
              <div
                key={r.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedRoadmap === r.id ? "border-accent bg-accent/5" : "border-border hover:bg-muted/50"}`}
                onClick={() => setSelectedRoadmap(r.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-foreground">{r.title}</span>
                  <Badge variant={r.is_published ? "default" : "secondary"} className="text-xs">
                    {r.is_published ? "Live" : "Draft"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{r.category} • {r.duration || "No duration"}</p>
              </div>
            ))}
            {roadmaps?.length === 0 && <p className="text-sm text-muted-foreground">No roadmaps yet</p>}
          </CardContent>
        </Card>

        {/* Detail panel */}
        <div className="lg:col-span-2 space-y-4">
          {selectedRoadmapData ? (
            <>
              <Card>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-lg">{selectedRoadmapData.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublish.mutate({ id: selectedRoadmapData.id, is_published: !selectedRoadmapData.is_published })}
                    >
                      {selectedRoadmapData.is_published ? <><EyeOff className="h-4 w-4 mr-1" />Unpublish</> : <><Eye className="h-4 w-4 mr-1" />Publish</>}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => { deleteRoadmap.mutate(selectedRoadmapData.id); setSelectedRoadmap(null); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{selectedRoadmapData.description || "No description"}</p>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Layers className="h-4 w-4" />Skills ({skills?.length ?? 0})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="Skill name" value={skillForm.skill_name} onChange={(e) => setSkillForm({ ...skillForm, skill_name: e.target.value })} />
                    <Input placeholder="Tools" value={skillForm.tools} onChange={(e) => setSkillForm({ ...skillForm, tools: e.target.value })} />
                    <Button onClick={handleAddSkill} disabled={!skillForm.skill_name} size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Skill</TableHead>
                        <TableHead>Tools</TableHead>
                        <TableHead className="w-16"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {skills?.map((s, i) => (
                        <TableRow key={s.id}>
                          <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                          <TableCell className="font-medium">{s.skill_name}</TableCell>
                          <TableCell className="text-muted-foreground">{s.tools || "—"}</TableCell>
                          <TableCell>
                            <Button size="icon" variant="ghost" onClick={() => deleteSkill.mutate({ id: s.id, roadmap_id: selectedRoadmap! })}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><FolderKanban className="h-4 w-4" />Projects ({projects?.length ?? 0})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="Project title" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} />
                    <Select value={projectForm.difficulty} onValueChange={(v) => setProjectForm({ ...projectForm, difficulty: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddProject} disabled={!projectForm.title} size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead className="w-16"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects?.map((p, i) => (
                        <TableRow key={p.id}>
                          <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                          <TableCell className="font-medium">{p.title}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{p.difficulty}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="icon" variant="ghost" onClick={() => deleteProject.mutate({ id: p.id, roadmap_id: selectedRoadmap! })}>
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
              <p className="text-muted-foreground">Select a roadmap to manage</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
