const Pool = require('pg').Pool
const multer = require('multer')
const router = require('express').Router()
const fs = require('fs')
const bcryt = require('bcryptjs')

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "instagram",
  password: "admin",
  port: 5432
})

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads')
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname+'-'+ Date.now()+'.png')
  }
})

var upload = multer({ storage: storage })

router.get('/', (req, res)=>{
  pool.query('select * from user_account')
    .then((data)=>{
      res.status(200).json(data.rows)
    })
    .catch((err)=>{
      res.status(400).json(err)
    })
})

router.post('/register', upload.single('profile_picture'),(req, res)=>{
  const data = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    profile_picture: req.file.filename,
    password2: req.body.password2
  }

  if( data.name!= '' && data.username!= '' && data.password!= '' && data.email!= '' && data.profile_picture!= '' && data.password2!='' ){
    if(data.password === data.password2){
      bcryt.genSalt(10, (err, salt)=>{
        bcryt.hash(data.password, salt, (err, hash)=>{
          if(err) throw err;
          data.password = hash
          console.log(data)
          pool.query('INSERT INTO user_account(name, username, password, email, profile_picture) VALUES($1, $2, $3, $4, &5)', [data.name, data.username, data.password, data.email, data.profile_picture], (err, user)=>{
            if(err){
              res.status(400).json(err)
            }else{
              res.status(200).json('User has been added')
            }
          })
        })
      })
    }
  }else{
    res.status(400).json('Please Enter all the details')
  }

})

module.exports = router
