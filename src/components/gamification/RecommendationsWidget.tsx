import { motion } from "framer-motion";
import { Sparkles, Map, BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Recommendation } from "@/hooks/useRecommendations";

interface RecommendationsWidgetProps {
  recommendations: Recommendation[];
}

export const RecommendationsWidget = ({ recommendations }: RecommendationsWidgetProps) => {
  if (recommendations.length === 0) return null;

  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border/50">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-accent" />
        <h3 className="font-display font-bold text-foreground text-sm">Recommended for You</h3>
      </div>
      <div className="space-y-2">
        {recommendations.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={rec.route}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/40 hover:border-primary/20 hover:shadow-sm transition-all group"
            >
              <div className={`p-2 rounded-lg shrink-0 ${
                rec.type === "roadmap" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
              }`}>
                {rec.type === "roadmap" ? <Map className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{rec.title}</p>
                <p className="text-[10px] text-muted-foreground">{rec.reason}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
