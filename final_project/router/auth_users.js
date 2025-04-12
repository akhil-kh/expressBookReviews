const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let filteredUsers = users.filter((user) => user.username === username);
    return filteredUsers.length>0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let filtered_users = users.filter((user) => user.username === username && user.password === password);
    return filtered_users.length;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: {username, password}
      }, "access", { expiresIn: 60 * 10});
      req.session.authorization = { accessToken, username }
      return res.status(200).send("User logged in!");
    } else {
      return res.status(401).send("Invalid login!");
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review =  req.body.review;
    books[isbn].reviews[req.user.data.username] = review;
    res.status(200).json(books[isbn]);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const user = req.user.data.username;
    bookSelected = books[isbn];
    console.log(bookSelected);
    if(!!bookSelected){
        let deletedReview = bookSelected.reviews[user];
        if (!!deletedReview) {
            delete bookSelected.reviews[user];
            return res.status(202).send(`Deleted review "${deletedReview}"`); 
        } else {
            return res.status(404).send(`No review on the book found by User ${user}`);
        }
    } else {
        return  res.status(404).send("Book not found");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
