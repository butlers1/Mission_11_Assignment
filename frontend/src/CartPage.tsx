import type { CartItem } from './types';
import type { Dispatch, SetStateAction } from 'react';

interface CartPageProps {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  onContinueShopping: () => void;
}

export function CartPage({ cart, setCart, onContinueShopping }: CartPageProps) {
  const total = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  const updateQuantity = (bookId: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(bookId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.book.bookId === bookId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (bookId: number) => {
    setCart((prev) => prev.filter((item) => item.book.bookId !== bookId));
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark border-bottom border-warning border-3">
        <div className="container-fluid px-4">
          <span className="navbar-brand d-flex align-items-center gap-2">
            <span style={{ fontSize: '1.75rem' }}>📚</span>
            <span className="fw-bold fs-4">Hilton Bookstore</span>
          </span>
          <button className="btn btn-outline-warning" onClick={onContinueShopping}>
            ← Continue Shopping
          </button>
        </div>
      </nav>

      <div className="container my-4">
        <h2 className="mb-4 fw-bold">🛒 Your Cart</h2>

        {cart.length === 0 ? (
          <div className="alert alert-info">
            Your cart is empty.{' '}
            <button className="btn btn-link p-0" onClick={onContinueShopping}>
              Browse books
            </button>
          </div>
        ) : (
          <>
            <div className="table-responsive shadow-sm">
              <table className="table table-bordered align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.book.bookId}>
                      <td className="fw-semibold">{item.book.title}</td>
                      <td>${item.book.price.toFixed(2)}</td>
                      <td style={{ width: '140px' }}>
                        <div className="input-group input-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.book.bookId, item.quantity - 1)}
                          >−</button>
                          <input
                            type="number"
                            className="form-control text-center"
                            value={item.quantity}
                            min={1}
                            onChange={(e) => updateQuantity(item.book.bookId, Number(e.target.value))}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.book.bookId, item.quantity + 1)}
                          >+</button>
                        </div>
                      </td>
                      <td className="fw-semibold text-success">
                        ${(item.book.price * item.quantity).toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeItem(item.book.bookId)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-dark">
                    <td colSpan={3} className="text-end fw-bold">Total</td>
                    <td className="fw-bold text-warning">${total.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-outline-secondary" onClick={onContinueShopping}>
                ← Continue Shopping
              </button>
              <button className="btn btn-success">
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;