var express = require("express")
var path = require("path")
var routes = require("./routes")
var app = express()
app.use(routes)

app.set("views", path.join(__dirname,"views"))
app.set("view engine", "ejs")

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});