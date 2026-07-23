import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-kategorien-suchleiste-component',
  imports: [],
  templateUrl: './kategorien-suchleiste-component.html',
  styleUrl: './kategorien-suchleiste-component.css',
})
export class KategorienSuchleisteComponent {
  @Input() suchtext = '';
  @Output() suchtextChange = new EventEmitter<string>();

  suchtextAendern(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.suchtextChange.emit(input.value);
  }
}
