
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";
import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "@/components/ui/motion";

export const AppLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      setIsAuthenticated(false);
    }
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden">
        {/* Background containers for gradient effect */}
        <div className="fixed inset-0 bg-background z-0" />
        
        <div className="relative flex flex-1 z-10 w-full">
          <Sidebar />
          <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 p-4 md:p-6 overflow-auto max-h-screen"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
