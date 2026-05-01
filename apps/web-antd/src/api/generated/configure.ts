/**
 * Generated API Configuration
 * This file configures the auto-generated API client to work with the existing request infrastructure.
 */
import { useAccessStore } from '@vben/stores';

import { OpenAPI } from './core/OpenAPI';

/**
 * Configure the generated OpenAPI client
 * - Set BASE URL (empty because Vite proxy handles routing)
 * - Set TOKEN resolver that reads from accessStore
 */
export function configureGeneratedApi() {
  // Base URL is handled by Vite proxy (/api -> http://localhost:8000)
  OpenAPI.BASE = '';

  // Token resolver - dynamically get token from store
  // Note: The resolver must return Promise<string>, so we return empty string if no token
  OpenAPI.TOKEN = async (): Promise<string> => {
    const accessStore = useAccessStore();
    return accessStore.accessToken ?? '';
  };

  // Enable credentials for cookie-based auth if needed
  OpenAPI.WITH_CREDENTIALS = true;
  OpenAPI.CREDENTIALS = 'include';
}

// Re-export OpenAPI for direct configuration
export { OpenAPI } from './core/OpenAPI';
export type { OpenAPIConfig } from './core/OpenAPI';
// Export services for convenient access
export { AdminServiceService } from './services/AdminServiceService';
export { AuthServiceService } from './services/AuthServiceService';
export { SseServiceService } from './services/SseServiceService';
export { UploadServiceService } from './services/UploadServiceService';
export { UserServiceService } from './services/UserServiceService';
