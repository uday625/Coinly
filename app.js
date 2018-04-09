var express = require("express");
var ejs = require("ejs");
var app = new express();
var request = require("request");

app.set("view engine", "ejs");


var coinDetails =[];
function coinStat(coin,btcValue,ethValue,usdValue) {
    this.coin =coin;
    this.btcValue =btcValue;
    this.ethValue =ethValue;
    this.usdValue =usdValue;
}

var icon= new coinStat("ICON",0.0000034, 0.0000045, 0.0000054);
var neo= new coinStat("NEO",0.0000038, 0.0000095, 0.0000074);

//coinDetails.push(icon);
//coinDetails.push(neo);

//console.log("Coin " + coinDetails[1].coin);



// "/" home page call
app.get("/", function(req,res){
   
   

    var coins =["ICX","NEO","WAN","MAN","DNT"];
    coins.forEach(function(coin){
        console.log(coin);
        var url ="https://min-api.cryptocompare.com/data/price?fsym=" + coin +"&tsyms=BTC,ETH,USD";
        console.log(url);
        request(url,function(error,request,body){
           var details = JSON.parse(body) ;
           //console.log(details.BTC);
           var newcoin= new coinStat(coin,details.BTC, details.ETH, details.USD);
           coinDetails.push(newcoin);
           console.log(details);
        });
    });
   
   //console.log("Coin " + coinDetails[2]);
   console.log("Coin " + coinDetails[1]);
   
   //res.send("Welcome to Home page");
   res.render("index");
});

// "/results" call page
app.get("/coins", function(req,res){
   //res.send("Hello, it worked") ;
    //console.log(req.query.search);
    //var query= req.query.search;
    
    var query ="SXUT";
    
    //var url= "https://www.omdbapi.com/?s=" + query + "&apikey=thewdb"
    
    var url ="https://min-api.cryptocompare.com/data/price?fsym=" + query +"&tsyms=BTC,ETH,USD";
    
    request(url,function(error, request, body){
        var results = JSON.parse(body);
        //var test =JSON.parse(results + JSON.parse(body));
        if(!error && request.statusCode==200){
            //res.send(results["Search"][0]["Title"]);
            console.log(results); 
            //console.log(test);
            //res.send("Display page");
            res.render("coins",{results:results});
        }else{
            res.send("Result Not Found");
        }
    });
});

// "/results" call page
app.get("*", function(req,res){
   res.send("Page not Found") ;
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Movie App has started...");
});
