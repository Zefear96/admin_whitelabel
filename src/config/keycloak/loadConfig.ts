// src/config/loadConfig.ts
import type { KeycloakTypes } from "../../types/keycloakTypes";

export async function loadConfig(): Promise<KeycloakTypes> {
  const mode = import.meta.env.VITE_MODE || "localhost";
  const res = await fetch("/keycloakConfig.json");

  if (!res.ok) throw new Error("Failed to load config.json");
  const allConfig = await res.json();
  const config = allConfig[mode];
  
  if (!config) throw new Error(`Config for mode "${mode}" not found`);
  return config;
}
