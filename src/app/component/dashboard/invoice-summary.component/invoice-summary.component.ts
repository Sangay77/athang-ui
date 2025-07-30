import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-invoice-summary',
  templateUrl: './invoice-summary.component.html',
  styleUrls: ['./invoice-summary.component.css'],
  imports: [CommonModule]
})
export class InvoiceSummaryComponent implements OnInit {
  invoiceData: any;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.invoiceData = nav?.extras?.state?.['data'];
  }

  ngOnInit(): void {
    if (!this.invoiceData) {
      // fallback if data is not passed or user navigates directly
      this.router.navigate(['/']);
    }
  }

  downloadPDF(): void {
  const content = document.getElementById('invoiceContent');
  if (!content) return;

  html2canvas(content).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('invoice-summary.pdf');
  });
}
}
