import { InvoiceItemRequest } from './invoice-item-request.model';

export interface InvoiceRequest {
  userId: number;
  recipientName: string;
  recipientEmail: string;
  description: string;
  dueDate: string; 
  items: InvoiceItemRequest[];
}
