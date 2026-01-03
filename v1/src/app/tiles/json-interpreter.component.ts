import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';

type JsonNodeView = 'list' | 'detail';
type JsonNodeLayout = 'single' | 'two-column';
type JsonNodeType =
  | 'object'
  | 'array'
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'unknown'
  | 'cycle'
  | 'truncated';

interface JsonNode {
  id: string;
  key: string | null;
  type: JsonNodeType;
  typeLabel: string;
  preview: string;
  depth: number;
  view: JsonNodeView;
  layout: JsonNodeLayout;
  children: JsonNode[];
  size: number;
  hiddenCount: number;
  expandable: boolean;
  cyclePath?: string;
}

const DEFAULT_SAMPLE = `{
  "project": "Resume Portal",
  "status": "prototype",
  "sections": ["overview", "experience", "skills"],
  "metrics": { "loadMs": 820, "interactionMs": 70 },
  "tiles": [
    { "id": "json-sentinel", "type": "interpreter", "expanded": true },
    { "id": "factory-universe", "type": "demo", "expanded": false }
  ],
  "notes": null
}`;

@Component({
  selector: 'json-interpreter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="json-shell">
      <div class="json-panel input">
        <div class="panel-header">
          <div class="panel-title">JSON input</div>
          <button type="button" class="panel-button" (click)="resetSample()">Reset sample</button>
        </div>
        <div class="editor-shell" [attr.title]="parseError ?? null">
          <pre class="highlight-layer" #highlightLayer aria-hidden="true">@for (segment of highlightSegments; track $index) {<span
            [class.error]="segment.error"
            [attr.title]="segment.error ? parseError : null"
          >{{ segment.text }}</span>}</pre>
          <textarea
            #jsonInput
            [value]="rawInput"
            (input)="onRawInputChange($any($event.target).value)"
            (keydown)="handleEditorKeydown($event)"
            (scroll)="syncScroll()"
            spellcheck="false"
            aria-label="JSON input"
          ></textarea>
        </div>
        <div class="panel-status" [class.error]="parseError">
          <span *ngIf="parseError">Invalid JSON. {{ parseError }}</span>
          <span *ngIf="!parseError">Parsed safely with depth limit {{ maxDepth }}.</span>
        </div>
      </div>

      <div class="json-panel output">
        <div class="panel-header">
          <div class="panel-title">Structure view</div>
          <div class="panel-meta" *ngIf="rootNode">
            {{ rootNode.typeLabel }} - {{ rootNode.size }} items
          </div>
        </div>

        <div class="panel-body">
          @if (rootNode) {
            <div class="json-tree">
              <ng-container
                [ngTemplateOutlet]="nodeTemplate"
                [ngTemplateOutletContext]="{ node: rootNode }"
              ></ng-container>
            </div>
          } @else {
            <div class="empty-state">No valid JSON to render.</div>
          }
        </div>
      </div>
    </div>

    <ng-template #nodeTemplate let-node="node">
      <div class="node" [class.root]="node.depth === 0">
        <div class="node-header">
          <button
            type="button"
            class="node-toggle"
            [class.hidden]="!node.expandable"
            (click)="toggleNode(node)"
          >
            {{ isExpanded(node) ? '-' : '+' }}
          </button>
          <span class="node-key" *ngIf="node.key !== null">{{ node.key }}</span>
          <span class="node-type">{{ node.typeLabel }}</span>
          <span class="node-preview">{{ node.preview }}</span>
          <span class="node-view" *ngIf="node.expandable">{{ node.view }}</span>
        </div>

        @if (node.expandable && isExpanded(node)) {
          <div class="node-body" [class.layout-two]="node.layout === 'two-column'">
            @for (child of node.children; track child.id) {
              <div class="node-row">
                <div class="row-header">
                  <button
                    type="button"
                    class="row-toggle"
                    [class.hidden]="!child.expandable"
                    (click)="toggleNode(child)"
                  >
                    {{ isExpanded(child) ? '-' : '+' }}
                  </button>
                  <span class="row-key">{{ child.key ?? 'item' }}</span>
                  <span class="row-preview">{{ child.preview }}</span>
                </div>
                @if (child.expandable && isExpanded(child)) {
                  <div class="row-children">
                    <ng-container
                      [ngTemplateOutlet]="nodeTemplate"
                      [ngTemplateOutletContext]="{ node: child }"
                    ></ng-container>
                  </div>
                }
              </div>
            }
            @if (node.hiddenCount > 0) {
              <div class="node-more">+ {{ node.hiddenCount }} more not shown</div>
            }
          </div>
        }
      </div>
    </ng-template>
  `,
  styles: [
    `
    :host {
      display: block;
      height: 100%;
    }

    .json-shell {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 16px;
      height: 100%;
      min-height: 0;
    }

    .json-panel {
      display: flex;
      flex-direction: column;
      background: rgba(6, 12, 20, 0.72);
      border: 1px solid rgba(120, 210, 255, 0.2);
      border-radius: 16px;
      padding: 12px;
      box-shadow: inset 0 0 18px rgba(6, 12, 20, 0.7);
      min-height: 0;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.7rem;
      color: rgba(170, 235, 255, 0.85);
    }

    .panel-title {
      font-weight: 700;
    }

    .panel-button {
      border: 1px solid rgba(120, 210, 255, 0.4);
      background: rgba(10, 20, 30, 0.7);
      color: rgba(210, 245, 255, 0.9);
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 0.65rem;
      cursor: pointer;
    }

    .panel-meta {
      font-size: 0.65rem;
      color: rgba(160, 220, 245, 0.7);
    }

    .editor-shell {
      position: relative;
      flex: 1;
      min-height: 0;
      border-radius: 12px;
      border: 1px solid rgba(120, 210, 255, 0.2);
      background: rgba(5, 10, 16, 0.9);
      overflow: hidden;
    }

    .highlight-layer {
      position: absolute;
      inset: 0;
      z-index: 1;
      margin: 0;
      padding: 10px 12px;
      font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.72rem;
      line-height: 1.5;
      color: rgba(230, 250, 255, 0.9);
      white-space: pre-wrap;
      word-break: break-word;
      pointer-events: none;
      overflow: auto;
    }

    .highlight-layer .error {
      background: rgba(255, 96, 96, 0.25);
      border-bottom: 1px solid rgba(255, 96, 96, 0.8);
      color: rgba(255, 200, 200, 0.95);
    }

    textarea {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      resize: none;
      border: none;
      background: transparent;
      color: transparent;
      caret-color: rgba(230, 250, 255, 0.95);
      font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.72rem;
      line-height: 1.5;
      padding: 10px 12px;
      outline: none;
      overflow: auto;
    }

    .panel-status {
      margin-top: 8px;
      font-size: 0.7rem;
      color: rgba(160, 220, 245, 0.8);
    }

    .panel-status.error {
      color: rgba(255, 165, 140, 0.95);
    }

    .panel-body {
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding-right: 6px;
    }

    .empty-state {
      color: rgba(200, 220, 230, 0.7);
      font-size: 0.75rem;
      padding: 12px 6px;
    }

    .json-tree {
      display: grid;
      gap: 12px;
    }

    .node {
      border: 1px solid rgba(120, 210, 255, 0.15);
      border-radius: 12px;
      padding: 8px 10px;
      background: rgba(8, 14, 22, 0.7);
    }

    .node.root {
      border-color: rgba(120, 210, 255, 0.35);
      box-shadow: 0 0 18px rgba(80, 200, 255, 0.15);
    }

    .node-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.72rem;
      color: rgba(220, 245, 255, 0.9);
      flex-wrap: wrap;
    }

    .node-toggle,
    .row-toggle {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid rgba(120, 210, 255, 0.45);
      background: rgba(12, 24, 36, 0.8);
      color: rgba(210, 245, 255, 0.9);
      font-size: 0.8rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .node-toggle.hidden,
    .row-toggle.hidden {
      opacity: 0;
      pointer-events: none;
    }

    .node-key,
    .row-key {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: rgba(120, 210, 255, 0.9);
    }

    .node-type {
      font-size: 0.65rem;
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(120, 210, 255, 0.15);
      color: rgba(190, 235, 255, 0.9);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .node-preview,
    .row-preview {
      color: rgba(210, 245, 255, 0.8);
      font-size: 0.7rem;
      word-break: break-word;
    }

    .node-view {
      margin-left: auto;
      font-size: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: rgba(160, 220, 245, 0.7);
    }

    .node-body {
      margin-top: 8px;
      display: grid;
      gap: 8px;
    }

    .node-body.layout-two {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .node-row {
      border-radius: 10px;
      border: 1px solid rgba(120, 210, 255, 0.15);
      background: rgba(10, 18, 28, 0.65);
      padding: 6px 8px;
      display: grid;
      gap: 6px;
    }

    .row-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.7rem;
      color: rgba(220, 245, 255, 0.85);
    }

    .row-children {
      padding-left: 12px;
      display: grid;
      gap: 8px;
    }

    .node-more {
      grid-column: 1 / -1;
      font-size: 0.65rem;
      color: rgba(160, 220, 245, 0.7);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 4px 2px;
    }

    @media (max-width: 960px) {
      .json-shell {
        grid-template-columns: 1fr;
      }
    }
    `
  ]
})
export class JsonInterpreterComponent implements OnChanges {
  @Input() jsonSource: unknown;
  @Input() maxDepth = 6;
  @Input() maxItems = 40;

  rawInput = DEFAULT_SAMPLE;
  parseError: string | null = null;
  rootNode: JsonNode | null = null;
  highlightSegments: Array<{ text: string; error: boolean }> = [
    { text: DEFAULT_SAMPLE, error: false }
  ];

  private lastValidNode: JsonNode | null = null;
  private expandedNodes = new Set<string>(['root']);
  private errorIndex: number | null = null;

  @ViewChild('jsonInput') private jsonInput?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('highlightLayer') private highlightLayer?: ElementRef<HTMLPreElement>;

  ngOnChanges(): void {
    if (this.jsonSource !== undefined) {
      this.applyExternalInput(this.jsonSource);
      return;
    }
    if (!this.rootNode) {
      this.parseInput(this.rawInput);
    }
  }

  onRawInputChange(value: string): void {
    this.rawInput = value;
    this.parseInput(value);
  }

  resetSample(): void {
    this.rawInput = DEFAULT_SAMPLE;
    this.parseInput(this.rawInput);
  }

  toggleNode(node: JsonNode): void {
    if (!node.expandable) {
      return;
    }
    if (this.expandedNodes.has(node.id)) {
      this.expandedNodes.delete(node.id);
    } else {
      this.expandedNodes.add(node.id);
    }
  }

  isExpanded(node: JsonNode): boolean {
    if (!node.expandable) {
      return false;
    }
    if (node.depth === 0) {
      return true;
    }
    return this.expandedNodes.has(node.id);
  }

  private applyExternalInput(source: unknown): void {
    if (typeof source === 'string') {
      this.rawInput = source;
      this.parseInput(source);
      return;
    }
    this.rawInput = this.safeStringify(source);
    this.parseError = null;
    this.errorIndex = null;
    this.parseValue(source);
  }

  private parseInput(value: string): void {
    try {
      const parsed = JSON.parse(value);
      this.parseError = null;
      this.errorIndex = null;
      this.updateHighlightSegments(value);
      this.parseValue(parsed);
    } catch (error) {
      this.parseError = error instanceof Error ? error.message : 'Unknown parse error';
      this.errorIndex = this.extractErrorIndex(this.parseError);
      this.updateHighlightSegments(value);
      if (this.lastValidNode) {
        this.rootNode = this.lastValidNode;
      }
    }
  }

  private parseValue(value: unknown): void {
    const seen = new WeakMap<object, string>();
    this.rootNode = this.buildNode(value, 'root', 0, seen);
    this.lastValidNode = this.rootNode;
    this.expandedNodes = new Set(['root']);
    this.updateHighlightSegments(this.rawInput);
  }

  private buildNode(
    value: unknown,
    path: string,
    depth: number,
    seen: WeakMap<object, string>
  ): JsonNode {
    if (depth >= this.maxDepth) {
      return this.createNode({
        id: path,
        key: this.getKeyFromPath(path),
        type: 'truncated',
        preview: `Max depth ${this.maxDepth} reached`,
        depth,
        view: 'detail',
        layout: 'single',
        children: [],
        size: 0,
        hiddenCount: 0,
        expandable: false,
        typeLabel: 'truncated'
      });
    }

    if (value === null) {
      return this.primitiveNode(path, 'null', 'null', depth);
    }

    if (Array.isArray(value)) {
      const key = this.getKeyFromPath(path);
      if (this.isCycle(value, path, seen)) {
        return this.cycleNode(path, key, depth, seen.get(value as object) ?? '');
      }
      const children = value
        .slice(0, this.maxItems)
        .map((child, index) => this.buildNode(child, `${path}[${index}]`, depth + 1, seen));
      const hiddenCount = Math.max(0, value.length - children.length);
      const view = 'list';
      const layout = this.layoutFor(children, view);
      return this.createNode({
        id: path,
        key,
        type: 'array',
        typeLabel: 'array',
        preview: `Array (${value.length})`,
        depth,
        view,
        layout,
        children,
        size: value.length,
        hiddenCount,
        expandable: children.length > 0
      });
    }

    if (typeof value === 'object') {
      const key = this.getKeyFromPath(path);
      if (this.isCycle(value as object, path, seen)) {
        return this.cycleNode(path, key, depth, seen.get(value as object) ?? '');
      }
      const entries = Object.entries(value as Record<string, unknown>);
      const slicedEntries = entries.slice(0, this.maxItems);
      const children = slicedEntries
        .map(([childKey, childValue]) =>
          this.buildNode(childValue, `${path}.${childKey}`, depth + 1, seen)
        )
        .map((child, index) => ({
          ...child,
          key: slicedEntries[index]?.[0] ?? child.key
        }));
      const hiddenCount = Math.max(0, entries.length - children.length);
      const view = this.viewFor(children);
      const layout = this.layoutFor(children, view);
      return this.createNode({
        id: path,
        key,
        type: 'object',
        typeLabel: 'object',
        preview: `Object (${entries.length})`,
        depth,
        view,
        layout,
        children,
        size: entries.length,
        hiddenCount,
        expandable: children.length > 0
      });
    }

    switch (typeof value) {
      case 'string':
        return this.primitiveNode(path, 'string', this.wrapString(value), depth);
      case 'number':
        return this.primitiveNode(path, 'number', `${value}`, depth);
      case 'boolean':
        return this.primitiveNode(path, 'boolean', value ? 'true' : 'false', depth);
      default:
        return this.primitiveNode(path, 'unknown', String(value), depth);
    }
  }

  private viewFor(children: JsonNode[]): JsonNodeView {
    if (children.length === 0) {
      return 'detail';
    }
    const allPrimitive = children.every((child) => !child.expandable);
    return allPrimitive ? 'detail' : 'list';
  }

  private layoutFor(children: JsonNode[], view: JsonNodeView): JsonNodeLayout {
    if (view !== 'detail') {
      return 'single';
    }
    if (children.length >= 6 && children.every((child) => !child.expandable)) {
      return 'two-column';
    }
    return 'single';
  }

  private primitiveNode(path: string, type: JsonNodeType, preview: string, depth: number): JsonNode {
    return this.createNode({
      id: path,
      key: this.getKeyFromPath(path),
      type,
      typeLabel: type,
      preview,
      depth,
      view: 'detail',
      layout: 'single',
      children: [],
      size: 0,
      hiddenCount: 0,
      expandable: false
    });
  }

  private cycleNode(path: string, key: string | null, depth: number, cyclePath: string): JsonNode {
    return this.createNode({
      id: path,
      key,
      type: 'cycle',
      typeLabel: 'cycle',
      preview: `Cycle reference to ${cyclePath}`,
      depth,
      view: 'detail',
      layout: 'single',
      children: [],
      size: 0,
      hiddenCount: 0,
      expandable: false,
      cyclePath
    });
  }

  private createNode(node: JsonNode): JsonNode {
    return node;
  }

  private isCycle(value: object, path: string, seen: WeakMap<object, string>): boolean {
    const existing = seen.get(value);
    if (existing) {
      return true;
    }
    seen.set(value, path);
    return false;
  }

  private getKeyFromPath(path: string): string | null {
    if (path === 'root') {
      return null;
    }
    const arrayMatch = path.match(/\[(\d+)\]$/);
    if (arrayMatch) {
      return arrayMatch[1];
    }
    const parts = path.split('.');
    return parts[parts.length - 1] ?? null;
  }

  private wrapString(value: string): string {
    return `"${value}"`;
  }

  private safeStringify(value: unknown): string {
    try {
      return JSON.stringify(value, null, 2) ?? '';
    } catch {
      return '';
    }
  }

  handleEditorKeydown(event: KeyboardEvent): void {
    if (!this.jsonInput) {
      return;
    }
    const isModifier = event.ctrlKey || event.metaKey;
    if (!isModifier) {
      return;
    }
    const key = event.key.toLowerCase();
    if (key === 'a') {
      event.preventDefault();
      const target = this.jsonInput.nativeElement;
      target.setSelectionRange(0, target.value.length);
      return;
    }
    if (key === 'z' || key === 'y') {
      return;
    }
  }

  private updateHighlightSegments(text: string): void {
    if (this.errorIndex === null || this.errorIndex < 0 || this.errorIndex >= text.length) {
      this.highlightSegments = [{ text, error: false }];
      return;
    }
    const start = this.errorIndex;
    const end = Math.min(text.length, start + 1);
    this.highlightSegments = [
      { text: text.slice(0, start), error: false },
      { text: text.slice(start, end), error: true },
      { text: text.slice(end), error: false }
    ];
  }

  private extractErrorIndex(message: string): number | null {
    const match = message.match(/position\s+(\d+)/i);
    if (!match) {
      return null;
    }
    const index = Number(match[1]);
    return Number.isFinite(index) ? index : null;
  }

  syncScroll(): void {
    if (!this.jsonInput || !this.highlightLayer) {
      return;
    }
    const input = this.jsonInput.nativeElement;
    const layer = this.highlightLayer.nativeElement;
    layer.scrollTop = input.scrollTop;
    layer.scrollLeft = input.scrollLeft;
  }
}
