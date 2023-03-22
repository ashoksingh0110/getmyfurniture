const express = require('express')
const hbs = require('hbs')
const path = require('path')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", 
        port: 587,
        secure:false,
        requireTLS: true,
        auth:{
            user:process.env.MAILSENDER,
            pass:process.env.PASSWORD
        }
})


app.use(express.static("./views")) //to use css, images etc. i.e. public files

// app.set("views","./views") // used to set views folder... when views is the folder name then this line is optional
app.set("view engine","hbs") //used to set template engine
hbs.registerPartials(path.join(__dirname,"./views/partials"))//used to register partials

const encoder = bodyParser.urlencoded()

app.get("/",(req,res)=>{
    res.render("index") //when returning any page we use ==>  response.render("filename")
})
app.get("/gallery",(req,res)=>{
    res.render("gallery") 
}) 
app.get("/services",(req,res)=>{
    res.render("services") 
})
app.get("/contact",(req,res)=>{
    res.render("contact",{show:false}) 
})
app.post("/contact",encoder,(req,res)=>{
    let mailOption = {
        from:process.env.MAILSENDER,
        to:req.body.email,
        subject:"Your Query Recieved !!! : Team LuxuryFurniture",
        text:"Thanks for Sharing Your Query with us !!\n Our Team will contact you shortly"
    }
    transporter.sendMail(mailOption,(error,data)=>{
        if(error)
        console.log(error)
    })
    mailOption = {
        from:process.env.MAILSENDER,
        to:process.env.MAILSENDER,
        subject:"One New Query Recieved !!!",
        text:`
                Name    : ${req.body.name}
                Email   : ${req.body.email}        
                Phone   : ${req.body.phone}        
                Subject : ${req.body.subject}        
                Message : ${req.body.message}        
        `
    }
    transporter.sendMail(mailOption,(error,data)=>{
        if(error)
        console.log(error)
    })
    res.render("contact",{show:true}) 
})
app.get("/about",(req,res)=>{
    res.render("about") 
})

let PORT = process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log(`Server is running at PORT ${PORT}`);
 })