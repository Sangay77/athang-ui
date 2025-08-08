import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceService } from '../../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.html',
  styleUrls: ['./invoice.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class InvoiceComponent implements OnInit {
  invoiceForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  createdInvoice: any = null;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.invoiceForm = this.fb.group({
      userId: [1, Validators.required], // This should come from auth later
      recipientName: ['', Validators.required],
      recipientEmail: ['', [Validators.required, Validators.email]],
      description: [''],
      dueDate: ['', Validators.required],
      items: this.fb.array([this.createItem()])
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  getTotalAmount(): number {
    return this.items.controls.reduce((acc, item) => {
      const qty = item.get('quantity')?.value || 0;
      const price = item.get('unitPrice')?.value || 0;
      return acc + qty * price;
    }, 0);
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      this.successMessage = '';
      this.errorMessage = '';

      const invoiceData = {
        ...this.invoiceForm.value,
        amount: this.getTotalAmount()
      };

      this.invoiceService.createInvoice(invoiceData).subscribe({
        next: (res) => {
          this.successMessage = '✅ Invoice created successfully!';
          this.createdInvoice = res;

          setTimeout(() => {
            this.router.navigate(['/dashboard/payment'], {
              queryParams: { invoiceId: res.id }
            });
          }, 1000);
        },
        error: (err) => {
          console.error('Error creating invoice:', err);
          this.errorMessage = '❌ Failed to create invoice. Please try again later.';
        },
        complete: () => {
          this.invoiceForm.reset();
          while (this.items.length !== 1) {
            this.items.removeAt(0);
          }
        }
      });
    } else {
      this.invoiceForm.markAllAsTouched();
      this.errorMessage = '❌ Form not valid! Please check the fields.';
    }
  }
}
