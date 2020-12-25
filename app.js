const express=require('express')
const fs=require('fs')
const dotenv=require('dotenv')
const morgan=require('morgan')
const exphbs=require('express-handlebars')
const connectDB=require('./config/db')
const path=require('path')
const session=require('express-session')
const passport=require('passport')
const mongoose=require('mongoose')
const MongoStore=require('connect-mongo')(session)
const methodOverride=require('method-override')
let https=true

//Load config
dotenv.config({path: './config/config.env'})

//Passport

require('./config/passport')(passport)

connectDB()
//Creating Http server
let server
const app=express()
const http=require('http').createServer(app)

//Load certificate and private key
if(process.env.HTTPS_ENABLED==="1"){
    try {
        const key=fs.readFileSync('private.key')
        const cert=fs.readFileSync('certificate.crt')
        //Creating Https server
        server=require('https').createServer({key: key, cert: cert}, app)
    } catch (err) {
        console.error("Can\'t find certicifate files")
        process.exit(1)
    }
}

//Body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())
//Method override
app.use(methodOverride((req, res)=>{
    if(req.body&&typeof req.body==="object"&&'_method' in req.body){
        let method=req.body._method
        delete req.body._method
        return method
    }
}))

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

//Handlebars Helpers
const {formatDate, stripTags, truncate, editIcon, select}=require('./helpers/hbs')

//Handlebars
app.engine('.hbs', exphbs({helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select
},defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')
app.use(express.static(path.join(__dirname, 'public')))

//Session
app.use(session({
    secret: 'sbooks',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Set global var
app.use((req, res, next)=>{
    res.locals.user=req.user || null
    next()
})

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

app.use((req, res, next)=>{
    res.status(404).render('error/404')
})

const PORT=process.env.PORT || 5000

http.listen(80, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.HTTP}`))
if(process.env.HTTPS_ENABLED==="1" && https){
    server.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
}