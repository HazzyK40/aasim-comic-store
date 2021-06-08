var express = require("express")
var https = require('https');

var router = express.Router();

var count = {};
router.get("/:id", function(req,res){
    console.log("with id")
    if(count[req.params.id]==null){
        count[req.params.id] = 1;
    }else{
        count[req.params.id] = count[req.params.id] + 1;
    }
    https.get("https://xkcd.com/"+req.params.id+"/info.0.json", (resp)=>{
        
        let data = '';
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            https.get("https://xkcd.com/info.0.json", (respi)=>{
                let datai = '';
                // A chunk of data has been received.
                respi.on('data', (chunki) => {
                    datai += chunki;
                });

                // The whole response has been received. Print out the result.
                respi.on('end', () => {
                    try{console.log(data)}catch(e){return}
                    var pData = JSON.parse(data)
                    var transcript = pData["transcript"];
                    try{
                        transcript = transcript.split("[[").join("<br/><b style=\"color:grey;font-family:Sans-serif;\">")
                        transcript = transcript.split("]]").join("</b><br/>")
                        transcript = transcript.split("{{").join("<br/><i style=\"display:none\"'>")
                        transcript = transcript.split("}}").join("</i><br/>")
                        transcript = transcript.split("\n").join("<br/>")
                    }catch(e){
                        transcript = pData["transcript"];
                    }
                    var parsed = {
                        month : pData["month"],
                        num : pData["num"],
                        link : pData["link"],
                        year : pData["year"],
                        news : pData["news"],
                        safe_title : pData["safe_title"],
                        transcript : transcript,
                        alt : pData["alt"],
                        img : pData["img"],
                        title : pData["title"],
                        day : pData["day"],
                        max: JSON.parse(datai)["num"],
                        count:count[req.params.id],
                        random: Math.floor(Math.random() * (JSON.parse(datai)["num"] - 1 + 1) + 1)
                    }   
                    res.render("main", {data:parsed});
                });
            });
            
        });
    });
});

router.get("/", function(req,res){
    console.log("home")
    https.get("https://xkcd.com/info.0.json", (resp)=>{
        let data = '';
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            var pData = JSON.parse(data)
            var transcript = pData["transcript"];
            try{
                transcript = transcript.split("[[").join("<br/><b style=\"color:grey;font-family:Sans-serif;\">")
                transcript = transcript.split("]]").join("</b><br/>")
                transcript = transcript.split("{{").join("<br/><i style=\"display:none\"'>")
                transcript = transcript.split("}}").join("</i><br/>")
                transcript = transcript.split("\n").join("<br/>")
            }catch(e){
                transcript = pData["transcript"];
            }
            if(count[pData["num"]]==null){
                count[pData["num"]] = 1;
            }else{
                count[pData["num"]] = count[pData["num"]] + 1;
            }
            var parsed = {
                month : pData["month"],
                num : pData["num"],
                link : pData["link"],
                year : pData["year"],
                news : pData["news"],
                safe_title : pData["safe_title"],
                transcript : transcript,
                alt : pData["alt"],
                img : pData["img"],
                title : pData["title"],
                day : pData["day"],
                max: pData["num"],
                count:count[pData["num"]],
                random: Math.floor(Math.random() * (JSON.parse(data)["num"] - 1 + 1) + 1)
            }   
            res.render("main", {data:parsed});
        });
    });
});
    

module.exports = router;