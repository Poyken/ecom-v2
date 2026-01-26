import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum SubscriptionPlan {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export class OnboardTenantDto {
  @ApiProperty({
    example: 'My Awesome Store',
    description: 'Display name of the store',
  })
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @ApiProperty({
    example: 'awesome-store',
    description: 'Unique domain slug for the tenant',
  })
  @IsString()
  @IsNotEmpty()
  domain: string;

  @ApiProperty({
    enum: SubscriptionPlan,
    example: SubscriptionPlan.PROFESSIONAL,
  })
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @ApiProperty({ example: 'admin@awesome.com' })
  @IsEmail()
  adminEmail: string;

  @ApiProperty({ example: 'Password123!', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  adminPassword: string;
}
