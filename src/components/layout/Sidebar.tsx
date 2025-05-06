
import { Calendar, Heart, Plus, Smile } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Today",
    path: "/",
    icon: Smile,
  },
  {
    title: "Habits",
    path: "/habits",
    icon: Plus,
  },
  {
    title: "Journal",
    path: "/journal",
    icon: Calendar,
  },
  {
    title: "Affirmations",
    path: "/affirmations",
    icon: Heart,
  }
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <SidebarComponent>
      <SidebarHeader>
        <div className="px-3 py-4 flex items-center">
          <SidebarTrigger className="p-0 mr-2 h-9 w-9"/>
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-serif text-2xl font-medium bg-gradient-to-r from-serene-600 to-calm-600 bg-clip-text text-transparent">
              SereniFlow
            </span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className={cn(
                        "flex items-center space-x-2 rounded-md px-3 py-2 w-full",
                        location.pathname === item.path ? 
                          "bg-accent text-accent-foreground" : 
                          "hover:bg-muted transition-colors"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="py-4 px-3">
        <p className="text-xs text-muted-foreground">SereniFlow v1.0</p>
      </SidebarFooter>
    </SidebarComponent>
  );
};
