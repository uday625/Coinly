var express = require("express");
var ejs = require("ejs");
var app = new express();
var request = require("request");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/Coins");

app.set("view engine", "ejs");





var coinSchema = new mongoose.Schema({
    coinName: String,
    coinSymbol: String,
    icobtcValue: Number,
    icoethValue: Number,
    icousdValue: Number
});

var Coin = mongoose.model("coin", coinSchema);


//adding new cat to the datbase

//     var coindb =[
//                     {coinName:"ICON", coinSym:"ICX",btcValue:0.0004035,ethValue:0.005642,usdValue:3.58},
//                     {coinName:"NEO", coinSym:"NEO",btcValue:0.008377,ethValue:0.1171,usdValue:74.26}
//                 ]

// var ICON = new Coin({
//     coinName: "Icon",
//     coinSymbol:"ICX",
//     icobtcValue:0.00004035,
//     icoethValue:0.00040,
//     icousdValue:0.11
// })

// ICON.save(function(err,icx){
//     if(err){
//         console.log("SOMETHING WENT WRONG");
//     }else{
//         console.log("WE JUST SAVED A ICON TO THE DATABASE");
//         console.log(icx);
//     }
// });

// Coin.create({
//     coinName: "Wanchain",
//     coinSymbol:"WAN",
//     icobtcValue:0.00004035,
//     icoethValue:0.00090,
//     icousdValue:0.36
    
// }, function(err,wan){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(wan);
//     }
// });

//retrieve all coins from the database and console.long for each one
Coin.find({}, function(err,coins){
    if(err){
        console.log("OH NO, ERROR!");
        console.log(err);
    }else{
        console.log("ALL THE COINS....");
        //console.log(coins);
        coins.forEach(function(coin){
            console.log(coin.coinName, coin.coinSymbol);
        });
    }
});



// "/" home page call
app.get("/", function(req,res){
   res.render("index");
});

// "/results" call page
app.get("/coins", function(req,res){
    
    
    var coinDetails =[];
    function coinStat(coinName,coinSymbol,icobtcValue,icoethValue,icousdValue,btcValue,ethValue,usdValue) {
        this.coinName = coinName;
        this.coinSymbol =coinSymbol;
        this.icobtcValue = icobtcValue;
        this.icoethValue = icoethValue;
        this.icousdValue = icousdValue;
        this.btcValue =btcValue;
        this.ethValue =ethValue;
        this.usdValue =usdValue;
    }    
    
    

    //var coins =["ICX","NEO","WAN","MAN","DNT"];
    // var coindb =[
    //                 {coinName:"ICON Hyperconnect", coinSym:"ICX",icobtcValue:0.0004035,icoethValue:0.005642,icousdValue:0.20},
    //                 {coinName:"NEO Economy", coinSym:"NEO",icobtcValue:0.008377,icoethValue:0.1171,icousdValue:0.32}
    //             ];    
     
    //coins.forEach(function(coin){
    
    Coin.find({}, function(err,coins){
        if(err){
            console.log("OH NO, ERROR!");
            console.log(err);
        }else{
            coins.forEach(function(coin){
                var url ="https://min-api.cryptocompare.com/data/price?fsym=" + coin.coinSymbol +"&tsyms=BTC,ETH,USD";
                //console.log(url);
                request(url,function(error,request,body){
                var details = JSON.parse(body) ;
                if(!error && request.statusCode==200){
                    var newcoin= new coinStat(coin.coinName,coin.coinSymbol,coin.icobtcValue,coin.icoethValue,coin.icousdValue,details.BTC, details.ETH, details.USD);
                    coinDetails.push(newcoin);
                    console.log(coin.coinSymbol + ":" + details.USD, details.ETH, details.USD);
                    console.log("Coin: " + coinDetails[0].coinSymbol);  
                }else{
                   res.send("Result not found ");
                }
            });
        });

        }
    });    
        
    
    
    
    // coindb.forEach(function(coin){
    //     //var url ="https://min-api.cryptocompare.com/data/price?fsym=" + coin +"&tsyms=BTC,ETH,USD";
    // }); 
    //res.render("coins",{results:results});
    res.render("coins",{coinDetails:coinDetails});
   
});
    
// "/results" call page
app.get("*", function(req,res){
   res.send("Page not Found") ;
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Coinly App has started...");
});
