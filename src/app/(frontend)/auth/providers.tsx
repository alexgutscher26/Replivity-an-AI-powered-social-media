"use client";

import { authClient } from "@/server/auth/client";
import { api } from "@/trpc/react";
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Renders a component that provides social authentication providers to its children.
 * Fetches social auth providers using an API query and handles loading, error, and success states.
 * Logs errors and renders the AuthUIProviderTanstack with appropriate configurations.
 *
 * @param {React.ReactNode} children - The child components to render within the provider context.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { 
    data: providers = [], 
    error, 
    isLoading 
  } = api.settings.socialAuthProviders.useQuery(undefined, {
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Log errors when they occur
  if (error) {
    console.error("Failed to load social auth providers:", error);
  }

  // Handle loading state
  if (isLoading) {
    return (
      <AuthUIProviderTanstack
        authClient={authClient}
        rememberMe={true}
        navigate={(href: string) => router.push(href)}
        persistClient={false}
        replace={(href: string) => router.replace(href)}
        onSessionChange={() => router.refresh()}
        LinkComponent={(props: React.ComponentProps<typeof Link>) => (
          <Link {...props} href={props.href} />
        )}
        settingsUrl="/dashboard/settings/profile"
      >
        {children}
      </AuthUIProviderTanstack>
    );
  }

  // Handle error state - still render auth UI but without social providers
  if (error) {
    console.warn("Social auth providers unavailable, falling back to email/password only:", error.message);
  }

  return (
    <AuthUIProviderTanstack
      authClient={authClient}
      rememberMe={true}
      {...(providers.length > 0 && !error && { providers })}
      navigate={(href: string) => router.push(href)}
      persistClient={false}
      replace={(href: string) => router.replace(href)}
      onSessionChange={() => router.refresh()}
      LinkComponent={(props: React.ComponentProps<typeof Link>) => (
        <Link {...props} href={props.href} />
      )}
      settingsUrl="/dashboard/settings/profile"
    >
      {children}
    </AuthUIProviderTanstack>
  );
}
