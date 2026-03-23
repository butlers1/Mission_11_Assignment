import { useState, useEffect } from 'react';

interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

interface BooksResponse {
  books: Book[];
  totalCount: number;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    setLoading(true);
    fetch(
      `http://localhost:5214/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}`
    )
      .then((res) => res.json())
      .then((data: BooksResponse) => {
        setBooks(data.books);
        setTotalCount(data.totalCount);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch books:', err);
        setLoading(false);
      });
  }, [pageNum, pageSize, sortOrder]);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPageNum(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
    setPageNum(1);
  };

  return (
    <div>
      {/* Header */}
      <nav className="navbar navbar-dark bg-dark border-bottom border-warning border-3">
        <div className="container">
          <span className="navbar-brand d-flex align-items-center gap-2">
            <span style={{ fontSize: '1.75rem' }}>📚</span>
            <span className="fw-bold fs-4">Hilton Bookstore</span>
          </span>
          <span className="text-warning small text-uppercase">
            Browse our collection
          </span>
        </div>
      </nav>

      {/* Main content */}
      <div className="container my-4">

        {/* Controls */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body d-flex flex-wrap align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="sort" className="form-label mb-0 fw-semibold small text-uppercase">
                Sort by Title
              </label>
              <select id="sort" className="form-select form-select-sm w-auto" value={sortOrder} onChange={handleSortChange}>
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
              </select>
            </div>

            <div className="d-flex align-items-center gap-2">
              <label htmlFor="pageSize" className="form-label mb-0 fw-semibold small text-uppercase">
                Results per page
              </label>
              <select id="pageSize" className="form-select form-select-sm w-auto" value={pageSize} onChange={handlePageSizeChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <span className="ms-auto text-muted small">
              {totalCount} book{totalCount !== 1 ? 's' : ''} total
            </span>
          </div>
        </div>

        {/* Table */}
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
                    <li key={`ellipsis-${idx}`} className="page-item disabled">
                      <span className="page-link">…</span>
                    </li>
                  ) : (
                    <li key={item} className={`page-item ${pageNum === item ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setPageNum(item as number)}>
                        {item}
                      </button>
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
  );
}

export default App;