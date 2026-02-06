import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileUser,
  Download,
  CheckCircle2,
  Circle,
  MessageSquare,
  Mic,
  User,
  Lightbulb,
} from "lucide-react";

const resumeChecklist = [
  { text: "Contact info with LinkedIn & GitHub", done: true },
  { text: "Professional summary (2-3 lines)", done: true },
  { text: "Education with CGPA/percentage", done: true },
  { text: "Technical skills section", done: false },
  { text: "2-3 projects with tech stack", done: false },
  { text: "Certifications & achievements", done: false },
  { text: "Proper formatting & no typos", done: false },
  { text: "ATS-friendly format (PDF)", done: false },
];

const interviewPrep = [
  {
    category: "Self Introduction",
    icon: User,
    tip: 'Use the 3-step formula: Present → Past → Future. "I am a CSE student at RGPV, currently in my 3rd year. I have been learning web development and built 3 projects. My goal is to become a full-stack developer."',
  },
  {
    category: "HR Questions",
    icon: MessageSquare,
    questions: [
      "Tell me about yourself",
      "Why should we hire you?",
      "What are your strengths and weaknesses?",
      "Where do you see yourself in 5 years?",
      "Why do you want to join our company?",
    ],
  },
  {
    category: "Technical Basics",
    icon: Lightbulb,
    questions: [
      "Explain OOP concepts with examples",
      "What is the difference between stack and queue?",
      "Explain REST API",
      "What is Git and why is it used?",
      "Explain database normalization",
    ],
  },
];

const Resume = () => {
  const completedCount = resumeChecklist.filter((i) => i.done).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          Resume & Interview Prep
        </h1>
        <p className="text-muted-foreground mt-1">
          Build an ATS-friendly resume and prepare for interviews with proven strategies
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Resume Builder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="bg-card rounded-xl p-5 shadow-card border border-border/50">
            <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
              <FileUser className="h-5 w-5 text-accent" /> Resume Templates
            </h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {["Classic", "Modern", "Minimal"].map((template) => (
                <div
                  key={template}
                  className="aspect-[3/4] rounded-lg border-2 border-border hover:border-accent cursor-pointer transition-colors bg-muted/30 flex items-end justify-center pb-2"
                >
                  <span className="text-xs font-medium text-muted-foreground">{template}</span>
                </div>
              ))}
            </div>
            <Button variant="accent" className="w-full gap-2">
              <Download className="h-4 w-4" /> Download Template
            </Button>
          </div>

          {/* Checklist */}
          <div className="bg-card rounded-xl p-5 shadow-card border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-foreground">Resume Checklist</h2>
              <Badge variant="secondary">{completedCount}/{resumeChecklist.length}</Badge>
            </div>
            <div className="space-y-2.5">
              {resumeChecklist.map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <span className={`text-sm ${item.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Interview Prep */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {interviewPrep.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.category} className="bg-card rounded-xl p-5 shadow-card border border-border/50">
                <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Icon className="h-5 w-5 text-info" /> {section.category}
                </h2>
                {section.tip && (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-sm text-foreground leading-relaxed">{section.tip}</p>
                  </div>
                )}
                {section.questions && (
                  <div className="space-y-2">
                    {section.questions.map((q, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                        <span className="text-xs font-medium text-accent mt-0.5">Q{i + 1}</span>
                        <span className="text-sm text-foreground">{q}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Resume;
