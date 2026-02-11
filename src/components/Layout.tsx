import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { BottomTabBar } from "./BottomTabBar";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Desktop sidebar */}
        {!isMobile && <AppSidebar />}

        <main className="flex-1 flex flex-col min-h-screen">
          {/* Desktop header */}
          {!isMobile && (
            <header className="h-14 border-b border-border flex items-center px-4 bg-card/80 backdrop-blur-lg sticky top-0 z-20">
              <SidebarTrigger className="text-foreground" />
              <span className="ml-3 font-display font-bold text-foreground text-lg">StudentOS</span>
            </header>
          )}

          {/* Mobile header */}
          {isMobile && (
            <header className="h-14 border-b border-border flex items-center justify-center px-4 bg-card/80 backdrop-blur-lg sticky top-0 z-20">
              <span className="font-display font-bold text-foreground text-lg">StudentOS</span>
            </header>
          )}

          <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto pb-tab-bar">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom tabs */}
      {isMobile && <BottomTabBar />}
    </SidebarProvider>
  );
}
