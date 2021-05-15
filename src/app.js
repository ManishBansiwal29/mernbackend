require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn"); 
const bcrypt = require("bcryptjs");


const path = require("path");

const port = process.env.PORT || 3000;

const hbs = require("hbs");

const publicPath = path.join(__dirname,"../public");
const viewPath = path.join(__dirname,"../src/templates/views");
const partialsPath = path.join(__dirname,"../src/templates/partials");
const Register = require('./models/register');
// console.log(path.join(__dirname,"../src/views/index"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(publicPath));

app.set("view engine", "hbs");
app.set("views",viewPath);
hbs.registerPartials(partialsPath);

app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/login", async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});

        

        // if(useremail.password === password){
        const isMatch = await bcrypt.compare(password,useremail.password);
        console.log(isMatch);
        const token = await useremail.generateAuthTokens();
        console.log("the login token is " + token);
        if(isMatch){
            res.status(201).render("index");
        }else{
            res.send("Invalid email or password");
        }
    }catch(e){
        res.status(400).send(e) 
    }
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.post('/register',async (req,res)=>{
    try{
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        
        if(password === confirmpassword){
            const registerEmployee = new Register({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                gender:req.body.gender,
                phone:req.body.phone,
                age:req.body.age,
                password:req.body.password,
                confirmpassword:req.body.confirmpassword
            })

            const token = await registerEmployee.generateAuthTokens();
            console.log(`the token is ${token}`);

            const registered = await registerEmployee.save();
            res.status(201).render("index");
        }else{
            res.send("not matched password")
        }
    }catch(e){
        res.status(400).send(e);
    }
})

app.get("/",(req,res)=>{
    res.send("Hello");
})

app.listen(port,()=>{
    console.log(`${port} is running`);
})
