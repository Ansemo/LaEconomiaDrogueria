import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  @Input() subtitle?: string;
  @Input() title?: string;
  @Input() detail1?: string;
  @Input() detail2?: string;
}
