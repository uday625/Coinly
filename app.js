var express = require("express");
var ejs = require("ejs");
var app = new express();
var request = require("request");

app.set("view engine", "ejs");

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



    var coinDetails =[];
    var coinData = [];
    //console.log(coinDetails);
    
    var coindb =[
                    {coinName:"ICON Hyperconnect", coinSym:"ICX",icobtcValue:0.0000202,icoethValue:0.0004,icousdValue:0.121},
                    {coinName:"NEO Economy", coinSym:"NEO",icobtcValue:0.00006246,icoethValue:0.00321084,icousdValue:0.04}
                ];    
    //coins.forEach(function(coin){
    //coindb.forEach(function(coin){
    coinData = coindb.map((coin) =>{
    var url ="https://min-api.cryptocompare.com/data/price?fsym=" + coin.coinSym +"&tsyms=BTC,ETH,USD";
    //console.log("url 1"+ url);
    request(url,function(error,request,body){
       var details = JSON.parse(body) ;
       if(!error && request.statusCode==200){
            var newcoin= new coinStat(coin.coinName,coin.coinSym,coin.icobtcValue,coin.icoethValue,coin.icousdValue,details.BTC, details.ETH, details.USD);
            coinDetails.push(newcoin);
            console.log(coin.coinSym + ":" + details.USD, details.ETH, details.USD);
            console.log("Coin: " + coinDetails[0].coinSym);  
       }else{
           console.log("Result not found ");
       }
    });
        console.log("length: " + coinDetails.length);
        return coinDetails;
    }); 


// "/" home page call
app.get("/", function(req,res){
   
    //console.log("Here at the end:"+ coinDetails);
    //console.log("coinStats:"+ coinData);
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
