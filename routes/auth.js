const express=require('express')
const passport = require('passport')
const router=express.Router()

//Auth with google
//@route GET /auth/google
router.get('/google', passport.authenticate('google', {scope: ['profile']}))
//Google auth callback
//@route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res)=>{
    res.redirect('/dashboard')
})

//Logout user
//@route GET /auth/logout
router.get('/logout', (req, res)=>{
    req.logout()
    if(req.protocol==="http"){
        res.redirect('http://server.venovedo.ro/?fHttp=true')
    }
    else {
        res.redirect('https://server.venovedo.ro')
    }
})


module.exports=router