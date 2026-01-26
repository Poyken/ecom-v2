import { ConfigService } from '@nestjs/config';
export declare class VnpayService {
    private configService;
    private vnp_TmnCode;
    private vnp_HashSecret;
    private vnp_Url;
    private vnp_ReturnUrl;
    constructor(configService: ConfigService);
    createPaymentUrl(orderId: string, amount: number, ipAddr: string): string;
    private sortObject;
    private formatDate;
}
