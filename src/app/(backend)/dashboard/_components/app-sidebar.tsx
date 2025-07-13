"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "@/hooks/use-auth-hooks";
import { api } from "@/trpc/react";
import {
  ChartArea,
  Command,
  FileChartLine,
  ImageIcon,
  LayoutDashboard,
  LifeBuoy,
  PieChart,
  Settings2,
  Users2,
  Sparkles,
  Crown,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { type ComponentProps, useMemo } from "react";
import NavMain from "./nav-main";
import NavSecondary from "./nav-secondary";
import NavUser from "./nav-user";

interface NavItem {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  requireAdmin?: boolean;
}

interface SecondaryNavItem {
  title: string;
  url: string;
  icon: typeof LifeBuoy;
  dialog?: boolean;
}

interface SidebarData {
  navMain: NavItem[];
  navSecondary: SecondaryNavItem[];
}

const SIDEBAR_DATA: SidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "AI Caption Generator",
      url: "/dashboard/ai-caption-generator",
      icon: ImageIcon,
    },
    // {
    //   title: "Hashtag Generator",
    //   url: "/dashboard/hashtag-generator",
    //   icon: Hash,
    // },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: ChartArea,
      requireAdmin: true,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: FileChartLine,
      requireAdmin: true,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: PieChart,
      requireAdmin: true,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users2,
      requireAdmin: true,
    },
    {
      title: "Settings",
      url: "/dashboard/settings/account",
      icon: Settings2,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "support",
      icon: LifeBuoy,
      dialog: true,
    },
  ],
};

const DEFAULT_SITE_NAME = "Replier Social";
const DEFAULT_PLAN_NAME = "Free";

// Plan styling configuration
const getPlanStyling = (planName: string) => {
  const plan = planName.toLowerCase();
  
  if (plan.includes('pro') || plan.includes('premium')) {
    return {
      variant: 'default' as const,
      icon: Crown,
      className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0'
    };
  }
  
  if (plan.includes('enterprise') || plan.includes('business')) {
    return {
      variant: 'default' as const,
      icon: Sparkles,
      className: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0'
    };
  }
  
  return {
    variant: 'secondary' as const,
    icon: null,
    className: 'bg-muted/50 text-muted-foreground border-border/50'
  };
};

export default function AppSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  const { user } = useSession();
  const [siteSettings] = api.settings.site.useSuspenseQuery();
  const [currentPlan] = api.payments.getCurrentBilling.useSuspenseQuery();

  const filteredNavMain = useMemo(
    () =>
      SIDEBAR_DATA.navMain.filter(
        (item) => !item.requireAdmin || user?.role === "admin",
      ),
    [user?.role],
  );

  const siteName = siteSettings?.name ?? DEFAULT_SITE_NAME;
  const planName = currentPlan?.product?.name ?? DEFAULT_PLAN_NAME;
  const logoSrc = siteSettings?.logo ?? undefined;
  const planStyling = getPlanStyling(planName);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="border-b border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="group">
              <Link href="/" className="transition-all duration-200 hover:bg-accent/50">
                <div className="flex aspect-square size-10 items-center justify-center">
                  <Avatar className="h-10 w-10 shrink-0 rounded-xl ring-2 ring-border/20 transition-all duration-200 group-hover:ring-border/40">
                    <AvatarImage
                      src={logoSrc}
                      alt={`${siteName} logo`}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                      <Command className="size-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold text-foreground group-hover:text-primary transition-colors">
                    {siteName}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={planStyling.variant}
                      className={`text-xs font-medium px-2 py-0.5 ${planStyling.className}`}
                    >
                      {planStyling.icon && (
                        <planStyling.icon className="w-3 h-3 mr-1" />
                      )}
                      {planName}
                    </Badge>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <div className="py-2">
          <NavMain items={filteredNavMain} />
        </div>
        <div className="mt-auto pt-4 border-t border-border/50">
          <NavSecondary items={SIDEBAR_DATA.navSecondary} className="mt-auto" />
        </div>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/50 bg-muted/20">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}