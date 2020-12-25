const express=require('express')
const router=express.Router()
const {ensureAuth, ensureGuest}=require('../middleware/auth')
const Story=require('../models/Story')

//Login/Landing page
//@route GET /
router.get('/', ensureGuest, (req, res)=>{
    if(req.protocol==="http" && req.query.fHttp!="true" && process.env.HTTPS_ENABLED==="1"){
        res.redirect(process.env.HTTPS_URL)
    }
    else if(req.query.fHttp=="true" && process.env.HTTPS_ENABLED!=="1"){
        res.redirect(`${process.env.HTTP_URL}`)
    }
    else if(req.query.fHttp=="true" && req.protocol==="https"){
        res.redirect(`${process.env.HTTP_URL}/?fHttp=true`)
    }
    else{
        res.render('login', {
            layout: 'login'
        })
    }
})
//Dashboard
//@route GET /dashboard

router.get('/dashboard', ensureAuth, async (req, res)=>{
    try {
        const stories=await Story.find({user: req.user.id}).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports=router