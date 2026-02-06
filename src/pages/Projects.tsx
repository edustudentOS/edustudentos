import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code2,
  ExternalLink,
  Clock,
  Star,
  MessageSquare,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  skills: string[];
  duration: string;
  hasTemplate: boolean;
  interviewTip: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "Personal Portfolio Website",
    description: "Build a responsive portfolio to showcase your skills, projects, and experience. Perfect first project for any developer.",
    difficulty: "Beginner",
    skills: ["HTML", "CSS", "JavaScript"],
    duration: "1-2 weeks",
    hasTemplate: true,
    interviewTip: "I built this to demonstrate my frontend skills and understand responsive design principles.",
  },
  {
    id: "2",
    title: "Task Manager App",
    description: "Full CRUD application with user authentication, categories, and deadline reminders. Great for learning state management.",
    difficulty: "Intermediate",
    skills: ["React", "Node.js", "MongoDB"],
    duration: "2-3 weeks",
    hasTemplate: true,
    interviewTip: "This project taught me full-stack development, REST APIs, and database management.",
  },
  {
    id: "3",
    title: "Weather Dashboard",
    description: "Real-time weather app using external APIs with search, favorites, and 7-day forecasts with data visualization.",
    difficulty: "Intermediate",
    skills: ["React", "API Integration", "Charts"],
    duration: "1-2 weeks",
    hasTemplate: false,
    interviewTip: "I learned API integration, error handling, and data visualization through this project.",
  },
  {
    id: "4",
    title: "E-Commerce Platform",
    description: "Complete online store with product catalog, cart, payment integration, and admin panel for order management.",
    difficulty: "Advanced",
    skills: ["React", "Node.js", "Stripe", "PostgreSQL"],
    duration: "4-6 weeks",
    hasTemplate: true,
    interviewTip: "This full-stack project demonstrates my ability to build production-grade applications.",
  },
  {
    id: "5",
    title: "Chat Application",
    description: "Real-time messaging app with WebSocket, user presence, typing indicators, and message history.",
    difficulty: "Advanced",
    skills: ["React", "Socket.io", "Node.js"],
    duration: "3-4 weeks",
    hasTemplate: false,
    interviewTip: "I implemented real-time communication using WebSockets and learned about scalable architecture.",
  },
];

const difficultyColor = {
  Beginner: "text-success border-success/30 bg-success/5",
  Intermediate: "text-warning border-warning/30 bg-warning/5",
  Advanced: "text-destructive border-destructive/30 bg-destructive/5",
};

const Projects = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          Projects & Portfolio
        </h1>
        <p className="text-muted-foreground mt-1">
          Build real projects with step-by-step guides. Each includes interview explanation tips.
        </p>
      </motion.div>

      <div className="grid gap-4">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * (i + 1) }}
            className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover border border-border/50 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/5 text-primary shrink-0">
                <Code2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-lg">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.description}
                    </p>
                  </div>
                  <Badge variant="outline" className={`shrink-0 ${difficultyColor[project.difficulty]}`}>
                    {project.difficulty}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {project.duration}
                  </span>
                  {project.hasTemplate && (
                    <span className="flex items-center gap-1 text-success">
                      <Star className="h-3 w-3" /> Template Available
                    </span>
                  )}
                </div>

                <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground flex items-start gap-2">
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 mt-0.5 text-accent" />
                    <span>
                      <strong className="text-foreground">Interview tip:</strong> "{project.interviewTip}"
                    </span>
                  </p>
                </div>

                <div className="mt-4">
                  <Button variant="default" size="sm" className="gap-2">
                    Start Project <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
