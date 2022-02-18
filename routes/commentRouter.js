const express = require('express');
const app = express.Router();
const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  user: "muhammad_s",
  password: "As#231296",
  database: "personal_blog"
});
// Insert Comments
app.post('/', (req, res)=>{
    const{text} = req.body
    if(!text){
        res.status(400).send({msg: "Not all fields have been submitted"});}
        var sql = `INSERT INTO comments (comment_text) VALUES ('${text}')`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
});

//GET ALL USERS
app.get('/', (req, res)=>{
    var sql = `SELECT * FROM comments`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result)
    });
});
// GET 1 - id
app.get('/:id', (req, res)=>{
    var sql = `SELECT * FROM comments WHERE comment_id=${req.params.id}`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result)
    });
});

// GET 1 with conditions
app.patch('/', (req, res)=>{
    const {text} = req.body;
    var sql = `SELECT * FROM comments WHERE comment_text = '${text}'`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record found");
      res.send(result)
    });
});

// UPDATE 1
app.put('/:id', (req, res)=>{
    const {text} = req.body;
    var sql = `UPDATE users SET `;
    if(text) sql +=  `comment_text= '${text}'`
    
    query += ` WHERE comment_id = ${req.params.id}`
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("comment Updated!")
        res.send(result)
      });
  })

// DELETE 1
app.delete('/:id',(req, res) =>{
    var sql = `DELETE FROM comments WHERE comment_id=${req.params.id}`;
         con.query(sql, function (err, result) {
           if (err) throw err;
           console.log("comment Deleted");
         });
       });

module.exports = app;