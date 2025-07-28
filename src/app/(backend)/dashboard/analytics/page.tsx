import { Separator } from "@/components/ui/separator";
import { getSession } from "@/server/utils";
import { redirect } from "next/navigation";
import AdvancedAnalyticsDashboard from "./_components/advanced-analytics-dashboard";

/**
 * Renders the AnalyticsPage component.
 *
 * This function first retrieves the user session and checks if the user has an "admin" role.
 * If the user is not an admin, they are redirected to the "/dashboard" page.
 * If the user is an admin, it renders a container with a title and description,
 * followed by a separator and the AdvancedAnalyticsDashboard component.
 */
export default async function AnalyticsPage() {
  const session = await getSession();

  if (session?.user?.role !== "admin") {
    return redirect("/dashboard");
  }

  return (
    <div className="flex-1 space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Advanced Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Comprehensive analytics and insights for your AI social media platform.
        </p>
      </div>
      <Separator />
      <AdvancedAnalyticsDashboard />
    </div>
  );
}
