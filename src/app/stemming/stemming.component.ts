import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Stemming } from '../../../functions/src/tweedekamer-api.types';

@Component({
  selector: 'app-stemming',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './stemming.component.html',
  styleUrls: ['./stemming.component.scss'],
})
export class StemmingComponent {
  @Input({ required: true }) stemming!: Stemming[];
}
