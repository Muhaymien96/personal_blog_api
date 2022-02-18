const express = require('express');
const {get} = require('express/lib/response');
const app = express.Router();
const con = require('../dbConnection')
const authenticateToken = require('../authServer')
function getToday() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
  
    today = yyyy + "-" + mm + "-" + dd;
  
    return today;
  }
// CREATE POST
app.post('/', authenticateToken, (req, res) => {
    const {
        title,
        body
    } = req.body
    if (!title || !body) {
        res.status(400).send({ 
            msg: "Not all fields have been submitted"
        });
    }
    const user = req.user
    console.log(user)
    var sql = `INSERT INTO posts (post_title, post_body, post_date, post_author) VALUES ('${title}', '${body}', '${getToday()}', '${user.user_id}')`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 post inserted");
        res.send(result)
    });

});
//GET ALL BLOG POST
app.get('/', authenticateToken, (req, res) => {
    var sql = "SELECT * FROM posts";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("All posts recieved");
        res.send(result)
        
    });
});

// GET 1 POST
app.get('/:id', authenticateToken, (req, res, next) => {
    var sql = `SELECT * from posts WHERE post_id=${req.params.id}`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record recieved");
        res.send(result);
    });
})

// DELETE POST
app.delete('/:id', authenticateToken, (req, res) => {
    var sql = `DELETE FROM posts WHERE post_id=${req.params.id}`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("post deleted");
        res.send(result);
    });
});

// UPDATE post
//update with id
app.put('/:id',authenticateToken, (req, res)=>{
    const {title, body} = req.body;
    var sql = `UPDATE posts SET `;
    if(title) {sql += `post_title = '${title}', `}
    if(body) {sql += `post_body = '${body}', `}
    sql += `post_date = '${getToday()}' WHERE post_id=${req.params.id}`
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Post Updated!")
      res.send(result)
    });
});

module.exports = app;