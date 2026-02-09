import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  useResumeTemplates,
  useCreateResumeTemplate,
  useToggleResumeActive,
  useDeleteResumeTemplate,
  useHRQuestions,
  useCreateHRQuestion,
  useDeleteHRQuestion,
} from "@/hooks/useAdminResume";
import { FileText, Plus, Trash2, HelpCircle, ToggleLeft, ToggleRight } from "lucide-react";

export default function AdminResumeManager() {
  const { toast } = useToast();
  const { data: templates } = useResumeTemplates();
  const { data: questions } = useHRQuestions();
  const createTemplate = useCreateResumeTemplate();
  const toggleActive = useToggleResumeActive();
  const deleteTemplate = useDeleteResumeTemplate();
  const createQuestion = useCreateHRQuestion();
  const deleteQuestion = useDeleteHRQuestion();

  const [templateOpen, setTemplateOpen] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [tForm, setTForm] = useState({ title: "", format_type: "ats", file_url: "" });
  const [qForm, setQForm] = useState({ question: "", answer: "", category: "hr" });

  const handleCreateTemplate = async () => {
    await createTemplate.mutateAsync(tForm);
    setTForm({ title: "", format_type: "ats", file_url: "" });
    setTemplateOpen(false);
    toast({ title: "Template added" });
  };

  const handleCreateQuestion = async () => {
    await createQuestion.mutateAsync(qForm);
    setQForm({ question: "", answer: "", category: "hr" });
    setQuestionOpen(false);
    toast({ title: "Question added" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Resume & Interview</h1>
        <p className="text-muted-foreground">Manage resume templates and HR questions</p>
      </div>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Resume Templates</TabsTrigger>
          <TabsTrigger value="questions">HR Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Template</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Resume Template</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Template title" value={tForm.title} onChange={(e) => setTForm({ ...tForm, title: e.target.value })} />
                  <Select value={tForm.format_type} onValueChange={(v) => setTForm({ ...tForm, format_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ats">ATS Format</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="File URL" value={tForm.file_url} onChange={(e) => setTForm({ ...tForm, file_url: e.target.value })} />
                  <Button onClick={handleCreateTemplate} disabled={!tForm.title || createTemplate.isPending} className="w-full">Add</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" />Templates ({templates?.length ?? 0})</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates?.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.title}</TableCell>
                      <TableCell><Badge variant="outline">{t.format_type}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={t.is_active ? "default" : "secondary"}>
                          {t.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => toggleActive.mutate({ id: t.id, is_active: !t.is_active })}>
                            {t.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteTemplate.mutate(t.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {templates?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">No templates yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={questionOpen} onOpenChange={setQuestionOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Question</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add HR Question</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Textarea placeholder="Question" value={qForm.question} onChange={(e) => setQForm({ ...qForm, question: e.target.value })} />
                  <Textarea placeholder="Answer" value={qForm.answer} onChange={(e) => setQForm({ ...qForm, answer: e.target.value })} />
                  <Select value={qForm.category} onValueChange={(v) => setQForm({ ...qForm, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr">HR Round</SelectItem>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="self-intro">Self Introduction</SelectItem>
                      <SelectItem value="situational">Situational</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleCreateQuestion} disabled={!qForm.question || createQuestion.isPending} className="w-full">Add</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><HelpCircle className="h-4 w-4" />Questions ({questions?.length ?? 0})</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Answer</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions?.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">{q.question}</TableCell>
                      <TableCell><Badge variant="outline">{q.category}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{q.answer || "—"}</TableCell>
                      <TableCell>
                        <Button size="icon" variant="ghost" onClick={() => deleteQuestion.mutate(q.id)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {questions?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">No questions yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
