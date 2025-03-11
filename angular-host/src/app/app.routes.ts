import { Routes } from '@angular/router';
import { DashboardWrapperComponent } from './dashboard-wrapper/dashboard-wrapper.component';
import { StartupComponent } from './startup/startup.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardWrapperComponent },
  { path: '', component: StartupComponent },
];
