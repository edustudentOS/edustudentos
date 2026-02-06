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
  Upload,
  Download,
  Search,
  BookOpen,
  ClipboardList,
  CalendarDays,
  ChevronRight,
} from "lucide-react";

interface NoteItem {
  id: string;
  title: string;
  type: "notes" | "pyq" | "syllabus";
  subject: string;
  semester: string;
  branch: string;
  college: string;
  uploadedBy: string;
  date: string;
  downloads: number;
}

const mockNotes: NoteItem[] = [
  { id: "1", title: "DSA Complete Notes", type: "notes", subject: "Data Structures", semester: "Sem 3", branch: "CSE", college: "RGPV", uploadedBy: "Rahul S.", date: "2024-12-15", downloads: 342 },
  { id: "2", title: "DBMS PYQ 2023", type: "pyq", subject: "DBMS", semester: "Sem 4", branch: "CSE", college: "RGPV", uploadedBy: "Priya M.", date: "2024-11-20", downloads: 518 },
  { id: "3", title: "OS Syllabus 2024-25", type: "syllabus", subject: "Operating Systems", semester: "Sem 5", branch: "CSE", college: "RGPV", uploadedBy: "Admin", date: "2024-10-01", downloads: 890 },
  { id: "4", title: "Mathematics-III Notes", type: "notes", subject: "Mathematics", semester: "Sem 3", branch: "CSE", college: "RGPV", uploadedBy: "Amit K.", date: "2024-12-01", downloads: 256 },
  { id: "5", title: "CN Previous Year Papers", type: "pyq", subject: "Computer Networks", semester: "Sem 5", branch: "CSE", college: "RGPV", uploadedBy: "Sara J.", date: "2024-11-10", downloads: 421 },
  { id: "6", title: "Java Programming Notes", type: "notes", subject: "Java", semester: "Sem 4", branch: "CSE", college: "RGPV", uploadedBy: "Vikash P.", date: "2024-12-20", downloads: 189 },
];

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

  const filtered = mockNotes.filter((note) => {
    if (selectedType !== "all" && note.type !== selectedType) return false;
    if (selectedSemester !== "all" && note.semester !== selectedSemester) return false;
    return true;
  });

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
        <Button variant="accent" size="sm" className="gap-2 self-start">
          <Upload className="h-4 w-4" /> Upload Notes
        </Button>
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
            <SelectItem value="Sem 3">Sem 3</SelectItem>
            <SelectItem value="Sem 4">Sem 4</SelectItem>
            <SelectItem value="Sem 5">Sem 5</SelectItem>
            <SelectItem value="Sem 6">Sem 6</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Notes Grid */}
      <div className="grid gap-3">
        {filtered.map((note, i) => {
          const TypeIcon = typeIcon[note.type];
          return (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * (i + 1) }}
              className="bg-card rounded-lg p-4 shadow-card hover:shadow-card-hover border border-border/50 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-lg shrink-0 ${typeColor[note.type]}`}>
                  <TypeIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground truncate">{note.title}</h3>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {note.type === "pyq" ? "PYQ" : note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{note.subject}</span>
                    <span>•</span>
                    <span>{note.semester}</span>
                    <span>•</span>
                    <span>by {note.uploadedBy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Download className="h-3 w-3" /> {note.downloads}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No notes found for the selected filters</p>
        </div>
      )}
    </div>
  );
};

export default Notes;
