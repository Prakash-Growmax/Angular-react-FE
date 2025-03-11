import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import React from 'react';
import { createRoot } from 'react-dom/client';

@Component({
  selector: 'app-dashboard-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wrapper">
      <h2>Angular-Hosted React Dashboard</h2>
      <div #reactContainer></div>
      <div *ngIf="error" class="error-message">
        <p>Error loading React Dashboard: {{ error }}</p>
      </div>
      <div *ngIf="loading">Loading React Dashboard...</div>
    </div>
  `,
  styles: [
    `
      .wrapper {
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 4px;
      }
      .error-message {
        color: red;
        padding: 10px;
        border: 1px solid red;
        border-radius: 4px;
        margin-top: 10px;
      }
    `,
  ],
})
export class DashboardWrapperComponent implements OnInit, OnDestroy {
  @ViewChild('reactContainer', { static: true }) containerRef!: ElementRef;
  private reactRoot: any = null;
  error: string | null = null;
  loading: boolean = true;

  async ngOnInit() {
    try {
      this.loading = true;

      // Load the remote Dashboard component using webpack's dynamic import
      const Dashboard = await import('reactDashboard/Dashboard');
      console.log(
        '🚀 ~ DashboardWrapperComponent ~ ngOnInit ~ Dashboard:',
        Dashboard
      );
      const ComponentToRender = Dashboard.default || Dashboard;

      // Create React root and render
      this.reactRoot = createRoot(this.containerRef.nativeElement);
      this.reactRoot.render(
        React.createElement(ComponentToRender, {
          fromAngular: true,
          timestamp: new Date().toISOString(),
        })
      );

      this.loading = false;
    } catch (error: any) {
      console.error('Error loading React component:', error);
      this.error = error.message || 'Unknown error occurred';
      this.loading = false;
    }
  }

  ngOnDestroy() {
    if (this.reactRoot) {
      this.reactRoot.unmount();
    }
  }
}
