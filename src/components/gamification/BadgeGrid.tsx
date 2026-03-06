import { motion } from "framer-motion";
import {
  Trophy, Flame, Zap, Crown, Upload, Files,
  BookOpen, GraduationCap, Wrench, FileUser, Star, Sparkles,
} from "lucide-react";
import { BadgeDefinition, UserBadge } from "@/hooks/useGamification";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy, flame: Flame, zap: Zap, crown: Crown,
  upload: Upload, files: Files, "book-open": BookOpen,
  "graduation-cap": GraduationCap, wrench: Wrench,
  "file-user": FileUser, star: Star, sparkles: Sparkles,
};

interface BadgeGridProps {
  allBadges: BadgeDefinition[];
  earnedBadges: UserBadge[];
  compact?: boolean;
}

export const BadgeGrid = ({ allBadges, earnedBadges, compact }: BadgeGridProps) => {
  const earnedIds = new Set(earnedBadges.map(b => b.badge_id));

  const displayed = compact ? allBadges.slice(0, 8) : allBadges;

  return (
    <div className={`grid ${compact ? "grid-cols-4 gap-2" : "grid-cols-4 md:grid-cols-6 gap-3"}`}>
      {displayed.map((badge, i) => {
        const earned = earnedIds.has(badge.id);
        const Icon = iconMap[badge.icon] || Trophy;

        return (
          <Tooltip key={badge.id}>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  earned
                    ? "bg-warning/10 border border-warning/30 shadow-sm"
                    : "bg-muted/40 border border-border/30 opacity-40 grayscale"
                }`}
              >
                <Icon className={`${compact ? "h-5 w-5" : "h-6 w-6"} ${earned ? "text-warning" : "text-muted-foreground"}`} />
                <span className={`${compact ? "text-[8px]" : "text-[10px]"} font-medium text-center leading-tight ${earned ? "text-foreground" : "text-muted-foreground"}`}>
                  {badge.title}
                </span>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{badge.title}</p>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
              {!earned && <p className="text-xs text-warning mt-1">+{badge.xp_reward} XP</p>}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};
