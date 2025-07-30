// invoice.component.ts
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


  constructor(private fb: FormBuilder, private invoiceService: InvoiceService,private router:Router) { }

  ngOnInit(): void {
    this.invoiceForm = this.fb.group({
      userId: [1, Validators.required],  // could be dynamic
      recipientName: ['', Validators.required],
      recipientEmail: ['', [Validators.required, Validators.email]],
      description: [''],
      dueDate: ['', Validators.required],
      items: this.fb.array([this.createItem()]) // at least one item to start
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
    });
  }

  get items() {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }
onSubmit() {
  if (this.invoiceForm.valid) {
    this.successMessage = '';
    this.errorMessage = '';

    this.invoiceService.createInvoice(this.invoiceForm.value).subscribe({
      next: (res) => {
        console.log('Invoice created successfully', res);
        this.successMessage = '✅ Invoice created successfully!';
        this.createdInvoice = res;

        // 🔁 Redirect to payment page with invoice ID or data (optional)
        setTimeout(() => {
          this.router.navigate(['/dashboard/payment'], {
            queryParams: { invoiceId: res.id } // optional: pass invoiceId
          });
        }, 1000); // small delay for user to see success message
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
    console.warn('Form not valid');
    this.invoiceForm.markAllAsTouched();
    this.errorMessage = '❌ Form not valid! Please check the fields.';
  }
}
}
