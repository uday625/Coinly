var express = require("express");
var ejs = require("ejs");
var app = new express();
var request = require("request");

app.set("view engine", "ejs");


var coinDetails =[];
function coinStat(coinName,coinSym,icobtcValue,icoethValue,icousdValue,btcValue,ethValue,usdValue) {
    this.coinName = coinName;
    this.coinSym =coinSym;
    this.icobtcValue = icobtcValue;
    this.icoethValue = icoethValue;
    this.icousdValue = icousdValue;
    this.btcValue =btcValue;
    this.ethValue =ethValue;
    this.usdValue =usdValue;
}

// var icon= new coinStat("ICON",0.0000034, 0.0000045, 0.0000054);
// var neo= new coinStat("NEO",0.0000038, 0.0000095, 0.0000074);

//coinDetails.push(icon);
//coinDetails.push(neo);

//console.log("Coin " + coinDetails[1].coin);


//     var coindb =[
//                     {coinName:"ICON", coinSym:"ICX",btcValue:0.0004035,ethValue:0.005642,usdValue:3.58},
//                     {coinName:"NEO", coinSym:"NEO",btcValue:0.008377,ethValue:0.1171,usdValue:74.26}
//                 ]

// console.log(coindb[0].coinName, coindb[0].usdValue,typeof(coindb[0].usdValue), coindb[1].coinName); 



// "/" home page call
app.get("/", function(req,res){
   
    // var coins =["ICX","NEO","WAN","MAN","DNT"];

    
    // coins.forEach(function(coin){
    //     //console.log(coin);
    //     var url ="https://min-api.cryptocompare.com/data/price?fsym=" + coin +"&tsyms=BTC,ETH,USD";
    //     //console.log(url);
    //     request(url,function(error,request,body){
    //       var details = JSON.parse(body) ;
    //       //console.log(details.BTC);
    //       var newcoin= new coinStat(coin,details.BTC, details.ETH, details.USD);
    //       coinDetails.push(newcoin);
    //         console.log(coin + ":" + details.USD, details.ETH, details.USD);
    //         console.log("Coin: " + coinDetails[0].coin);  
    //     });
    // });
   
   //console.log("Coin " + coinDetails[2]);
   //console.log("Coin " + coinDetails[1]);
   
   //res.send("Welcome to Home page");
   res.render("index");
});

// "/results" call page
app.get("/coins", function(req,res){

    //var coins =["ICX","NEO","WAN","MAN","DNT"];
    var coindb =[
                    {coinName:"ICON Hyperconnect", coinSym:"ICX",icobtcValue:0.0004035,icoethValue:0.005642,icousdValue:0.20},
                    {coinName:"NEO Economy", coinSym:"NEO",icobtcValue:0.008377,icoethValue:0.1171,icousdValue:0.32}
                ];    
     
    //coins.forEach(function(coin){
    coindb.forEach(function(coin){
        //var url ="https://min-api.cryptocompare.com/data/price?fsym=" + coin +"&tsyms=BTC,ETH,USD";
        var url ="https://min-api.cryptocompare.com/data/price?fsym=" + coin.coinSym +"&tsyms=BTC,ETH,USD";
        request(url,function(error,request,body){
           var details = JSON.parse(body) ;
           if(!error && request.statusCode==200){
                var newcoin= new coinStat(coin.coinName,coin.coinSym,coin.icobtcValue,coin.icoethValue,coin.icousdValue,details.BTC, details.ETH, details.USD);
                coinDetails.push(newcoin);
                console.log(coin.coinSym + ":" + details.USD, details.ETH, details.USD);
                console.log("Coin: " + coinDetails[0].coinSym);  
           }else{
               res.send("Result not found ");
           }
        });
    }); 
    //res.render("coins",{results:results});
    res.render("coins",{coinDetails:coinDetails});
   
});
    
    //var query ="SXUT";
    //var url= "https://www.omdbapi.com/?s=" + query + "&apikey=thewdb"
    //var url ="https://min-api.cryptocompare.com/data/price?fsym=" + query +"&tsyms=BTC,ETH,USD";
    
    // request(url,function(error, request, body){
    //     var results = JSON.parse(body);
    //     //var test =JSON.parse(results + JSON.parse(body));
    //     if(!error && request.statusCode==200){
    //         //res.send(results["Search"][0]["Title"]);
    //         console.log(results); 
    //         //console.log(test);
    //         //res.send("Display page");
    //         res.render("coins",{results:results});
    //     }else{
    //         res.send("Result Not Found");
    //     }
    // });


// "/results" call page
app.get("*", function(req,res){
   res.send("Page not Found") ;
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Coinly App has started...");
});
