import { Component, Input } from '@angular/core';
import {CommentCardInterface} from './comment-card.interface';

@Component({
  selector: 'app-comment-card-component',
  imports: [],
  templateUrl: './comment-card-component.html',
  styleUrl: './comment-card-component.css',
})
export class CommentCardComponent {
  @Input() comment!: CommentCardInterface;
}
