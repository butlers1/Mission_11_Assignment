// src/types.ts
export interface Book {
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

export interface CartItem {
    book: Book;
    quantity: number;
}

export interface BooksResponse {
    books: Book[];
    totalCount: number;
}