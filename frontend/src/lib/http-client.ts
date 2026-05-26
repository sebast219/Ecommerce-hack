'use client';

/**
 * @deprecated Use `apiClient` from `./api-client` directly.
 * This module re-exports from api-client to maintain backward compatibility
 * for existing imports (admin-product-service, admin-user-service, admin-service, order-service).
 */
export { apiClient as httpClient, apiClient } from './api-client';
