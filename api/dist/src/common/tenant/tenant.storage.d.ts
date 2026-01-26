import { AsyncLocalStorage } from 'async_hooks';
export interface TenantContext {
    tenantId: string;
}
export declare const tenantStorage: AsyncLocalStorage<TenantContext>;
