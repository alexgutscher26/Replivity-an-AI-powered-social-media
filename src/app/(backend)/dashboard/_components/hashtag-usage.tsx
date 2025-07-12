"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Hash, TrendingUp } from "lucide-react";

/**
 * Renders a card displaying hashtag usage statistics.
 * Fetches data using `api.generations.getHashtagStats.useQuery` and displays either loading state or the actual stats.
 *
 * If data is still loading, it shows a loading message. Once loaded, it calculates the total number of hashtags
 * generated and the percentage change from the previous month, displaying these values with appropriate styling
 * based on whether the change is positive or negative.
 */
export default function HashtagUsage() {
  const { data: hashtagStats, isLoading } = api.generations.getHashtagStats.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hashtag Generation</CardTitle>
          <Hash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Loading...</div>
          <p className="text-xs text-muted-foreground">
            Calculating hashtag usage...
          </p>
        </CardContent>
      </Card>
    );
  }

  const total = hashtagStats?.total || 0;
  const percentageChange = hashtagStats?.percentageChange || 0;
  const isPositive = percentageChange >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Hashtag Generation</CardTitle>
        <Hash className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{total.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">
          <span className={`inline-flex items-center gap-1 ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}>
            <TrendingUp className="h-3 w-3" />
            {isPositive ? "+" : ""}{percentageChange.toFixed(1)}%
          </span>
          {" "}from last month
        </p>
      </CardContent>
    </Card>
  );
}
