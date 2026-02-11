import {
  LayoutDashboard,
  Map,
  BookOpen,
  FileText,
  Code2,
  FileUser,
  MessageSquare,
  Briefcase,
  Upload,
  Bell,
  User,
  GraduationCap,
  Shield,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const learnItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Roadmaps", url: "/roadmaps", icon: Map },
  { title: "Learning", url: "/learning", icon: BookOpen },
  { title: "Notes & PYQs", url: "/notes", icon: FileText },
  { title: "Projects", url: "/projects", icon: Code2 },
];

const careerItems = [
  { title: "Resume", url: "/resume", icon: FileUser },
  { title: "Interview Prep", url: "/interview", icon: MessageSquare },
  { title: "Placements", url: "/placements", icon: Briefcase },
];

const accountItems = [
  { title: "My Uploads", url: "/uploads", icon: Upload },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { isAdmin, signOut } = useAuth();
  const isCollapsed = state === "collapsed";

  const renderGroup = (label: string, items: typeof learnItems) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase tracking-widest text-[10px] font-semibold">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl gradient-accent flex items-center justify-center shrink-0">
            <GraduationCap className="h-5 w-5 text-accent-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-display font-bold text-sidebar-accent-foreground text-base leading-tight">
                StudentOS
              </h2>
              <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-wider">Career System</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-2">
        {renderGroup("Learn", learnItems)}
        {renderGroup("Career", careerItems)}
        {renderGroup("Account", accountItems)}

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase tracking-widest text-[10px] font-semibold">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Admin Panel">
                    <NavLink
                      to="/admin"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <Shield className="h-4 w-4 shrink-0" />
                      <span>Admin Panel</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              onClick={signOut}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
