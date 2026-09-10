const express = require('express');
const axios = require('axios');
let books = require("../booksdb.js");
let { isValid, users } = require("./auth_users.js");
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Unable to register user. Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(404).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login." });
});

// ---- Simple synchronous versions (used for the base cURL tasks) ----

// Task 1: Get the full book list
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn]);
  } else {
    res.status(404).json({ message: "Book not found for this ISBN" });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const result = Object.values(books).filter(b => b.author === author);
  res.send(result);
});

// Task 4: Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const result = Object.values(books).filter(b => b.title === title);
  res.send(result);
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found for this ISBN" });
  }
});

// ---- Task 11 requirement: Promise / async-await + Axios versions ----
// These call the running server's own public endpoints using Axios,
// demonstrating promise callbacks / async-await instead of plain sync code.

const BASE_URL = "http://localhost:5000";

// Get all books – Promise callbacks with Axios
public_users.get('/async/books', function (req, res) {
  axios.get(`${BASE_URL}/`)
    .then(response => res.send(response.data))
    .catch(error => res.status(500).json({ message: "Error fetching books", error: error.message }));
});

// Search by ISBN – async/await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${req.params.isbn}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
  }
});

// Search by Author – async/await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${req.params.author}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Search by Title – async/await with Axios
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${req.params.title}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

module.exports.general = public_users;