import React, { useState, useRef, useCallback, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Users, Trophy, Zap, TrendingUp, Settings, Bell, Award, Target, Gift, Star, PanelLeftClose, PanelLeftOpen, LucideIcon } from "lucide-react";

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

interface TextVisibility {
  showText: boolean;
  fadeText: boolean;
  iconSpacing: string;
  iconMargin: string;
}

const BREAKPOINTS = {
  ICON_ONLY: 40,
  NARROW_TEXT: 180,
  COMFORTABLE: 200,
  MOBILE: 768,
  TABLET: 1024,
} as const;

const SIDEBAR_CONFIG = {
  COLLAPSED_WIDTH: 40,
  EXPANDED_WIDTH: 180,
  CONTAINER_PADDING: 24,
  DEFAULT_SIZE: 23,
  MIN_SIZE: 4,
  MAX_SIZE: 40,
} as const;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const panelGroupRef = useRef<any>(null);
  const location = useLocation();

  const handleLayoutChange = useCallback((sizes: number[]) => {
    const containerWidth = window.innerWidth - SIDEBAR_CONFIG.CONTAINER_PADDING;
    const actualPixelWidth = (sizes[0] / 100) * containerWidth;

    setSidebarWidth(actualPixelWidth);

    const shouldBeCollapsed = actualPixelWidth <= BREAKPOINTS.ICON_ONLY;

    if (shouldBeCollapsed !== sidebarCollapsed) {
      setSidebarCollapsed(shouldBeCollapsed);

      if (shouldBeCollapsed && panelGroupRef.current) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            const collapsedPercentage = (SIDEBAR_CONFIG.COLLAPSED_WIDTH / containerWidth) * 100;
            panelGroupRef.current?.setLayout([collapsedPercentage, 100 - collapsedPercentage]);
          }, 16);
        });
      }
    }
  }, [sidebarCollapsed]);

  const toggleSidebar = useCallback(() => {
    const containerWidth = window.innerWidth - SIDEBAR_CONFIG.CONTAINER_PADDING;

    if (sidebarCollapsed) {
      const targetPercentage = Math.min((SIDEBAR_CONFIG.EXPANDED_WIDTH / containerWidth) * 100, 35);
      setSidebarWidth(SIDEBAR_CONFIG.EXPANDED_WIDTH);
      setSidebarCollapsed(false);

      requestAnimationFrame(() => {
        setTimeout(() => {
          panelGroupRef.current?.setLayout?.([targetPercentage, 100 - targetPercentage]);
        }, 20);
      });
    } else {
      const collapsedPercentage = (SIDEBAR_CONFIG.COLLAPSED_WIDTH / containerWidth) * 100;
      setSidebarWidth(SIDEBAR_CONFIG.COLLAPSED_WIDTH);
      setSidebarCollapsed(true);

      requestAnimationFrame(() => {
        setTimeout(() => {
          panelGroupRef.current?.setLayout?.([collapsedPercentage, 100 - collapsedPercentage]);
        }, 20);
      });
    }
  }, [sidebarCollapsed]);

  const textVisibility = useMemo((): TextVisibility => {
    if (sidebarWidth < BREAKPOINTS.ICON_ONLY) {
      return { showText: false, fadeText: false, iconSpacing: 'justify-center', iconMargin: '' };
    }
    if (sidebarWidth < BREAKPOINTS.NARROW_TEXT) {
      return { showText: true, fadeText: true, iconSpacing: 'justify-start', iconMargin: 'mr-2' };
    }
    return { showText: true, fadeText: false, iconSpacing: 'justify-start', iconMargin: 'mr-2' };
  }, [sidebarWidth]);

  const { showText, fadeText, iconSpacing, iconMargin } = textVisibility;

  const navigationItems = useMemo((): NavigationItem[] => [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp, path: "/" },
    { id: "schemes", label: "Schemes", icon: Zap, path: "/schemes" },
    { id: "users", label: "Users", icon: Users, path: "/users" },
    { id: "rules", label: "Rules", icon: Target, path: "/rules" },
    { id: "reports", label: "Reports", icon: Award, path: "/reports" },
    { id: "rewards", label: "Rewards", icon: Gift, path: "/rewards" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
    { id: "analytics", label: "Analytics", icon: TrendingUp, path: "/analytics" },
  ], []);

  const NavButton = React.memo<{
    item: NavigationItem;
    isActive: boolean;
  }>(({ item, isActive }) => (
    <Link to={item.path}>
      <Button
        variant={isActive ? "enterprise" : "ghost"}
        className={`w-full transition-all duration-200 ${iconSpacing}`}
      >
        <item.icon className={`h-4 w-4 flex-shrink-0 ${iconMargin}`} />
        {showText && (
          <span
            className={cn(
              "truncate transition-opacity duration-200",
              fadeText && "opacity-70"
            )}
            style={fadeText ? {
              maskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent 100%)'
            } : {}}
          >
            {item.label}
          </span>
        )}
      </Button>
    </Link>
  ));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Trophy className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Loyalty Engine</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-6 w-6 hover:bg-accent ml-2 transition-all duration-200 hover:scale-110"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[calc(100vh-4rem)]"
        onLayout={handleLayoutChange}
        ref={panelGroupRef}
      >
        <ResizablePanel
          defaultSize={SIDEBAR_CONFIG.DEFAULT_SIZE}
          minSize={SIDEBAR_CONFIG.MIN_SIZE}
          maxSize={SIDEBAR_CONFIG.MAX_SIZE}
          className="border-r border-border bg-card/30 backdrop-blur-sm"
        >
          <nav className="h-full">
            <div className="space-y-2 pt-4 px-2">
              {navigationItems.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  isActive={location.pathname === item.path}
                />
              ))}
            </div>
          </nav>
        </ResizablePanel>

        <ResizableHandle className="w-1 bg-border hover:bg-border/80 transition-colors duration-200" />

        <ResizablePanel defaultSize={77} minSize={50}>
          <main className="p-6 h-full overflow-auto">
            {children}
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Layout;