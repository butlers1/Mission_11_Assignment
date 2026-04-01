import { useState, useEffect, type ChangeEvent } from 'react';
import type { Book, CartItem, BooksResponse } from './types';
import CartPage from './CartPage';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState('asc');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const totalPages = Math.ceil(totalCount / pageSize);
  const cartTotal = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    fetch('http://localhost:5214/api/books/categories')
      .then((res) => res.json())
      .then((data: string[]) => setCategories(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const categoryParam = selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : '';
    fetch(
      `http://localhost:5214/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}${categoryParam}`
    )
      .then((res) => res.json())
      .then((data: BooksResponse) => {
        setBooks(data.books);
        setTotalCount(data.totalCount);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pageNum, pageSize, sortOrder, selectedCategory]);

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPageNum(1);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
    setPageNum(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPageNum(1);
  };

  const addToCart = (book: Book) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book.bookId === book.bookId);
      if (existing) {
        return prev.map((item) =>
          item.book.bookId === book.bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
  };

  if (showCart) {
    return (
      <CartPage
        cart={cart}
        setCart={setCart}
        onContinueShopping={() => setShowCart(false)}
      />
    );
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark border-bottom border-warning border-3">
        <div className="container-fluid px-4">
          <span className="navbar-brand d-flex align-items-center gap-2">
            <span style={{ fontSize: '1.75rem' }}>📚</span>
            <span className="fw-bold fs-4">Hilton Bookstore</span>
          </span>
          <button
            className="btn btn-outline-warning position-relative"
            onClick={() => setShowCart(true)}
          >
            🛒 Cart
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <div className="container-fluid px-4 my-4">
        <div className="row g-4">

          {/* Sidebar */}
          <div className="col-12 col-md-2">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white fw-semibold">
                Filter by Category
              </div>
              <ul className="list-group list-group-flush">
                <li
                  className={`list-group-item list-group-item-action ${selectedCategory === '' ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleCategoryChange('')}
                >
                  All
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className={`list-group-item list-group-item-action ${selectedCategory === cat ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cart Summary */}
            {cartCount > 0 && (
              <div className="card shadow-sm mt-3">
                <div className="card-header bg-dark text-white fw-semibold">
                  🛒 Cart Summary
                </div>
                <div className="card-body p-2">
                  {cart.map((item) => (
                    <div key={item.book.bookId} className="d-flex justify-content-between small mb-1">
                      <span className="text-truncate me-2">{item.book.title} x{item.quantity}</span>
                      <span>${(item.book.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <hr className="my-1" />
                  <div className="d-flex justify-content-between fw-bold small">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    className="btn btn-warning btn-sm w-100 mt-2"
                    onClick={() => setShowCart(true)}
                  >
                    View Cart
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="col-12 col-md-10">
            <div className="card mb-3 shadow-sm">
              <div className="card-body d-flex flex-wrap align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <label className="form-label mb-0 fw-semibold small text-uppercase">Sort by Title</label>
                  <select className="form-select form-select-sm w-auto" value={sortOrder} onChange={handleSortChange}>
                    <option value="asc">A → Z</option>
                    <option value="desc">Z → A</option>
                  </select>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <label className="form-label mb-0 fw-semibold small text-uppercase">Results per page</label>
                  <select className="form-select form-select-sm w-auto" value={pageSize} onChange={handlePageSizeChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                <span className="ms-auto text-muted small">
                  {totalCount} book{totalCount !== 1 ? 's' : ''} total
                  {selectedCategory && <span className="ms-1 badge bg-secondary">{selectedCategory}</span>}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5 text-muted fst-italic">Loading books…</div>
            ) : (
              <div className="table-responsive shadow-sm">
                <table className="table table-striped table-hover table-bordered align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Publisher</th>
                      <th>ISBN</th>
                      <th>Classification</th>
                      <th>Category</th>
                      <th>Pages</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.bookId}>
                        <td className="fw-semibold">{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.publisher}</td>
                        <td><code>{book.isbn}</code></td>
                        <td>
                          <span className={`badge ${book.classification === 'Fiction' ? 'bg-primary' : 'bg-danger'}`}>
                            {book.classification}
                          </span>
                        </td>
                        <td>{book.category}</td>
                        <td>{book.pageCount.toLocaleString()}</td>
                        <td className="fw-semibold text-success">${book.price.toFixed(2)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => addToCart(book)}
                          >
                            + Add
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="d-flex flex-column align-items-center mt-4 gap-2">
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPageNum(1)}>«</button>
                  </li>
                  <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPageNum((p) => Math.max(1, p - 1))}>‹</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - pageNum) <= 1)
                    .reduce<(number | string)[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === '...' ? (
                        <li key={`e-${idx}`} className="page-item disabled">
                          <span className="page-link">…</span>
                        </li>
                      ) : (
                        <li key={item} className={`page-item ${pageNum === item ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setPageNum(item as number)}>{item}</button>
                        </li>
                      )
                    )}
                  <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPageNum((p) => Math.min(totalPages, p + 1))}>›</button>
                  </li>
                  <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPageNum(totalPages)}>»</button>
                  </li>
                </ul>
              </nav>
              <small className="text-muted">Page {pageNum} of {totalPages}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;