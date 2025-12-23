import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Language, resumeData } from './resume-data';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly lang = signal<Language>('nl');
  readonly data = computed(() => resumeData[this.lang()]);
  readonly expandedId = signal<string | null>(null);

  setLanguage(lang: Language): void {
    this.lang.set(lang);
  }

  toggleExperience(id: string): void {
    this.expandedId.update((current) => (current === id ? null : id));
  }

  isExpanded(id: string): boolean {
    return this.expandedId() === id;
  }
}
