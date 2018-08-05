
//Require all the packages
var express                 = require("express");
var ejs                     = require("ejs");
var methodOverride          = require("method-override");
var bodyParser              = require("body-parser");
var request                 = require("request");
var mongoose                = require("mongoose");
var expressSanitizer        = require("express-sanitizer");
var LocalStrategy           = require("passport-local");
var passportLocalMongoose   = require("passport-local-mongoose");
var passport                = require("passport");
var User                    = require("./models/user");


mongoose.connect("mongodb://localhost/Coins");

var app                 = new express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//PASSPORT CONFIGURATION

app.use(require("express-session")({
   secret: "Durga Puja 2018 will be awesome!", 
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
});



//Create the db schema
var coinSchema = new mongoose.Schema({
    coinName: String,
    coinSym:  String,
    icobtcValue: Number,
    icoethValue: Number,
    icousdValue: Number,
    coinDescription: String
});
// create the db model
var Coin = mongoose.model("Coin", coinSchema);

function coinStat(_id, coinName,coinSym,icobtcValue,icoethValue,icousdValue,btcValue,ethValue,usdValue) {
    this._id      = _id;
    this.coinName = coinName;
    this.coinSym =coinSym;
    this.icobtcValue = icobtcValue;
    this.icoethValue = icoethValue;
    this.icousdValue = icousdValue;
    this.btcValue =btcValue;
    this.ethValue =ethValue;
    this.usdValue =usdValue;
}

var coinDetails =[];

// Coin.create(
//         {
//             coinName:"ICON Hyperconnect", 
//             coinSym:"ICX",
//             icobtcValue:0.0000202,
//             icoethValue:0.0004,
//             icousdValue:0.121
//         }, (err,coin)=>{
//             if(err){
//                 console.log("SOMETHING WENT WRONG");
//             }else{
//                 console.log("WE JUST SAVED A COIN TO THE DATABASE");
//                 console.log(coin);
//             }
// });

Coin.find({}, (err,coins)=>{
    if(err){
        console.log("OH NO, ERROR!");
        console.log(err);
    }else{
        coins.forEach(coin=>{
                console.log(coin.coinName, coin.coinSym);
                var url ="https://min-api.cryptocompare.com/data/price?fsym=" + coin.coinSym +"&tsyms=BTC,ETH,USD";
                request(url,function(error,request,body){
                   var details = JSON.parse(body) ;
                   if(!error && request.statusCode==200){
                        var newcoin= new coinStat(coin._id,coin.coinName,coin.coinSym,coin.icobtcValue,coin.icoethValue,coin.icousdValue,details.BTC, details.ETH, details.USD);
                        coinDetails.push(newcoin);
                   }else{
                       console.log("Result not found ");
                   }
                });
                //return coinDetails;            
        });
    }
});


    
    // var coindb =[
    //                 {coinName:"ICON Hyperconnect", coinSym:"ICX",icobtcValue:0.0000202,icoethValue:0.0004,icousdValue:0.121},
    //                 {coinName:"NEO Economy", coinSym:"NEO",icobtcValue:0.00006246,icoethValue:0.00321084,icousdValue:0.04}
    //             ];    
    // //coins.forEach(function(coin){
    // //coindb.forEach(function(coin){
    // coinData = coindb.map((coin) =>{
    // var url ="https://min-api.cryptocompare.com/data/price?fsym=" + coin.coinSym +"&tsyms=BTC,ETH,USD";
    // //console.log("url 1"+ url);
    // request(url,function(error,request,body){
    //   var details = JSON.parse(body) ;
    //   if(!error && request.statusCode==200){
    //         var newcoin= new coinStat(coin.coinName,coin.coinSym,coin.icobtcValue,coin.icoethValue,coin.icousdValue,details.BTC, details.ETH, details.USD);
    //         coinDetails.push(newcoin);
    //         console.log(coin.coinSym + ":" + details.USD, details.ETH, details.USD);
    //         console.log("Coin: " + coinDetails[0].coinSym);  
    //   }else{
    //       console.log("Result not found ");
    //   }
    // });
    //     console.log("length: " + coinDetails.length);
    //     return coinDetails;
    // }); 


// INDEX PAGE
app.get("/", function(req,res){
    res.render("index");
});

// DISPLAY ALL COIN
app.get("/coins", function(req,res){
    res.render("coins",{coinDetails:coinDetails});
});

// CREATE NEW COIN 
app.post("/coins",function(req,res){
    
    req.body.coin.body = req.sanitize(req.body.coin.body);
    
    Coin.create(req.body.coin,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.render("coins",{coinDetails:coinDetails});
        }
    });
    
});


//NEW -GET form to intake data to route to POST method
app.get("/coins/new", isLoggedIn, function(req, res){
    res.render("new");
});

//EDIT ROUTE
app.get("/coins/:id/edit", (req,res)=>{
    Coin.findById(req.params.id,(err,foundCoin)=>{
        if(err){
            res.render("/coins");
        }else{
            res.render("edit",{coin:foundCoin});
        }
    });
    
});

//UPDATE ROUTE
app.put("/coins/:id",(req,res)=>{
    req.body.coin.body = req.sanitize(req.body.coin.body);
    
    Coin.findByIdAndUpdate(req.params.id, req.body.coin, (err,updatedCoin)=>{
        if(err){
            res.redirect("/coins");
        }else{
            res.redirect("/coins/" + req.params.id);
        }
        
    });
});

//DELETE ROUTE
app.delete("/coins/:id", (req,res)=>{
   Coin.findByIdAndRemove(req.params.id, (err)=>{
       if(err){
           res.redirect("/coins");
       }else{
           res.redirect("/coins");
       }
   });
});

//SHOW PAGE - Show a particular coin 
app.get("/coins/:id", (req,res)=>{
    
    Coin.findById(req.params.id, (err,foundCoin)=>{
        if(err){
            res.redirect("/coins");
        }else{
            res.render("show", {coin:foundCoin});
        }
    });
});



//===============
// AUTH ROUTES 
//===============

//show register form
app.get("/register", isLoggedIn, (req,res)=>{
    res.render("register");
});

// handle sign up logic
app.post("/register",(req,res)=>{
    
    var newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/coins");
        });
    });
    
});


//show login form
app.get("/login", (req,res)=>{
    res.render("login");
});
//handling login logic

//app.post("/login", middleware, callback);
app.post("/login", passport.authenticate("local", 
        {
                successRedirect:"/coins", 
                failureRedirect:"/login"
        }),(req, res)=>{
    
});

//logout route
app.get("/logout", (req,res)=>{
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



// ANY OTHER PAGE
app.get("*", function(req,res){
   res.send("Page not Found") ;
});

// LIST PORT AND IP
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Coinly App has started...");
});
