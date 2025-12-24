import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Language, resumeData } from './resume-data';
import { TileCandyOverload } from './tiles/candy-overload.component';
import { TileGlitchCollapse } from './tiles/glitch-collapse.component';
import { TileHyperlane } from './tiles/hyperlane-racer.component';
import { TileManaBloom } from './tiles/mana-boom-rpg.component';
import { TileQuantumRift } from './tiles/quantum-rift.component';
import { TileSentientOS } from './tiles/sentient-os.component';
import { ExpandableTileComponent } from './tiles/expandable-tile.component';
import { CandyPreloaderComponent } from './tiles/candy-preloader.component';
import { CinematicLoaderComponent } from './tiles/cinematic-loader.component';

type SectionKey = 'overview' | 'experience' | 'skills' | 'courses';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    TileCandyOverload,
    TileGlitchCollapse,
    TileHyperlane,
    TileManaBloom,
    TileQuantumRift,
    TileSentientOS,
    ExpandableTileComponent,
    CandyPreloaderComponent,
    CinematicLoaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly lang = signal<Language>('nl');
  readonly data = computed(() => resumeData[this.lang()]);
  readonly expandedId = signal<string | null>(null);
  readonly searchQuery = signal('');
  readonly filtersOpen = signal(false);
  readonly adsHidden = signal(false);
  readonly adsBypass = signal(false);
  readonly sectionFilters = signal<Record<SectionKey, boolean>>({
    overview: true,
    experience: true,
    skills: true,
    courses: true
  });

  constructor() {
    document.body.classList.remove('tiles-expanded');
  }

  readonly filteredOverview = computed(() => {
    const query = this.normalize(this.searchQuery());
    const items = this.data().overview.items;
    if (!query) {
      return items;
    }
    return items.filter((item) => this.matches(query, item.company, item.role, item.period));
  });

  readonly filteredExperience = computed(() => {
    const query = this.normalize(this.searchQuery());
    const items = this.data().experience.items;
    if (!query) {
      return items;
    }
    return items.filter((item) =>
      this.matches(
        query,
        item.company,
        item.role,
        item.period,
        item.responsibilities,
        item.environment
      )
    );
  });

  readonly filteredSkills = computed(() => {
    const query = this.normalize(this.searchQuery());
    const groups = this.data().skills.groups;
    if (!query) {
      return groups;
    }
    return groups
      .map((group) => {
        const matchingItems = group.items.filter((item) => this.matches(query, item));
        if (this.matches(query, group.title)) {
          return { ...group, items: group.items };
        }
        return { ...group, items: matchingItems };
      })
      .filter((group) => group.items.length > 0);
  });

  readonly filteredCourses = computed(() => {
    const query = this.normalize(this.searchQuery());
    const items = this.data().courses.items;
    if (!query) {
      return items;
    }
    return items.filter((item) => this.matches(query, item));
  });

  downloadPdf(): void {
    this.triggerDownload('/CVYuriVaillant07112025.pdf', this.getFileName('pdf'));
  }

  downloadTxt(): void {
    const content = this.buildPlainText();
    this.downloadBlob(content, 'text/plain', this.getFileName('txt'));
  }

  downloadMd(): void {
    const content = this.buildMarkdown();
    this.downloadBlob(content, 'text/markdown', this.getFileName('md'));
  }

  downloadDocx(): void {
    const blob = this.buildDocx();
    this.downloadBlob(
      blob,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      this.getFileName('docx')
    );
  }

  setLanguage(lang: Language): void {
    this.lang.set(lang);
  }

  setSearch(value: string): void {
    this.searchQuery.set(value);
    this.scrollToRelevantSection();
  }

  toggleFiltersOpen(): void {
    this.filtersOpen.update((value) => !value);
  }

  toggleAds(): void {
    this.adsHidden.update((value) => !value);
    if (this.adsHidden()) {
      this.adsBypass.set(false);
    }
  }

  toggleAdsBypass(): void {
    this.adsBypass.update((value) => !value);
  }

  toggleSection(key: SectionKey): void {
    this.sectionFilters.update((current) => ({ ...current, [key]: !current[key] }));
    this.scrollToRelevantSection();
  }

  isSectionVisible(key: SectionKey): boolean {
    return this.sectionFilters()[key];
  }

  toggleExperience(id: string): void {
    this.expandedId.update((current) => (current === id ? null : id));
  }

  isExpanded(id: string): boolean {
    return this.expandedId() === id;
  }

  private normalize(value: string): string {
    return value.trim().toLowerCase();
  }

  private matches(query: string, ...values: string[]): boolean {
    return values.some((value) => value.toLowerCase().includes(query));
  }

  private scrollToRelevantSection(): void {
    const order: Array<{ key: SectionKey; id: string; hasResults: boolean }> = [
      { key: 'overview', id: 'section-overview', hasResults: this.filteredOverview().length > 0 },
      { key: 'experience', id: 'section-experience', hasResults: this.filteredExperience().length > 0 },
      { key: 'skills', id: 'section-skills', hasResults: this.filteredSkills().length > 0 },
      { key: 'courses', id: 'section-courses', hasResults: this.filteredCourses().length > 0 }
    ];

    const target = order.find(
      (entry) => this.isSectionVisible(entry.key) && entry.hasResults
    );

    if (!target) {
      return;
    }

    requestAnimationFrame(() => {
      const element = document.getElementById(target.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  private getFileName(extension: string): string {
    const base = `Yuri_Vaillant_CV_${this.lang()}`;
    return `${base}.${extension}`;
  }

  private triggerDownload(url: string, filename: string): void {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = 'noopener';
    anchor.click();
  }

  private downloadBlob(content: string | Blob, mimeType: string, filename: string): void {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    this.triggerDownload(url, filename);
    URL.revokeObjectURL(url);
  }

  private buildPlainText(): string {
    const data = this.data();
    const lines: string[] = [];
    lines.push(data.personalia.name);
    lines.push(data.personalia.title);
    lines.push(data.personalia.location);
    lines.push('');
    lines.push(`${data.labels.personalia}`);
    lines.push(`${data.labels.facts.birthDate}: ${data.personalia.birthDate}`);
    lines.push(`${data.labels.facts.nationality}: ${data.personalia.nationality}`);
    lines.push(`${data.labels.facts.experienceSince}: ${data.personalia.experienceSince}`);
    lines.push(`${data.labels.facts.maritalStatus}: ${data.personalia.maritalStatus}`);
    lines.push('');
    lines.push(data.labels.profile);
    lines.push(...data.profile.paragraphs);
    lines.push('');
    lines.push(data.labels.overview);
    data.overview.items.forEach((item) => {
      lines.push(`${item.period} - ${item.company} - ${item.role}`);
    });
    lines.push('');
    lines.push(data.labels.experience);
    data.experience.items.forEach((item) => {
      lines.push(`${item.period} - ${item.company} - ${item.role}`);
      lines.push(`${data.labels.responsibilities}: ${item.responsibilities}`);
      lines.push(`${data.labels.environment}: ${item.environment}`);
      lines.push('');
    });
    lines.push(data.labels.skills);
    data.skills.groups.forEach((group) => {
      lines.push(`${group.title}: ${group.items.join(', ')}`);
    });
    lines.push('');
    lines.push(data.labels.courses);
    data.courses.items.forEach((course) => lines.push(`- ${course}`));
    return lines.join('\n');
  }

  private buildMarkdown(): string {
    const data = this.data();
    const lines: string[] = [];
    lines.push(`# ${data.personalia.name}`);
    lines.push(`**${data.personalia.title}**`);
    lines.push(`${data.personalia.location}`);
    lines.push('');
    lines.push(`## ${data.labels.personalia}`);
    lines.push(`- ${data.labels.facts.birthDate}: ${data.personalia.birthDate}`);
    lines.push(`- ${data.labels.facts.nationality}: ${data.personalia.nationality}`);
    lines.push(`- ${data.labels.facts.experienceSince}: ${data.personalia.experienceSince}`);
    lines.push(`- ${data.labels.facts.maritalStatus}: ${data.personalia.maritalStatus}`);
    lines.push('');
    lines.push(`## ${data.labels.profile}`);
    data.profile.paragraphs.forEach((paragraph) => lines.push(paragraph));
    lines.push('');
    lines.push(`## ${data.labels.overview}`);
    data.overview.items.forEach((item) => {
      lines.push(`- ${item.period} — ${item.company} — ${item.role}`);
    });
    lines.push('');
    lines.push(`## ${data.labels.experience}`);
    data.experience.items.forEach((item) => {
      lines.push(`### ${item.company} (${item.period})`);
      lines.push(`_${item.role}_`);
      lines.push(`- ${data.labels.responsibilities}: ${item.responsibilities}`);
      lines.push(`- ${data.labels.environment}: ${item.environment}`);
    });
    lines.push('');
    lines.push(`## ${data.labels.skills}`);
    data.skills.groups.forEach((group) => {
      lines.push(`- **${group.title}**: ${group.items.join(', ')}`);
    });
    lines.push('');
    lines.push(`## ${data.labels.courses}`);
    data.courses.items.forEach((course) => lines.push(`- ${course}`));
    return lines.join('\n');
  }

  private buildDocx(): Blob {
    const data = this.data();
    const lines: string[] = [];
    lines.push(data.personalia.name);
    lines.push(data.personalia.title);
    lines.push(data.personalia.location);
    lines.push('');
    lines.push(data.labels.personalia);
    lines.push(`${data.labels.facts.birthDate}: ${data.personalia.birthDate}`);
    lines.push(`${data.labels.facts.nationality}: ${data.personalia.nationality}`);
    lines.push(`${data.labels.facts.experienceSince}: ${data.personalia.experienceSince}`);
    lines.push(`${data.labels.facts.maritalStatus}: ${data.personalia.maritalStatus}`);
    lines.push('');
    lines.push(data.labels.profile);
    lines.push(...data.profile.paragraphs);
    lines.push('');
    lines.push(data.labels.overview);
    data.overview.items.forEach((item) => {
      lines.push(`${item.period} - ${item.company} - ${item.role}`);
    });
    lines.push('');
    lines.push(data.labels.experience);
    data.experience.items.forEach((item) => {
      lines.push(`${item.period} - ${item.company} - ${item.role}`);
      lines.push(`${data.labels.responsibilities}: ${item.responsibilities}`);
      lines.push(`${data.labels.environment}: ${item.environment}`);
      lines.push('');
    });
    lines.push(data.labels.skills);
    data.skills.groups.forEach((group) => {
      lines.push(`${group.title}: ${group.items.join(', ')}`);
    });
    lines.push('');
    lines.push(data.labels.courses);
    data.courses.items.forEach((course) => lines.push(course));

    const docXml = this.buildDocxDocument(lines);
    const contentTypes = `<?xml version="1.0" encoding="UTF-8"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\n  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>\n  <Default Extension="xml" ContentType="application/xml"/>\n  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>\n</Types>`;
    const rels = `<?xml version="1.0" encoding="UTF-8"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>\n</Relationships>`;

    const files = [
      { name: '[Content_Types].xml', data: new TextEncoder().encode(contentTypes) },
      { name: '_rels/.rels', data: new TextEncoder().encode(rels) },
      { name: 'word/document.xml', data: new TextEncoder().encode(docXml) }
    ];

    return this.buildZip(files);
  }

  private buildDocxDocument(lines: string[]): string {
    const paragraphs = lines
      .map((line) => `<w:p><w:r><w:t>${this.escapeXml(line)}</w:t></w:r></w:p>`)
      .join('');
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs}</w:body></w:document>`;
  }

  private escapeXml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private buildZip(files: Array<{ name: string; data: Uint8Array }>): Blob {
    const encoder = new TextEncoder();
    const fileRecords: Array<{
      nameBytes: Uint8Array;
      data: Uint8Array;
      crc: number;
      offset: number;
    }> = [];

    let offset = 0;
    const localParts: Uint8Array[] = [];

    files.forEach((file) => {
      const nameBytes = encoder.encode(file.name);
      const data = file.data;
      const crc = this.crc32(data);
      const localHeader = this.buildLocalHeader(crc, data.length, nameBytes.length);
      localParts.push(localHeader, nameBytes, data);
      fileRecords.push({ nameBytes, data, crc, offset });
      offset += localHeader.length + nameBytes.length + data.length;
    });

    const centralParts: Uint8Array[] = [];
    let centralSize = 0;
    fileRecords.forEach((record) => {
      const centralHeader = this.buildCentralHeader(
        record.crc,
        record.data.length,
        record.nameBytes.length,
        record.offset
      );
      centralParts.push(centralHeader, record.nameBytes);
      centralSize += centralHeader.length + record.nameBytes.length;
    });

    const end = this.buildEndRecord(fileRecords.length, centralSize, offset);
    const parts = [...localParts, ...centralParts, end];
    return new Blob(parts, { type: 'application/zip' });
  }

  private buildLocalHeader(crc: number, size: number, nameLength: number): Uint8Array {
    const buffer = new ArrayBuffer(30);
    const view = new DataView(buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, size, true);
    view.setUint32(22, size, true);
    view.setUint16(26, nameLength, true);
    view.setUint16(28, 0, true);
    return new Uint8Array(buffer);
  }

  private buildCentralHeader(
    crc: number,
    size: number,
    nameLength: number,
    offset: number
  ): Uint8Array {
    const buffer = new ArrayBuffer(46);
    const view = new DataView(buffer);
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint16(14, 0, true);
    view.setUint32(16, crc, true);
    view.setUint32(20, size, true);
    view.setUint32(24, size, true);
    view.setUint16(28, nameLength, true);
    view.setUint16(30, 0, true);
    view.setUint16(32, 0, true);
    view.setUint16(34, 0, true);
    view.setUint16(36, 0, true);
    view.setUint32(38, 0, true);
    view.setUint32(42, offset, true);
    return new Uint8Array(buffer);
  }

  private buildEndRecord(entryCount: number, centralSize: number, centralOffset: number): Uint8Array {
    const buffer = new ArrayBuffer(22);
    const view = new DataView(buffer);
    view.setUint32(0, 0x06054b50, true);
    view.setUint16(4, 0, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, entryCount, true);
    view.setUint16(10, entryCount, true);
    view.setUint32(12, centralSize, true);
    view.setUint32(16, centralOffset, true);
    view.setUint16(20, 0, true);
    return new Uint8Array(buffer);
  }

  private crc32(data: Uint8Array): number {
    let crc = 0xffffffff;
    for (let i = 0; i < data.length; i += 1) {
      crc ^= data[i];
      for (let j = 0; j < 8; j += 1) {
        const mask = -(crc & 1);
        crc = (crc >>> 1) ^ (0xedb88320 & mask);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }
}
