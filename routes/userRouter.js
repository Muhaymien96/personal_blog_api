require('dotenv').config()
const express = require('express')
const app = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const con = require('../dbConnection')

// User Registration
app.post('/', async (req, res)=>{
    const{name, email, contact, password} = req.body
    if(!name || !email || !contact || !password){
        res.status(400).send({msg: "Not all fields have been submitted"});
      }
      try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        var sql = `INSERT INTO users (user_name, user_email, user_contact, user_password) VALUES ('${name}', '${email}', '${contact}','${hashedPassword}')`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      } catch (error) {
        res.status(500).send()
      }
      });


      
//GET ALL USERS
app.get('/', (req, res)=>{
    var sql = `SELECT * FROM users`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result)
    });
});
// GET 1 - id
app.get('/:id', (req, res)=>{
    var sql = `SELECT * FROM users WHERE user_id=${req.params.id}`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result)
    });
});

// LOGIN (email, pass)
app.patch('/', async (req, res)=>{
    const {email, password} = req.body;
  try {
    var sql = `SELECT * FROM users WHERE user_email = '${email}'`;
    con.query(sql, async function (err, result) {
      console.log(result)
      if (await bcrypt.compare(password, result[0].user_password))
      {
      const access_token = jwt.sign(JSON.stringify(result[0]), process.env.ACCESS_TOKEN_SECRET)
      res.send({access_token: access_token})
      console.log("1 record found");
      console.log(result)
    }
      
    });
  } catch (error) {
    res.status(500).send()
  }
});

// UPDATE 1

app.put('/:id', (req, res)=>{
    const {name,email,contact,password, avatar, about} = req.body;
    var sql = `UPDATE users SET `;
    if(name) sql +=  `user_name= '${name}', `
    if(email) sql +=  `user_email= '${email}', `
    if(contact) sql +=  `user_contact= '${contact}', `
    if(password) sql +=  `user_password= '${password}', `
    if(avatar) sql +=  `user_avatar= '${avatar}', `
    if(about) sql += `user_about = '${about}'`
    
    query += `WHERE user_id = ${req.params.id}`
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("User Updated!")
        res.send(result)
      });
  })

// DELETE 1
app.delete('/users/:id',(req, res) =>{
    var sql = `DELETE FROM users WHERE user_id=${req.params.id}`;
         con.query(sql, function (err, result) {
           if (err) throw err;
           console.log("User Deleted");
         });
       });

module.exports = app;