const express = require('express');
const app = express();
const userService = require('../services/user');
const postService = require('../services/post');
const commentService = require('../services/comment');
const {validateLogin} = require('../utils/validators')
const {FbAuth} = require('../utils/FbAuth')
const firebase = require('firebase');
const config = require('../utils/config');
firebase.initializeApp(config);

//public routes
app.get('/:user_id',(req,res) =>{
  const {user_id} = req.params;
  userService.read(user_id)
    .then(response => {
      res.json(response)
    }, err =>{
      throw new Error('user does not exist')
    })
    .catch(err=>{
      res.send(err.response.data)
  })
})

app.post('/',(req,res) => {
  const {username,email,password} = req.body
  let user_id;
  let token;
  firebase.auth().createUserWithEmailAndPassword(email,password)
    .then(data =>{
      user_id = data.user.uid;
      return data.user.getIdToken()
    })
    .then(idToken => {
      token = idToken
      return userService.create(username,email,user_id)
    })
    .then(()=>{
      res.status(201).json({token})
    })
    .catch(err => {
      console.error(err)
      if(err.code === 'auth/email-already-in-use'){
        return res.status(400).json({general: 'email already in use'})
      }
      res.status(500).json({error:err.code})
    })
})

app.get('/:user_id/posts',(req,res) => {
  const {user_id} = req.params;
  postService.read(user_id)
    .then(response => {
      res.status(201).json(response)
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({error:err.code})
    })
})

app.get('/:user_id/comments',(req,res) => {
  const {user_id} = req.params;
  commentService.read(user_id)
    .then(response => {
      res.status(201).json(response)
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({error:err.code})
    })
})

app.post('/login',(req,res) => {
  const {email,password} = req.body;
  const valResult = validateLogin(email,password)
  if(!valResult.valid){
    return res.status(400).json(valResult.errors)
  }
  firebase.auth().signInWithEmailAndPassword(email,password)
    .then((data)=>{
      return data.user.getIdToken()
    })
    .then(idToken =>{
      res.status(201).json({token:idToken})
    })
    .catch(err => {
      console.errors(err)
      res.status(500).json({err:err.code})
    })
})

//private routes
app.put('/',FbAuth,(req,res) => {
  const uid = req.uid;
  const {username,email} = req.body;
  userService.update(username,email,uid)
    .then(()=>{
      return userService.readWuid(uid)
    })
    .then(data => res.json(data))
    .catch(err => {
      console.error(err);
      res.status(500).json({error:err.code})
    })
})

app.delete('/',FbAuth,(req,res) =>{
  const uid = req.uid;
  commentService.delte
  userService.delete(uid)
    .then(()=>{
      res.status(201).json({message:'user deleted'})
    })
})

module.exports = {
  userApp : app
}

