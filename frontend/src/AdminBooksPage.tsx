import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Book, BookFormData, BooksResponse } from './types';

const booksApiUrl = 'http://localhost:5214/api/books';

const emptyForm: BookFormData = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 1,
  price: 0,
};

function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [formData, setFormData] = useState<BookFormData>(emptyForm);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadBooks = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${booksApiUrl}?pageNum=1&pageSize=1000&sortOrder=asc`);

      if (!response.ok) {
        throw new Error('Failed to load books.');
      }

      const data: BooksResponse = await response.json();
      setBooks(data.books);
    } catch {
      setError('Unable to load books from the database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadBooks();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingBookId(null);
  };

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: name === 'pageCount' || name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    const payload = {
      ...formData,
      pageCount: Number(formData.pageCount),
      price: Number(formData.price),
    };

    try {
      const response = await fetch(
        editingBookId === null ? booksApiUrl : `${booksApiUrl}/${editingBookId}`,
        {
          method: editingBookId === null ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            editingBookId === null
              ? payload
              : { ...payload, bookId: editingBookId }
          ),
        }
      );

      if (!response.ok) {
        throw new Error('Save failed');
      }

      setSuccessMessage(editingBookId === null ? 'Book added successfully.' : 'Book updated successfully.');
      resetForm();
      await loadBooks();
    } catch {
      setError('Unable to save the book. Check your data and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBookId(book.bookId);
    setFormData({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      pageCount: book.pageCount,
      price: book.price,
    });
    setSuccessMessage('');
    setError('');
  };

  const handleDelete = async (book: Book) => {
    const confirmed = window.confirm(`Delete "${book.title}"?`);

    if (!confirmed) {
      return;
    }

    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${booksApiUrl}/${book.bookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      if (editingBookId === book.bookId) {
        resetForm();
      }

      setSuccessMessage('Book deleted successfully.');
      await loadBooks();
    } catch {
      setError('Unable to delete the selected book.');
    }
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark border-bottom border-warning border-3">
        <div className="container-fluid px-4">
          <span className="navbar-brand d-flex align-items-center gap-2">
            <span style={{ fontSize: '1.75rem' }}>📚</span>
            <span className="fw-bold fs-4">Book Admin</span>
          </span>
          <Link className="btn btn-outline-warning" to="/">
            View Storefront
          </Link>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h1 className="h3 mb-1">Manage Books</h1>
                <p className="text-muted mb-4">
                  Add a new book or update an existing record in the database.
                </p>

                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                <form className="d-grid gap-3" onSubmit={handleSubmit}>
                  <div>
                    <label className="form-label fw-semibold" htmlFor="title">Title</label>
                    <input className="form-control" id="title" name="title" value={formData.title} onChange={handleFieldChange} required />
                  </div>
                  <div>
                    <label className="form-label fw-semibold" htmlFor="author">Author</label>
                    <input className="form-control" id="author" name="author" value={formData.author} onChange={handleFieldChange} required />
                  </div>
                  <div>
                    <label className="form-label fw-semibold" htmlFor="publisher">Publisher</label>
                    <input className="form-control" id="publisher" name="publisher" value={formData.publisher} onChange={handleFieldChange} required />
                  </div>
                  <div>
                    <label className="form-label fw-semibold" htmlFor="isbn">ISBN</label>
                    <input className="form-control" id="isbn" name="isbn" value={formData.isbn} onChange={handleFieldChange} required />
                  </div>
                  <div>
                    <label className="form-label fw-semibold" htmlFor="classification">Classification</label>
                    <input className="form-control" id="classification" name="classification" value={formData.classification} onChange={handleFieldChange} required />
                  </div>
                  <div>
                    <label className="form-label fw-semibold" htmlFor="category">Category</label>
                    <input className="form-control" id="category" name="category" value={formData.category} onChange={handleFieldChange} required />
                  </div>
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold" htmlFor="pageCount">Page Count</label>
                      <input className="form-control" id="pageCount" type="number" min={1} name="pageCount" value={formData.pageCount} onChange={handleFieldChange} required />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold" htmlFor="price">Price</label>
                      <input className="form-control" id="price" type="number" min={0} step="0.01" name="price" value={formData.price} onChange={handleFieldChange} required />
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-dark flex-grow-1" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving…' : editingBookId === null ? 'Add Book' : 'Update Book'}
                    </button>
                    <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-body p-0">
                <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-light">
                  <div>
                    <h2 className="h5 mb-1">Current Inventory</h2>
                    <div className="text-muted small">{books.length} books loaded</div>
                  </div>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => void loadBooks()}>
                    Refresh
                  </button>
                </div>

                {isLoading ? (
                  <div className="p-4 text-center text-muted">Loading books…</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-dark">
                        <tr>
                          <th>Title</th>
                          <th>Author</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {books.map((book) => (
                          <tr key={book.bookId}>
                            <td>
                              <div className="fw-semibold">{book.title}</div>
                              <div className="small text-muted">{book.publisher} • {book.isbn}</div>
                            </td>
                            <td>{book.author}</td>
                            <td>{book.category}</td>
                            <td>${book.price.toFixed(2)}</td>
                            <td className="text-end">
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary" onClick={() => handleEdit(book)}>
                                  Edit
                                </button>
                                <button className="btn btn-outline-danger" onClick={() => void handleDelete(book)}>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBooksPage;