import { Component, inject, signal } from '@angular/core';
import { ElectronService } from './core/services/electron.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly electron = inject(ElectronService);
  protected readonly title = signal('AI Productivity Copilot');
}
