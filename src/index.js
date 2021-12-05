var express = require('express');
var app = express();

app.get('/', (req, res) => {
    res.send("Here it is, the aid app!");
});

app.listen(80, () => {
    console.log("Listening on port 80!");
});
