// book class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// ui class
class UI {
  static displayBooks() {

    const books = Store.getBooks();

    books.forEach(function(book) {
      UI.addBookToList(book);
    });
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">Delete</a></td>
    `;
    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';    
  }

}

// store class, local storage handling
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// event display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// add book
document.querySelector('#book-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // validate data
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert("Empty Fields", "danger");
    return;
  }

  // inst book
  const book = new Book(title, author, isbn);

  // add book to list
  UI.addBookToList(book);

  // add book to store
  Store.addBook(book);

  // show success
  UI.showAlert("Book Added", "success");

  // clear fields
  UI.clearFields();

});

// remove book
document.querySelector('#book-list').addEventListener('click', (event) => {
  // remove book from user interface
  UI.deleteBook(event.target);
  // remove book from local storage
  Store.removeBook(event.target.parentElement.previousElementSibling.textContent);
  // Show alert message
  UI.showAlert("Book Removed", "success");
});