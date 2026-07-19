import { Component } from '@angular/core';
import { CommentCardComponent } from '../comment-card-component/comment-card-component';

@Component({
  selector: 'app-comment-grid-component',
  imports: [CommentCardComponent],
  templateUrl: './comment-grid-component.html',
  styleUrl: './comment-grid-component.css',
})
export class CommentGridComponent {}
