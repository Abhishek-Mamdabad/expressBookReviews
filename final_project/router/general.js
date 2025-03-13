const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const pswd = req.body.password;
  if(username && pswd)
  {
    if(isValid(username))
    {
        users.push({"username":username ,"password": pswd })
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
    else{
        return res.status(404).json({message: "User already exists"})
    }
  }
  return res.status(404).json({message: "Unable to register"})
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    return res.send(JSON.stringify({books},null,4))
  }catch(error){
    console.log(error)
    return res.status(500).json({message:"Error"})
  }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function(req, res) {
  //Write your code here
  try{
    let resp = await axios.get("https://amamdaba-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/")
    let data=resp.data.books;
    const isbn = req.params.isbn;
    let filtered_book = data[isbn];
    return res.send(filtered_book);
  }catch(error){
    console.log(error)
    return res.status(500).json({message:"Error"})
  } 
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  try{
    let resp = await axios.get("https://amamdaba-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/")
    let data = resp.data.books;
    const author = req.params.author;
    const values = Object.values(data);
    const filtered_book= values.filter(book => {
      return book.author==author
    })
    res.send(filtered_book)
  }catch(error){
    console.log(error);
    res.status(500).json({message:"Error"})
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  try{
    const title = req.params.title;
    let resp = await axios.get("https://amamdaba-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/")
    let data=resp.data.books;
    const values = Object.values(data);
    const filtered_book = values.filter(book => {
      return book.title ==title
    })
    res.send(filtered_book)
  }catch(error){
    console.log(error)
    res.status(500).json({message:"Error"})
  }
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
   const isbn = req.params.isbn;
   let filtered_book = books[isbn]
   res.send(filtered_book.reviews)
});

module.exports.general = public_users;
