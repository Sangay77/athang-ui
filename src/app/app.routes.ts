import { Routes } from '@angular/router';
import { DashBoardComponent } from './component/dashboard/dashboard';
import { BookingsComponent } from './component/dashboard/booking/booking';
import { ProfileComponent } from './component/dashboard/profile/profile';
import { LoginComponent } from './component/login/login';
import { Oauth2RedirectComponent } from './oauth2-redirect/oauth2-redirect';
import { InvoiceComponent } from './component/dashboard/invoice/invoice';
import { PaymentComponent } from './component/dashboard/payment-component/payment-component';
import { AccountInquiryComponent } from './component/dashboard/account-inquiry.component/account-inquiry.component';
import { DebitRequestComponent } from './component/dashboard/debit-request.component/debit-request.component';
import { InvoiceSummaryComponent } from './component/dashboard/invoice-summary.component/invoice-summary.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'oauth2/redirect', component: Oauth2RedirectComponent },

  {
    path: 'dashboard',
    component: DashBoardComponent,
    children: [
      { path: 'bookings', component: BookingsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'invoice', component: InvoiceComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'account-inquiry', component: AccountInquiryComponent },
      { path: 'debit-request', component: DebitRequestComponent },
      { path: 'invoice-summary', component: InvoiceSummaryComponent }


    ]
  }];
