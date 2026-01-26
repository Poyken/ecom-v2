import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as queryString from 'qs';

@Injectable()
export class VnpayService {
  private vnp_TmnCode: string;
  private vnp_HashSecret: string;
  private vnp_Url: string;
  private vnp_ReturnUrl: string;

  constructor(private configService: ConfigService) {
    this.vnp_TmnCode = this.configService.get<string>('VNP_TMN_CODE') || 'TMNCODE_MOCK';
    this.vnp_HashSecret = this.configService.get<string>('VNP_HASH_SECRET') || 'SECRET_MOCK';
    this.vnp_Url = this.configService.get<string>('VNP_URL') || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    this.vnp_ReturnUrl = this.configService.get<string>('VNP_RETURN_URL') || 'http://localhost:3000/checkout/success';
  }

  createPaymentUrl(orderId: string, amount: number, ipAddr: string): string {
    const date = new Date();
    const createDate = this.formatDate(date);
    
    const vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: 'Thanh toan don hang ' + orderId,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // VNPay expects amount in cent-like format (x100)
      vnp_ReturnUrl: this.vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    // Sort params alphabetically
    const sortedParams = this.sortObject(vnp_Params);
    
    const signData = queryString.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    sortedParams['vnp_SecureHash'] = signed;
    
    return this.vnp_Url + '?' + queryString.stringify(sortedParams, { encode: false });
  }

  private sortObject(obj: any) {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = obj[key];
    });
    return sorted;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`;
  }
}
