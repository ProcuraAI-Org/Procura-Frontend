import { ReactNode } from "react";
import { useSidebar } from "../../context/SidebarContext";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <main
      className={`transition-all duration-300 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 ${
        isCollapsed ? "lg:ml-20" : "lg:ml-64"
      } ${className}`}
    >
      {children}
    </main>
  );
}