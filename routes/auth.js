const router = require('express').Router()
const user = require('../models/User')
const bcrypt = require('bcrypt')
const passport = require('passport')
//const uploadCloud = require('../helpers/cloudinary')

//MIDLES

function isAuth(req,res,next){
  //if(req.session.currentUser){
  if(req.isAuthenticated()){
    res.redirect('/')
  }else{
    next()
  }
}

//LOGGED
function isLoggedIn(req,res,next){
  //if(req.session.currentUser){
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect('/login?next=' + req.path)
  }
}


//PROFILE
//uter.post('/profile',  
//isLoggedIn, 
////upload.single('cover'),
//uploadCloud.fields([{name:"cover", maxCount:1}, {name:"photoURL", maxCount:1}]),
//(req,res)=>{
//  if(req.files.photoURL) {
//    //req.body.photoURL = "/uploads/" + req.files.photoURL[0].filename
//    req.body.photoURL = req.files.photoURL[0].url
//  }
//  if(req.files.cover) {
//    req.body.cover = req.files.cover[0].url
//  } 
//  User.findByIdAndUpdate(req.user._id, req.body)
//  .then(()=>{
//    res.redirect('/profile')
//  })
//
//
//uter.get('/profile', isLoggedIn, (req,res)=>{
//res.render('auth/profile', req.user)
//

//LOGIN
router.post('/login', passport.authenticate('local'), (req,res,next)=>{
  console.log(req.query)
  if(req.query.next) res.redirect(req.query.next)
   else res.redirect('/profile')
  })

router.get('/login', isAuth, (req,res,next)=>{
  let ctx = {}
  if(req.query.next) ctx.next = req.query.next
  res.render('auth/login', ctx)
})


//SIGNUP
router.post('/signup', (req,res,next)=>{
  if(req.body.password !== req.body.password2){
    res.render('auth/signup', {...req.body, errors:{password:""}})
    return
   }
   User.register(req.body, req.body.password)
   .then(user=>{
     sendWelcomeMail(user.username, user.email)
     res.redirect('/login')
   })
   .catch(e=>next(e))
 })

 
router.get('/signup', (req, res, next)=>{
  res.render('auth/signup')
})

module.exports = router