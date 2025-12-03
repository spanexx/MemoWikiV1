import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'MemoWiki Dashboard';

  navItems = [
    { path: '/overview', icon: '📊', label: 'Overview' },
    { path: '/documentation', icon: '📁', label: 'Documentation' },
    { path: '/summaries', icon: '📅', label: 'Summaries' },
    { path: '/settings', icon: '⚙️', label: 'Settings' }
  ];
}
