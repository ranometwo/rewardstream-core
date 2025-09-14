import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useSidebarStore } from "@/stores/sidebarStore";
import { Users, Trophy, Zap, TrendingUp, Settings, Bell, Award, Target, Gift, Star, PanelLeftClose, PanelLeftOpen, LucideIcon, ChevronDown, ChevronRight, BarChart3, Database, HardDrive } from "lucide-react";

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  children?: NavigationItem[];
}

interface ExpandedSections {
  [key: string]: boolean;
}

interface TextVisibility {
  showText: boolean;
  fadeText: boolean;
  iconSpacing: string;
  iconMargin: string;
}

const BREAKPOINTS = {
  ICON_ONLY: 30,
  NARROW_TEXT: 100,
  COMFORTABLE: 150,
} as const;

const SIDEBAR_CONFIG = {
  COLLAPSED_WIDTH: 30,
  EXPANDED_WIDTH: 150,
  CONTAINER_PADDING: 24,
  DEFAULT_SIZE: 15,
  MIN_SIZE: 3,
  MAX_SIZE: 25,
} as const;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(SIDEBAR_CONFIG.EXPANDED_WIDTH);
  const { expandedSections, toggleSection, initializeFromRoute } = useSidebarStore();
  const panelGroupRef = useRef<any>(null);
  const location = useLocation();

  // Derive collapsed state from width
  const sidebarCollapsed = useMemo(() => sidebarWidth <= 60, [sidebarWidth]);

  const handleLayoutChange = useCallback((sizes: number[]) => {
    const containerWidth = window.innerWidth - SIDEBAR_CONFIG.CONTAINER_PADDING;
    const actualPixelWidth = (sizes[0] / 100) * containerWidth;
    setSidebarWidth(actualPixelWidth);
  }, []);

  const toggleSidebar = useCallback(() => {
    const containerWidth = window.innerWidth - SIDEBAR_CONFIG.CONTAINER_PADDING;
    
    if (sidebarWidth <= 60) {
      // Currently collapsed, expand to 150px
      const targetPercentage = (SIDEBAR_CONFIG.EXPANDED_WIDTH / containerWidth) * 100;
      panelGroupRef.current?.setLayout([targetPercentage, 100 - targetPercentage]);
    } else {
      // Currently expanded, collapse to 30px
      const collapsedPercentage = (SIDEBAR_CONFIG.COLLAPSED_WIDTH / containerWidth) * 100;
      panelGroupRef.current?.setLayout([collapsedPercentage, 100 - collapsedPercentage]);
    }
  }, [sidebarWidth]);

  const textVisibility = useMemo((): TextVisibility => {
    if (sidebarWidth <= BREAKPOINTS.ICON_ONLY) {
      return { showText: false, fadeText: false, iconSpacing: 'justify-center', iconMargin: '' };
    }
    if (sidebarWidth < BREAKPOINTS.NARROW_TEXT) {
      return { showText: false, fadeText: false, iconSpacing: 'justify-center', iconMargin: '' };
    }
    if (sidebarWidth < BREAKPOINTS.COMFORTABLE) {
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
    { id: "rewards", label: "Rewards", icon: Gift, path: "/rewards" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
    { 
      id: "analytics", 
      label: "Analytics", 
      icon: Database, 
      path: "/analytics",
      children: [
        { id: "analytics-schemes", label: "Scheme Reports", icon: BarChart3, path: "/analytics/schemes" },
        { id: "analytics-users", label: "User Reports", icon: Users, path: "/analytics/users" },
        { id: "analytics-advanced", label: "Advanced", icon: Target, path: "/analytics/advanced" },
      ]
    },
    { 
      id: "data", 
      label: "Data Management", 
      icon: HardDrive, 
      path: "/data",
      children: [
        { id: "data-ingestion", label: "Data Ingestion", icon: TrendingUp, path: "/data/ingestion" },
        { id: "data-mapping", label: "Mapping Studio", icon: Settings, path: "/data/mapping" },
        { id: "data-validation", label: "Validation Center", icon: Trophy, path: "/data/validation" },
        { id: "data-monitoring", label: "Monitoring", icon: BarChart3, path: "/data/monitoring" },
        { id: "data-integrations", label: "Integrations", icon: Zap, path: "/data/integrations" },
        { id: "data-settings", label: "Settings", icon: Settings, path: "/data/settings" },
      ]
    },
  ], []);

  // Initialize sidebar state based on current route on app load
  useEffect(() => {
    initializeFromRoute(location.pathname);
  }, [initializeFromRoute, location.pathname]);

  const isItemActive = useCallback((item: NavigationItem): boolean => {
    if (item.children) {
      // For parent items with children, active if on exact path or any child is active
      return location.pathname === item.path || item.children.some(child => location.pathname === child.path);
    }
    return location.pathname === item.path;
  }, [location.pathname]);

  const NavButton = React.memo<{
    item: NavigationItem;
    isActive: boolean;
    isChild?: boolean;
    onToggle?: () => void;
  }>(({ item, isActive, isChild = false, onToggle }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = hasChildren && expandedSections[item.id];

    const handleClick = (e: React.MouseEvent) => {
      if (hasChildren && onToggle) {
        e.preventDefault();
        onToggle();
      }
      // If no children or no toggle handler, let the Link handle navigation
    };

    const buttonContent = (
      <Button
        variant={isActive ? "enterprise" : "ghost"}
        className={cn(
          "w-full transition-all duration-200",
          iconSpacing,
          isChild && "ml-4 text-sm",
          hasChildren && "justify-between"
        )}
        onClick={handleClick}
      >
        <div className={cn("flex items-center", iconSpacing === 'justify-center' ? 'justify-center' : '')}>
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
        </div>
        {hasChildren && showText && (
          <div className="flex-shrink-0 ml-2 p-1">
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 transition-transform duration-200" />
            ) : (
              <ChevronRight className="h-3 w-3 transition-transform duration-200" />
            )}
          </div>
        )}
      </Button>
    );

    // For items with children, don't navigate on click, just toggle
    if (hasChildren) {
      return buttonContent;
    }

    return (
      <Link to={item.path}>
        {buttonContent}
      </Link>
    );
  });

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
          <nav className="h-full overflow-y-auto">
            <div className="space-y-2 pt-4 px-2 pb-4">
              {navigationItems.map((item) => {
                const isActive = isItemActive(item);
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = hasChildren && expandedSections[item.id];
                
                return (
                  <div key={item.id}>
                    <NavButton
                      item={item}
                      isActive={isActive}
                      onToggle={hasChildren ? () => toggleSection(item.id) : undefined}
                    />
                    {hasChildren && isExpanded && showText && (
                      <div 
                        className="mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-out"
                        style={{
                          maxHeight: isExpanded ? `${item.children!.length * 40}px` : '0px'
                        }}
                      >
                        {item.children!.map((child) => (
                          <NavButton
                            key={child.id}
                            item={child}
                            isActive={location.pathname === child.path}
                            isChild={true}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </ResizablePanel>

        <ResizableHandle className="w-1 bg-border hover:bg-border/80" />

        <ResizablePanel defaultSize={85} minSize={50}>
          <main className="p-6 h-full overflow-auto">
            {children}
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Layout;