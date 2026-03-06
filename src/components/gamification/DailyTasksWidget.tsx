import { motion } from "framer-motion";
import { CheckCircle2, Circle, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { DailyTask } from "@/hooks/useGamification";
import { UseMutationResult } from "@tanstack/react-query";

interface DailyTasksWidgetProps {
  tasks: DailyTask[];
  completeTask: UseMutationResult<void, Error, string>;
}

export const DailyTasksWidget = ({ tasks, completeTask }: DailyTasksWidgetProps) => {
  if (tasks.length === 0) return null;

  const completedCount = tasks.filter(t => t.is_completed).length;

  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border/50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-foreground text-sm">📅 Today's Tasks</h3>
        <span className="text-xs text-muted-foreground">{completedCount}/{tasks.length} done</span>
      </div>
      <div className="space-y-2">
        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              task.is_completed
                ? "bg-success/5 border border-success/20"
                : "bg-muted/50 border border-border/50 hover:border-primary/20"
            }`}
          >
            <button
              onClick={() => !task.is_completed && completeTask.mutate(task.id)}
              disabled={task.is_completed || completeTask.isPending}
              className="shrink-0"
            >
              {task.is_completed ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/40 hover:text-primary transition-colors" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              {task.target_route ? (
                <Link to={task.target_route} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {task.title}
                </Link>
              ) : (
                <span className="text-sm font-medium text-foreground">{task.title}</span>
              )}
              {task.description && (
                <p className="text-[10px] text-muted-foreground truncate">{task.description}</p>
              )}
            </div>
            <div className="flex items-center gap-0.5 text-warning shrink-0">
              <Zap className="h-3 w-3" />
              <span className="text-[10px] font-bold">+{task.xp_reward}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
