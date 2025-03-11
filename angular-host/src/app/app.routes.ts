import { Routes } from '@angular/router';
import { DashboardWrapperComponent } from './dashboard-wrapper/dashboard-wrapper.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardWrapperComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
