import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileUp, CheckCircle, Loader2 } from "lucide-react";
import { useUploadNote } from "@/hooks/useNotes";
import { useToast } from "@/hooks/use-toast";

interface UploadNoteDialogProps {
  trigger?: React.ReactNode;
}

const UploadNoteDialog = ({ trigger }: UploadNoteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"notes" | "pyq" | "syllabus">("notes");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [college, setCollege] = useState("RGPV");

  const uploadMutation = useUploadNote();
  const { toast } = useToast();

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setType("notes");
    setSubject("");
    setSemester("");
    setBranch("CSE");
    setCollege("RGPV");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title || !subject || !semester) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive",
      });
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        file,
        metadata: { title, type, subject, semester, branch, college },
      });

      toast({
        title: "Upload successful!",
        description:
          "Your notes have been submitted for review. They'll appear once approved by an admin.",
      });
      resetForm();
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="accent" size="sm" className="gap-2">
            <Upload className="h-4 w-4" /> Upload Notes
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Upload Notes / PYQ</DialogTitle>
          <DialogDescription>
            Share your notes with the community. Uploads are reviewed before publishing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* File Drop Zone */}
          <div>
            <Label htmlFor="file">PDF File *</Label>
            <label
              htmlFor="file"
              className="mt-1.5 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 cursor-pointer hover:border-accent/50 transition-colors"
            >
              {file ? (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="truncate max-w-[250px]">{file.name}</span>
                </div>
              ) : (
                <>
                  <FileUp className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to select a PDF file
                  </span>
                </>
              )}
              <input
                id="file"
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g. DSA Complete Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type *</Label>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notes">Notes</SelectItem>
                  <SelectItem value="pyq">PYQ</SelectItem>
                  <SelectItem value="syllabus">Syllabus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Semester *</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"].map(
                    (s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="e.g. Data Structures"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="college">College</Label>
              <Input
                id="college"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="accent"
            className="w-full gap-2"
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" /> Submit for Review
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadNoteDialog;
