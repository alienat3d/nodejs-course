const express = require('express');
const router = express.Router();
const path = require('path');

// 8.2.1 It's pretty similar to what we did with the "subdir" router before. We don't really need to create the routes because we already have them in "server.js." We'll cut those lines of code and paste them here, fixing the paths to the files in the "path.join" method.
// (Go to [08-express-routers/server.js])
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

router.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html'); //302 by default
});

module.exports = router;