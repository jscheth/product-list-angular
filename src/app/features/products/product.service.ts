import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // ---- Private state ----
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  // ---- Public streams ----
  readonly products$: Observable<Product[]> =
    this.productsSubject.asObservable();

  readonly isLoading$: Observable<boolean> =
    this.loadingSubject.asObservable();

  readonly error$: Observable<string | null> =
    this.errorSubject.asObservable();

  constructor() {}

  // ---- Public API ----

  loadProducts(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.mockApiCall()
      .pipe(
        tap((products) => {
          this.productsSubject.next(products);
          this.loadingSubject.next(false);
        }),
        catchError((error) => {
          this.errorSubject.next('Failed to load products.');
          this.loadingSubject.next(false);
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  deactivateProduct(id: number): void {
    const currentProducts = this.productsSubject.getValue();

    const updatedProducts = currentProducts.map((product) =>
      product.id === id
        ? { ...product, isActive: false }
        : product
    );

    this.productsSubject.next(updatedProducts);
  }

  // ---- Mock API ----

  private mockApiCall(): Observable<Product[]> {
    const mockProducts: Product[] = [
      {
        id: 1,
        title: 'Cricut Explore 3',
        description: 'Smart cutting machine for DIY crafts.',
        price: 399.99,
        category: 'Machines',
        imageUrl: 'https://via.placeholder.com/150?text=Explore+3',
        isActive: true,
      },
      {
        id: 2,
        title: 'Cricut Maker 3',
        description: 'Advanced cutting machine for precision projects.',
        price: 429.99,
        category: 'Machines',
        imageUrl: 'https://via.placeholder.com/150?text=Maker+3',
        isActive: true,
      },
      {
        id: 3,
        title: 'EasyPress 2',
        description: 'Heat press for custom vinyl projects.',
        price: 189.99,
        category: 'Heat+Press',
        imageUrl: 'https://via.placeholder.com/150?text=EasyPress+2',
        isActive: true,
      },
      {
        id: 4,
        title: 'Premium Vinyl Roll',
        description: 'Durable vinyl for long-lasting designs.',
        price: 12.99,
        category: 'Materials',
        imageUrl: 'https://via.placeholder.com/150?text=Vinyl+Roll',
        isActive: true,
      },
      {
        id: 5,
        title: 'Fine-Point Blade',
        description: 'Precision blade for detailed cuts.',
        price: 19.99,
        category: 'Accessories',
        imageUrl: 'https://via.placeholder.com/150?text=Blade',
        isActive: true,
      },
    ];

    const shouldFail = Math.random() < 0.1; // 10% chance of error

    if (shouldFail) {
      return throwError(() => new Error('Mock API error')).pipe(delay(600));
    }

    return of(mockProducts).pipe(delay(600));
  }
}
