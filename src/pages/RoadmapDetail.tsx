import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Briefcase,
  Wrench,
  FolderCode,
  Globe,
  Database,
  Smartphone,
  Shield,
  Cloud,
  Brain,
  Palette,
  Server,
  LucideIcon,
} from "lucide-react";

interface RoadmapData {
  title: string;
  icon: LucideIcon;
  color: string;
  duration: string;
  description: string;
  skills: { name: string; completed: boolean }[];
  tools: string[];
  projects: { name: string; difficulty: string }[];
  jobs: string[];
}

const roadmapData: Record<string, RoadmapData> = {
  "web-development": {
    title: "Web Development",
    icon: Globe,
    color: "#3b82f6",
    duration: "5-6 months",
    description: "Master frontend and backend web technologies to build modern, responsive web applications.",
    skills: [
      { name: "HTML & CSS", completed: true },
      { name: "JavaScript ES6+", completed: true },
      { name: "Git & GitHub", completed: false },
      { name: "React.js", completed: false },
      { name: "TypeScript", completed: false },
      { name: "Node.js & Express", completed: false },
      { name: "REST APIs", completed: false },
      { name: "Database (SQL/NoSQL)", completed: false },
      { name: "Authentication & Security", completed: false },
      { name: "Deployment & CI/CD", completed: false },
      { name: "Testing", completed: false },
      { name: "Performance Optimization", completed: false },
    ],
    tools: ["VS Code", "GitHub", "Chrome DevTools", "Postman", "Figma", "Vercel/Netlify"],
    projects: [
      { name: "Personal Portfolio Website", difficulty: "Beginner" },
      { name: "To-Do App with CRUD", difficulty: "Beginner" },
      { name: "Weather Dashboard", difficulty: "Intermediate" },
      { name: "E-commerce Store", difficulty: "Advanced" },
      { name: "Real-time Chat App", difficulty: "Advanced" },
    ],
    jobs: ["Junior Frontend Developer", "Web Developer Intern", "Full-Stack Developer", "React Developer"],
  },
  "data-science": {
    title: "Data Science & Analytics",
    icon: Database,
    color: "#10b981",
    duration: "6-8 months",
    description: "Learn to analyze data, build predictive models, and derive insights using Python and ML.",
    skills: [
      { name: "Python Basics", completed: true },
      { name: "NumPy & Pandas", completed: false },
      { name: "Data Visualization", completed: false },
      { name: "Statistics & Probability", completed: false },
      { name: "SQL for Data", completed: false },
      { name: "Machine Learning Basics", completed: false },
      { name: "Scikit-learn", completed: false },
      { name: "Feature Engineering", completed: false },
      { name: "Deep Learning Intro", completed: false },
      { name: "Model Deployment", completed: false },
    ],
    tools: ["Jupyter Notebook", "Google Colab", "Kaggle", "Tableau", "GitHub"],
    projects: [
      { name: "Exploratory Data Analysis", difficulty: "Beginner" },
      { name: "Sales Prediction Model", difficulty: "Intermediate" },
      { name: "Sentiment Analysis", difficulty: "Intermediate" },
      { name: "Recommendation System", difficulty: "Advanced" },
    ],
    jobs: ["Data Analyst", "Junior Data Scientist", "ML Engineer Intern", "Business Analyst"],
  },
};

const defaultRoadmap: RoadmapData = {
  title: "Coming Soon",
  icon: Circle,
  color: "#64748b",
  duration: "TBD",
  description: "This roadmap is being crafted by experts. Check back soon!",
  skills: [],
  tools: [],
  projects: [],
  jobs: [],
};

const RoadmapDetail = () => {
  const { id } = useParams<{ id: string }>();
  const roadmap = id ? roadmapData[id] || defaultRoadmap : defaultRoadmap;
  const completedSkills = roadmap.skills.filter((s) => s.completed).length;
  const progress = roadmap.skills.length > 0 ? Math.round((completedSkills / roadmap.skills.length) * 100) : 0;
  const Icon = roadmap.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/roadmaps">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Roadmaps
          </Link>
        </Button>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl p-6 shadow-card border border-border/50"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: roadmap.color + "18", color: roadmap.color }}>
            <Icon className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-foreground">{roadmap.title}</h1>
            <p className="text-muted-foreground mt-1">{roadmap.description}</p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" /> {roadmap.duration}
              </Badge>
              <Badge variant="secondary">{roadmap.skills.length} skills</Badge>
            </div>
            {roadmap.skills.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Skills */}
        {roadmap.skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl p-5 shadow-card border border-border/50"
          >
            <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-success" /> Skills to Learn
            </h2>
            <div className="space-y-2.5">
              {roadmap.skills.map((skill) => (
                <div key={skill.name} className="flex items-center gap-3">
                  {skill.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <span className={`text-sm ${skill.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tools & Projects */}
        <div className="space-y-4">
          {roadmap.tools.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-5 shadow-card border border-border/50"
            >
              <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-3">
                <Wrench className="h-5 w-5 text-info" /> Tools You'll Use
              </h2>
              <div className="flex flex-wrap gap-2">
                {roadmap.tools.map((tool) => (
                  <Badge key={tool} variant="secondary">{tool}</Badge>
                ))}
              </div>
            </motion.div>
          )}

          {roadmap.projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl p-5 shadow-card border border-border/50"
            >
              <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-3">
                <FolderCode className="h-5 w-5 text-accent" /> Projects
              </h2>
              <div className="space-y-2">
                {roadmap.projects.map((project) => (
                  <div key={project.name} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{project.name}</span>
                    <Badge
                      variant="outline"
                      className={
                        project.difficulty === "Beginner"
                          ? "text-success border-success/30"
                          : project.difficulty === "Intermediate"
                          ? "text-warning border-warning/30"
                          : "text-destructive border-destructive/30"
                      }
                    >
                      {project.difficulty}
                    </Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Job Opportunities */}
      {roadmap.jobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-5 shadow-card border border-border/50"
        >
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-3">
            <Briefcase className="h-5 w-5 text-accent" /> Job Opportunities
          </h2>
          <div className="flex flex-wrap gap-2">
            {roadmap.jobs.map((job) => (
              <Badge key={job} className="bg-primary/10 text-primary border-0 hover:bg-primary/15">
                {job}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RoadmapDetail;
