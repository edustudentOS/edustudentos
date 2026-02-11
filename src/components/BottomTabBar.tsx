import { useState } from "react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import {
  Home,
  Map,
  BookOpen,
  FileText,
  User,
  MoreHorizontal,
  Code2,
  FileUser,
  MessageSquare,
  Briefcase,
  Upload,
  Bell,
  X,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const tabs = [
  { title: "Home", url: "/", icon: Home },
  { title: "Roadmap", url: "/roadmaps", icon: Map },
  { title: "Learn", url: "/learning", icon: BookOpen },
  { title: "Notes", url: "/notes", icon: FileText },
  { title: "More", url: "#more", icon: MoreHorizontal },
];

const moreItems = [
  { title: "Projects", url: "/projects", icon: Code2 },
  { title: "Resume", url: "/resume", icon: FileUser },
  { title: "Interview Prep", url: "/interview", icon: MessageSquare },
  { title: "Placements", url: "/placements", icon: Briefcase },
  { title: "My Uploads", url: "/uploads", icon: Upload },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Profile", url: "/profile", icon: User },
];

export function BottomTabBar() {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  const isActive = (url: string) => {
    if (url === "/") return location.pathname === "/";
    return location.pathname.startsWith(url);
  };

  const isMoreActive = moreItems.some((item) => isActive(item.url)) || location.pathname.startsWith("/admin");

  return (
    <>
      {/* More Menu Overlay */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl border-t border-border shadow-xl md:hidden"
            >
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <h3 className="font-display font-bold text-foreground text-lg">More</h3>
                <button onClick={() => setMoreOpen(false)} className="p-1.5 rounded-full hover:bg-muted">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1 px-4 pb-6">
                {moreItems.map((item) => (
                  <RouterNavLink
                    key={item.url}
                    to={item.url}
                    onClick={() => setMoreOpen(false)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${
                      isActive(item.url)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{item.title}</span>
                  </RouterNavLink>
                ))}
                {isAdmin && (
                  <RouterNavLink
                    to="/admin"
                    onClick={() => setMoreOpen(false)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${
                      location.pathname.startsWith("/admin")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Shield className="h-5 w-5" />
                    <span className="text-xs font-medium">Admin</span>
                  </RouterNavLink>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-lg border-t border-border md:hidden"
        style={{ height: "var(--tab-bar-height)" }}
      >
        <div className="flex items-center justify-around h-full px-2 max-w-lg mx-auto">
          {tabs.map((tab) => {
            if (tab.url === "#more") {
              return (
                <button
                  key="more"
                  onClick={() => setMoreOpen(true)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                    isMoreActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{tab.title}</span>
                </button>
              );
            }

            const active = isActive(tab.url);
            return (
              <RouterNavLink
                key={tab.url}
                to={tab.url}
                end={tab.url === "/"}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{tab.title}</span>
                {active && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </RouterNavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
