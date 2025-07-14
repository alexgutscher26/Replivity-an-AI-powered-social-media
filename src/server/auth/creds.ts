import { configStore } from "@/server/auth/config-store";
import { db } from "@/server/db";
import { authSettingsSchema } from "@/utils/schema/settings";

export async function getAuthSettingsFromDB() {
  try {
    const settings = await db.query.settings.findFirst();
    const auth = authSettingsSchema.parse(settings?.general?.auth ?? {});

    // Validate that enabled providers have credentials
    const validatedAuth = {
      ...auth,
      enabledProviders: auth.enabledProviders.filter((provider) => {
        const credentials = auth.providerCredentials[provider];
        const isValid = credentials?.clientId && credentials?.clientSecret;
        if (!isValid && auth.enabledProviders.includes(provider)) {
          console.warn(`Provider '${provider}' is enabled but missing credentials, removing from enabled list`);
        }
        return isValid;
      }),
    };

    // Update the config store with validated values
    configStore.updateAuth(validatedAuth);
    return validatedAuth;
  } catch (error) {
    console.error("Failed to load settings from DB:", error);
    
    // Return safe defaults
    const defaultAuth = {
      secret: process.env.AUTH_SECRET ?? "",
      trustedOrigins: [],
      enabledProviders: [],
      providerCredentials: {},
    };
    
    configStore.updateAuth(defaultAuth);
    return defaultAuth;
  }
}
