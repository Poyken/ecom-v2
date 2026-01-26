export declare enum SubscriptionPlan {
    STARTER = "starter",
    PROFESSIONAL = "professional",
    ENTERPRISE = "enterprise"
}
export declare class OnboardTenantDto {
    storeName: string;
    domain: string;
    plan: SubscriptionPlan;
    adminEmail: string;
    adminPassword: string;
}
