import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css'],
})
export class ProductTableComponent {
  @Input({ required: true }) products: Product[] = [];
  @Output() deactivate = new EventEmitter<number>();

  onDeactivate(id: number): void {
    this.deactivate.emit(id);
  }
}
