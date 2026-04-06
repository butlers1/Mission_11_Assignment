import { Navigate, Route, Routes } from 'react-router-dom';
import AdminBooksPage from './AdminBooksPage';
import StorefrontPage from './StorefrontPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StorefrontPage />} />
      <Route path="/adminbooks" element={<AdminBooksPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;