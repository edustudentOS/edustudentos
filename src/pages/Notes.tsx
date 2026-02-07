import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  Search,
  BookOpen,
  ClipboardList,
  CalendarDays,
  ChevronRight,
  Loader2,
  LogIn,
} from "lucide-react";
import { useApprovedNotes, useCurrentUser } from "@/hooks/useNotes";
import UploadNoteDialog from "@/components/UploadNoteDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const typeIcon = {
  notes: BookOpen,
  pyq: ClipboardList,
  syllabus: CalendarDays,
};

const typeColor = {
  notes: "bg-info/10 text-info",
  pyq: "bg-accent/10 text-accent",
  syllabus: "bg-success/10 text-success",
};

const Notes = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  const { data: user } = useCurrentUser();
  const {
    data: notes,
    isLoading,
    error,
  } = useApprovedNotes({
    type: selectedType,
    semester: selectedSemester,
  });

  const handleDownload = (fileUrl: string | null, title: string) => {
    if (!fileUrl) return;
    const a = document.createElement("a");
    a.href = fileUrl;
    a.target = "_blank";
    a.download = `${title}.pdf`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Notes & PYQs
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse and download notes, previous year papers, and syllabi
          </p>
        </div>
        {user ? (
          <UploadNoteDialog />
        ) : (
          <Button variant="outline" size="sm" className="gap-2 self-start" disabled>
            <LogIn className="h-4 w-4" /> Log in to Upload
          </Button>
        )}
      </motion.div>

      {/* Breadcrumb Path */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-1 text-sm text-muted-foreground"
      >
        <span className="font-medium text-foreground">RGPV</span>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">CSE</span>
        <ChevronRight className="h-3 w-3" />
        <span>All Semesters</span>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-3"
      >
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[140px] bg-card">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="notes">Notes</SelectItem>
            <SelectItem value="pyq">PYQs</SelectItem>
            <SelectItem value="syllabus">Syllabus</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-[140px] bg-card">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            <SelectItem value="Sem 1">Sem 1</SelectItem>
            <SelectItem value="Sem 2">Sem 2</SelectItem>
            <SelectItem value="Sem 3">Sem 3</SelectItem>
            <SelectItem value="Sem 4">Sem 4</SelectItem>
            <SelectItem value="Sem 5">Sem 5</SelectItem>
            <SelectItem value="Sem 6">Sem 6</SelectItem>
            <SelectItem value="Sem 7">Sem 7</SelectItem>
            <SelectItem value="Sem 8">Sem 8</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-lg p-4 border border-border/50">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load notes. Please try again.</p>
        </div>
      )}

      {/* Notes Grid */}
      {!isLoading && !error && notes && (
        <div className="grid gap-3">
          {notes.map((note, i) => {
            const TypeIcon = typeIcon[note.type];
            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * (i + 1) }}
                className="bg-card rounded-lg p-4 shadow-card hover:shadow-card-hover border border-border/50 transition-all group cursor-pointer"
                onClick={() => handleDownload(note.file_url, note.title)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2.5 rounded-lg shrink-0 ${typeColor[note.type]}`}
                  >
                    <TypeIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground truncate">
                        {note.title}
                      </h3>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {note.type === "pyq"
                          ? "PYQ"
                          : note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{note.subject}</span>
                      <span>•</span>
                      <span>{note.semester}</span>
                      <span>•</span>
                      <span>{format(new Date(note.created_at), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Download className="h-3 w-3" /> {note.downloads ?? 0}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(note.file_url, note.title);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!isLoading && !error && notes?.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">
            No notes found for the selected filters
          </p>
        </div>
      )}
    </div>
  );
};

export default Notes;
