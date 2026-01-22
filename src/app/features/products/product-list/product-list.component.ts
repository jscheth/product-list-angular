import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  // ---- UI Controls ----
  readonly searchControl = new FormControl('');
  readonly categoryControl = new FormControl('all');
  readonly sortControl = new FormControl('title-asc');

  // ---- Service Streams ----
  readonly products$: Observable<Product[]>;
  readonly isLoading$: Observable<boolean>;
  readonly error$: Observable<string | null>;

  // ---- Derived UI Stream ----
  readonly visibleProducts$: Observable<Product[]>;

  constructor(private readonly productService: ProductService) {
    this.products$ = this.productService.products$;
    this.isLoading$ = this.productService.isLoading$;
    this.error$ = this.productService.error$;

    const search$ = this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value ?? '')
    );

    const category$ = this.categoryControl.valueChanges.pipe(
      startWith(this.categoryControl.value ?? 'all')
    );

    const sort$ = this.sortControl.valueChanges.pipe(
      startWith(this.sortControl.value ?? 'title-asc')
    );

    this.visibleProducts$ = combineLatest([
      this.products$,
      search$,
      category$,
      sort$,
    ]).pipe(
      map(([products, search, category, sort]) => {
        let result = [...products];

        // 1️⃣ Filter inactive products
        result = result.filter((p) => p.isActive);

        // 2️⃣ Apply search (title + description + category)
        if (search) {
          const term = search.toLowerCase();
          result = result.filter(
            (p) =>
              p.title.toLowerCase().includes(term) ||
              p.description.toLowerCase().includes(term) ||
              p.category.toLowerCase().includes(term)
          );
        }

        // 3️⃣ Apply category filter
        if (category !== 'all') {
          result = result.filter((p) => p.category === category);
        }

        // 4️⃣ Apply sorting
        switch (sort) {
          case 'title-asc':
            result.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'title-desc':
            result.sort((a, b) => b.title.localeCompare(a.title));
            break;
          case 'price-asc':
            result.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            result.sort((a, b) => b.price - a.price);
            break;
        }

        return result;
      })
    );
  }

  ngOnInit(): void {
    this.productService.loadProducts();
  }

  onDeactivateProduct(id: number): void {
    this.productService.deactivateProduct(id);
  }
}
