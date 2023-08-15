let express = require('express');
let path = require('path'); // Add the 'path' module for working with file paths
let app = express();
const port = 8080; // Replace with your desired port number
const bodyParser = require('body-parser');
// Set the directory where your static assets (e.g., HTML, CSS, images) are located
app.use(express.static(path.join(__dirname, 'FIT 2095 WORK')));

// Define a route for the home page
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html')); // Send the index.html file
});

app.use(bodyParser.urlencoded({extended:true}));
app.get('/category/32586949/add', function(req, res) { 
    res.sendFile(path.join(__dirname,'addcategory.html'));
});


// Start the server
app.listen(port);
