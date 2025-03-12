const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
 let filtered_users = users.filter((user) => {
    return user.username === username;
 })
 return ! (filtered_users.length > 0)

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

let filtered_users = users.filter( user => {
    return user.username === username && user.password ===password
})

console.log(users)
return filtered_users.length> 0

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
   const username = req.body.username;
   const pswd = req.body.password;
    if(!username || ! pswd)
    {
        return res.status(404).json({message:"Error logging in the user"})
    }

    if(authenticatedUser(username,pswd))
    {
        let accessToken = jwt.sign({
            data:pswd
        },"strongstring",{expiresIn: 60 * 60})

        req.session.authorization = {
            accessToken , username
        }

        return res.status(200).send("User successfully logged in ")
    }
    else{
        return res.status(208).json({message:"Invalid Login"})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let filtered_book = books[isbn]
  const review = req.body.review;
  const reviews= filtered_book.reviews;
  const username = req.session.authorization["username"]
  reviews[username] = review;
  console.log(books)
  res.send(books[isbn])
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
