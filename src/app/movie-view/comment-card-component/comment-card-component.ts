import { Component, Input } from '@angular/core';
import {CommentCardInterface} from './comment-card.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comment-card-component',
  imports: [DatePipe],
  templateUrl: './comment-card-component.html',
  styleUrl: './comment-card-component.css',
})
export class CommentCardComponent {
  @Input() comment!: CommentCardInterface;
}
