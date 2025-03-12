const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const pswd = req.body.password;
  console.log(username,pswd)
  if(username && pswd)
  {
    if(isValid(username))
    {
        users.push({"username":username ,"password": pswd })
        console.log(users)
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
    else{
        return res.status(404).json({message: "User already exists"})
    }
  }
  return res.status(404).json({message: "Unable to register"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  
  return res.send(JSON.stringify({books},null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
   const isbn = req.params.isbn;
   let filtered_book = books[isbn];
   res.send(filtered_book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const values = Object.values(books);
  const filtered_book= values.filter(book => {
    return book.author==author
  })
  res.send(filtered_book)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const values = Object.values(books);
  const filtered_book = values.filter(book => {
    return book.title ==title
  })
  res.send(filtered_book)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
   const isbn = req.params.isbn;
   let filtered_book = books[isbn]
   console.log(filtered_book)
   res.send(filtered_book.reviews)
});

module.exports.general = public_users;
