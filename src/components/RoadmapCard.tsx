import { motion } from "framer-motion";
import { LucideIcon, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface RoadmapCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  skillCount: number;
  duration: string;
  color: string;
  delay?: number;
}

export function RoadmapCard({
  id,
  title,
  description,
  icon: Icon,
  skillCount,
  duration,
  color,
  delay = 0,
}: RoadmapCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link
        to={`/roadmaps/${id}`}
        className="group block bg-card rounded-lg p-5 shadow-card hover:shadow-card-hover transition-all border border-border/50 hover:border-accent/30"
      >
        <div className="flex items-start gap-4">
          <div
            className="p-3 rounded-lg shrink-0"
            style={{ backgroundColor: color + "18", color: color }}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-foreground group-hover:text-accent transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="font-medium">{skillCount} skills</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {duration}
              </span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all mt-1 shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}
