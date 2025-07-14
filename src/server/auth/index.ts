/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { configStore } from "@/server/auth/config-store";
import { getAuthSettingsFromDB } from "@/server/auth/creds";
import { db } from "@/server/db";
import { isFirstUser } from "@/server/utils";
import { type SocialProvider } from "@daveyplate/better-auth-ui";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

// Initialize auth settings before creating the auth instance
await getAuthSettingsFromDB();

// Helper to create provider config with validation
const createProviderConfig = (provider: SocialProvider) => ({
  get clientId() {
    const credentials = configStore.getProviderCredentials(provider);
    if (!credentials.clientId) {
      console.warn(`Missing clientId for social provider: ${provider}`);
      return "";
    }
    return credentials.clientId;
  },
  get clientSecret() {
    const credentials = configStore.getProviderCredentials(provider);
    if (!credentials.clientSecret) {
      console.warn(`Missing clientSecret for social provider: ${provider}`);
      return "";
    }
    return credentials.clientSecret;
  },
});

// Get enabled providers with validation
const enabledProviders = configStore.getEnabledProviders();

// Filter out providers with missing credentials
const validProviders = enabledProviders.filter((provider) => {
  const credentials = configStore.getProviderCredentials(provider);
  const isValid = credentials.clientId && credentials.clientSecret;
  if (!isValid) {
    console.warn(`Skipping social provider '${provider}' due to missing credentials`);
  }
  return isValid;
});

// Create social providers config object dynamically
const socialProvidersConfig = Object.fromEntries(
  validProviders.map((provider) => [
    provider,
    createProviderConfig(provider),
  ]),
);

// Common passwords list
const commonPasswords = [
  "password", "123456", "12345678", "qwerty", "abc123", "monkey", "1234567", 
  "letmein", "trustno1", "dragon", "baseball", "111111", "iloveyou", "master", 
  "sunshine", "ashley", "bailey", "passw0rd", "shadow", "123123", "654321", 
  "superman", "qazwsx", "michael", "football", "welcome", "jesus", "ninja", 
  "mustang", "password1", "123456789", "adobe123", "admin", "1234567890", 
  "photoshop", "1234", "12345", "princess", "azerty", "000000", "access", 
  "696969", "batman", "1qaz2wsx", "login", "qwertyuiop", "solo", "starwars", 
  "121212", "flower", "hottie", "loveme", "zaq1zaq1", "freedom", "whatever", 
  "666666", "!@#$%^&*", "charlie", "aa123456", "donald", "qwerty123", "secret"
];

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [nextCookies(), admin()],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 64,
    password: {
      validate: (password: string) => {
        // Check for uppercase letter
        if (!/[A-Z]/.test(password)) {
          return { valid: false, message: "Password must contain at least one uppercase letter" };
        }
        
        // Check for lowercase letter
        if (!/[a-z]/.test(password)) {
          return { valid: false, message: "Password must contain at least one lowercase letter" };
        }
        
        // Check for number
        if (!/\d/.test(password)) {
          return { valid: false, message: "Password must contain at least one number" };
        }
        
        // Check for special character
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
          return { valid: false, message: "Password must contain at least one special character" };
        }
        
        // Check for sequential characters
        if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/.test(password.toLowerCase())) {
          return { valid: false, message: "Password must not contain sequential characters" };
        }
        
        // Check for repeated characters
        if (/(.)\1{2,}/.test(password)) {
          return { valid: false, message: "Password must not contain repeated characters" };
        }
        
        // Check for common passwords
        if (commonPasswords.includes(password.toLowerCase())) {
          return { valid: false, message: "Password is too common and easily guessable" };
        }
        
        return { valid: true };
      }
    },
  },
  get trustedOrigins() {
    return configStore.getTrustedOrigins();
  },
  get secret() {
    return configStore.getSecret();
  },
  socialProviders: socialProvidersConfig,
  databaseHooks: {
    user: {
      create: {
        before: async (user: { [x: string]: any; source: any; }) => {
          type UserWithSource = { source?: string } & typeof user;

          const { source, ...userData } = user;

          if (source === "dashboard") {
            return { data: { ...userData, banned: false } };
          }

          return {
            data: {
              ...userData,
              role: (await isFirstUser()) ? "admin" : "user",
              banned: false,
            },
          };
        },
      },
    },
  },
});
