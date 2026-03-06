import { Flame } from "lucide-react";
import { motion } from "framer-motion";

interface StreakBadgeProps {
  streak: number;
}

export const StreakBadge = ({ streak }: StreakBadgeProps) => {
  if (streak === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20"
    >
      <Flame className="h-4 w-4 text-destructive" />
      <span className="text-sm font-bold text-destructive">{streak}</span>
      <span className="text-xs text-destructive/70">day streak</span>
    </motion.div>
  );
};
