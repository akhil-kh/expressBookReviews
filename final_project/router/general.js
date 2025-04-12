const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if(!username || !password){
    res.status(400).send("Username or Password not provided");
    return;
  }
  if(isValid(username)){
    res.status(409).send("Username already present");
    return;
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(201).send(`User registered! Username: ${username}`)
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  let booksData = await books;
  return res.status(200).json(booksData);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const selIsbn = req.params.isbn
  let booksData = await books;
  return res.status(200).json(booksData[selIsbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const selectedAuthor = req.params.author
  let booksData = await books;
  for (index in booksData) {
    if (booksData[index].author === selectedAuthor) {
        return res.status(200).json(booksData[index]);
    }
  }
  return res.status(404).send(`No book found written by author ${selectedAuthor}!`);
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  let booksData = await books;
  const selectedTitle = req.params.title
  for (index in booksData) {
    if (booksData[index].title === selectedTitle) {
        return res.status(200).json(booksData[index]);
    }
  }
  return res.status(404).send(`No book found with title ${selectedTitle}!`);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const selectedISBN = req.params.isbn;
  return res.status(200).json(books[selectedISBN].reviews);
});

module.exports.general = public_users;
