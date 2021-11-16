//express - setup
const express = require('express');
// created the obj
const app = express();
require("./db/conn");
//bcrypt
const path = require('path')
const bcrypt = require('bcrypt')
//users
const users = require("./models/reg");
// const { PassThrough } = require('stream');
//port
const port = process.env.PORT || 2002;
// const hbs = require('hbs');
const staticPath = path.join(__dirname, "../public")
const templatePath = path.join(__dirname, "./template/views")

//middleware

app.use(express.static(staticPath));
//template engine
app.set('view engine', "hbs");
app.set("views", templatePath);
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.get('/', (req,res)=>{
    res.render('index')
})
app.get('/loginCrd',(req,res)=>{
    res.render('loginCrd')
})
app.get('/options',(req,res)=>{
    res.render('options')
})
// app.get('/index',(req,res)=>{
//     res.render('options')
// })
app.post("/index", async (req, res)=>{
    try{
        const pin = req.body.pin;
        const confirmPin = req.body.confirmPin;

        if(pin === confirmPin){
            const hash = await bcrypt.hash(pin, 10);
            const newUser = new users({
                    name: req.body.Name,
                    card: req.body.card,
                    pin: hash,
            })
            const registered = await newUser.save();
            res.status(200).render('index');
        }
        else{
            res.send("Password Does not match")
        }
    }
    catch(err){
        console.log(err);
        res.send("Pin Does Not Match");
    }
});
app.post('/loginCrd', async (req, res)=>{
    try{
        const pin = req.body.pin;
        const card = req.body.card;
        const Authdata = await users.findOne({card:card});
        const verify = await bcrypt.compare(pin, Authdata.pin)      
        if(Authdata === null){
            res.status(200).redirect('/index');
        }
        else{
            if(verify){
                res.status(200).render('options',{
                    name:Authdata.name
                });
            }
            else{
                res.status(400).send("Pin Does Not Match")
            }
        }
    }catch(err){
        res.status(404).send("Not Found")
    }
});
app.get('/account?',(req,res)=>{
    res.render('account')
});
app.post('/account', async(req,res)=>{
    try{
        const amount = req.body.amt;
        const fcard = req.body.fcard;
        const tcard = req.body.tcard;
        const fcardAuth = await users.findOne({card:fcard});
        const tcardAuth = await users.findOne({card:tcard});
        if(fcardAuth.balance > amount){
            // const addBalance = tcardAuth.balance + amount;
            const subBalance = parseInt(fcardAuth.balance) - parseInt(req.body.amt);
            const addBalance = parseInt(tcardAuth.balance) + parseInt(req.body.amt);
            console.log(addBalance, subBalance);
            const fcardUpdate = await users.updateOne({card:fcard},{$set:{balance:subBalance}});
            const tcardUpdate = await users.updateOne({card:tcard},{$set:{balance:addBalance}});
            res.status(200).render('success3')
        }
        else{
            res.send("Sorry Insufficient balance");
        }
    }
    catch(err){
        console.log(err);
        res.status(400).send("Not Valid")
    }
});

app.get('/withdrawal?',(req,res)=>{
    res.render('withdrawal');
});
app.get('/recharge?',(req,res)=>{
    res.render('recharge');
});
app.post('/success2', async (req,res)=>{
    res.render('success2')
});
app.get('/balance?',(req, res)=>{
    res.render('balance')
});
app.post('/balance',async (req, res)=>{
    try{
        const card = req.body.card;
        const Authdata = await users.findOne({card});
        if(Authdata.card === card){
            res.status(200).render('balance',{
                balance: Authdata.balance,
            });
        }
        else{
            console.log("hello i am in else")
            res.status(400).send("Invalid request")
        }
    }
    catch(err){
        res.status(404).send(err)
    }
    
});
app.post('/success',(req, res)=>{
    res.status(200).render('success')
});
app.listen(port, (err)=>{
    if(err){
        console.log(err);
    }
    console.log(`Running at ${port}`);
});