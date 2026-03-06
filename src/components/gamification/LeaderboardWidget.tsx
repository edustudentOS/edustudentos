import { motion } from "framer-motion";
import { Trophy, Flame, Medal } from "lucide-react";
import { LeaderboardEntry } from "@/hooks/useGamification";
import { useAuth } from "@/contexts/AuthContext";

interface LeaderboardWidgetProps {
  entries: LeaderboardEntry[];
}

const rankColors = ["text-warning", "text-muted-foreground", "text-accent"];
const rankIcons = [Trophy, Medal, Medal];

export const LeaderboardWidget = ({ entries }: LeaderboardWidgetProps) => {
  const { user } = useAuth();

  if (entries.length === 0) return null;

  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border/50">
      <h3 className="font-display font-bold text-foreground text-sm mb-3">🏆 Leaderboard</h3>
      <div className="space-y-2">
        {entries.slice(0, 10).map((entry, i) => {
          const isMe = entry.user_id === user?.id;
          const RankIcon = i < 3 ? rankIcons[i] : null;

          return (
            <motion.div
              key={entry.user_id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                isMe ? "bg-primary/5 border border-primary/20" : "bg-muted/30"
              }`}
            >
              <span className={`text-sm font-bold w-6 text-center ${i < 3 ? rankColors[i] : "text-muted-foreground"}`}>
                {RankIcon ? <RankIcon className="h-4 w-4 inline" /> : `#${i + 1}`}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isMe ? "text-primary" : "text-foreground"}`}>
                  {entry.display_name || "Student"} {isMe && "(You)"}
                </p>
                {entry.college && (
                  <p className="text-[10px] text-muted-foreground truncate">{entry.college}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {entry.current_streak > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] text-destructive">
                    <Flame className="h-3 w-3" />{entry.current_streak}
                  </span>
                )}
                <span className="text-xs font-bold text-warning">{entry.xp} XP</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
