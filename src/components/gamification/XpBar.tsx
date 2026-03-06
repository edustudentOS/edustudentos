import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { xpForLevel, xpForNextLevel } from "@/hooks/useGamification";

interface XpBarProps {
  xp: number;
  level: number;
}

export const XpBar = ({ xp, level }: XpBarProps) => {
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForNextLevel(level);
  const progress = nextLevelXp > currentLevelXp
    ? ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
    : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="h-8 w-8 rounded-full bg-warning/15 flex items-center justify-center">
          <Zap className="h-4 w-4 text-warning" />
        </div>
        <div>
          <p className="text-xs font-bold text-foreground">Lv. {level}</p>
          <p className="text-[10px] text-muted-foreground">{xp} XP</p>
        </div>
      </div>
      <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-warning to-warning/70"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground shrink-0">
        {nextLevelXp - xp} to Lv.{level + 1}
      </span>
    </div>
  );
};
