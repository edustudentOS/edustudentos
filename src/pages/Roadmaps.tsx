import { motion } from "framer-motion";
import { RoadmapCard } from "@/components/RoadmapCard";
import {
  Globe,
  Database,
  Smartphone,
  Shield,
  Cloud,
  Brain,
  Palette,
  Server,
} from "lucide-react";

const roadmaps = [
  {
    id: "web-development",
    title: "Web Development",
    description: "Master HTML, CSS, JavaScript, React and build production-ready web apps with modern tools",
    icon: Globe,
    skillCount: 12,
    duration: "5-6 months",
    color: "#3b82f6",
  },
  {
    id: "data-science",
    title: "Data Science & Analytics",
    description: "Learn Python, statistics, machine learning basics, and data visualization from scratch",
    icon: Database,
    skillCount: 10,
    duration: "6-8 months",
    color: "#10b981",
  },
  {
    id: "app-development",
    title: "App Development",
    description: "Build beautiful mobile apps with Flutter or React Native for Android and iOS",
    icon: Smartphone,
    skillCount: 8,
    duration: "4-5 months",
    color: "#8b5cf6",
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    description: "Master ethical hacking, network security, and vulnerability assessment",
    icon: Shield,
    skillCount: 9,
    duration: "6-7 months",
    color: "#ef4444",
  },
  {
    id: "cloud-devops",
    title: "Cloud & DevOps",
    description: "Learn AWS/Azure, Docker, Kubernetes, CI/CD pipelines and infrastructure",
    icon: Cloud,
    skillCount: 11,
    duration: "5-7 months",
    color: "#06b6d4",
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    description: "Deep dive into neural networks, NLP, computer vision and AI applications",
    icon: Brain,
    skillCount: 14,
    duration: "8-10 months",
    color: "#f59e0b",
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    description: "Master Figma, design principles, prototyping and user research methodology",
    icon: Palette,
    skillCount: 7,
    duration: "3-4 months",
    color: "#ec4899",
  },
  {
    id: "backend-development",
    title: "Backend Development",
    description: "Node.js, databases, APIs, authentication and server-side architecture",
    icon: Server,
    skillCount: 10,
    duration: "5-6 months",
    color: "#64748b",
  },
];

const Roadmaps = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          Career Roadmaps
        </h1>
        <p className="text-muted-foreground mt-1">
          Choose your career path. Each roadmap includes skills, tools, projects, and job guidance.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {roadmaps.map((roadmap, i) => (
          <RoadmapCard key={roadmap.id} {...roadmap} delay={0.05 * (i + 1)} />
        ))}
      </div>
    </div>
  );
};

export default Roadmaps;
