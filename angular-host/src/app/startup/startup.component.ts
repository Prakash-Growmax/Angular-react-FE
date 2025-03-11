import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-startup',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.css'],
})
export class StartupComponent {
  title = 'Welcome to Micro Frontend Demo';
}
