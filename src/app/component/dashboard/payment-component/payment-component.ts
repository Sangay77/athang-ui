import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../../services/invoice.service';
import { PaymentService } from '../../../services/payment.service';
import { PaymentResponseService } from '../../../services/payment-response.service'; // <-- import
import { InvoiceRequest } from '../../../common/invoice-request.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment-component.html',
  styleUrls: ['./payment-component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PaymentComponent implements OnInit {
  invoiceId: number | null = null;
  invoice: InvoiceRequest | null = null;
  error: string | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // <-- inject Router
    private invoiceService: InvoiceService,
    private paymentService: PaymentService,
    private paymentResponseService: PaymentResponseService // <-- inject service
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const idParam = params.get('invoiceId');
      if (idParam) {
        this.invoiceId = +idParam;
        this.loadInvoice(this.invoiceId);
      } else {
        this.error = 'Invoice ID is missing in URL.';
      }
    });
  }

  loadInvoice(id: number) {
    this.loading = true;
    this.invoiceService.fetchInvoicById(id).subscribe({
      next: (data: InvoiceRequest) => {
        this.invoice = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load invoice.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  authorise() {
    if (!this.invoice || !this.invoiceId) return;

    this.loading = true;

    const totalAmount = this.invoice.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const description = this.invoice.description;

    this.paymentService.authorizePayment(this.invoiceId, totalAmount, description).subscribe({
      next: (response) => {
        console.log('Payment authorized successfully:', response);
        alert('Payment authorized successfully!');

        // Store response in shared service
        this.paymentResponseService.setResponse(response);

        // Navigate without query params
        this.router.navigate(['/dashboard/account-inquiry']);
      },
      error: (err) => {
        console.error('Authorization failed:', err);
        alert('Authorization failed. Please try again.');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  get totalAmount(): number {
    if (!this.invoice) return 0;
    return this.invoice.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  }
}
