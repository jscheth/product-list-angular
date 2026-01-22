# Product List App (Angular)

**Version:** 1.0.0  
**Angular Version:** 19.x  
**Angular Material Version:** 19.x  

This is a small Angular application built to demonstrate:

- Clean Angular architecture
- RxJS-based state management
- Reactive UI patterns
- Component separation of concerns
- Thoughtful UX and UI states

---

## ✨ Features

- View a list of products with image, title, price, and category
- Search products by title, description, or category
- Filter products by category
- Sort products by title or price
- Soft-delete (deactivate) products
- Loading, error, and empty states
- Clean separation between smart and presentational components
- Angular Material UI

---

## 🧱 Component Versions

| Component                  | Version |
|---------------------------|---------|
| ProductService            | 1.0.0   |
| ProductListComponent      | 1.0.0   |
| ProductTableComponent     | 1.0.0   |
| Product Model             | 1.0.0   |

> Versions are semantic and represent the current stable implementation
> of each logical unit.

---

## 🧠 Technical Approach

- Canonical product state is owned by `ProductService` using `BehaviorSubject`
- UI state (search, filter, sort) is modeled as reactive streams
- Visible products are derived using `combineLatest`
- No manual subscriptions in components (async pipe only)
- Mock async API implemented using RxJS `of(...).pipe(delay(...))`
- Standalone components with localized Angular Material imports

---

## ▶️ How to Run

```bash
npm install
ng serve
