import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExpandedSections {
  [key: string]: boolean;
}

interface SidebarStore {
  expandedSections: ExpandedSections;
  toggleSection: (sectionId: string) => void;
  setExpanded: (sectionId: string, isExpanded: boolean) => void;
  initializeFromRoute: (pathname: string) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set, get) => ({
      expandedSections: {},
      
      toggleSection: (sectionId: string) => {
        set((state) => ({
          expandedSections: {
            ...state.expandedSections,
            [sectionId]: !state.expandedSections[sectionId]
          }
        }));
      },
      
      setExpanded: (sectionId: string, isExpanded: boolean) => {
        set((state) => ({
          expandedSections: {
            ...state.expandedSections,
            [sectionId]: isExpanded
          }
        }));
      },
      
      initializeFromRoute: (pathname: string) => {
        const { expandedSections } = get();
        
        // Auto-expand parent section only if not explicitly set by user
        const shouldAutoExpand = (sectionId: string, routePrefix: string) => {
          return pathname.startsWith(routePrefix) && expandedSections[sectionId] === undefined;
        };
        
        const updates: ExpandedSections = {};
        
        if (shouldAutoExpand('analytics', '/analytics')) {
          updates.analytics = true;
        }
        if (shouldAutoExpand('data', '/data')) {
          updates.data = true;
        }
        
        if (Object.keys(updates).length > 0) {
          set((state) => ({
            expandedSections: {
              ...state.expandedSections,
              ...updates
            }
          }));
        }
      }
    }),
    {
      name: 'sidebar-state',
      // Only persist the expanded sections, not functions
      partialize: (state) => ({ expandedSections: state.expandedSections })
    }
  )
);