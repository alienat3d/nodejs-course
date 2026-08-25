// 8.1.0 We'll start with importing Express.js here, just as we did in "server.js".
const express = require('express');

// 8.1.1 Then just as we have before we'll apply "express". However, now we'll define "router" instead of "app" and set this equal to "express.Router()".
const router = express.Router();

// 8.1.2 We'll also need the "path" module from Node.js here, so we'll import it here too.
const path = require('path');

// 8.1.3 Now, we'll pull the routes dedicated to the "subdir" from "server.js". (Well, actually, we didn't write the routing for the "subdir" directory in "server.js" yet, so let's create it now. However, we could copy and paste the code that handled the root route and modify it for the "subdir" directory.)
// 8.1.4 Actually, the RegEx for the file is correct because we're handling the "index.html" file too. However, we'll have to make corrections to the path inside the "path.join" method because this file is not in the root directory. First, we need to go one level up "..", then into the "view" directory, and finally into the "subdir" directory to find the "index.html" file.
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'index.html'));
});

// 8.1.5 Another route will be for the "test.html" file in the same directory, which looks similar to the previous one. We only fix the RegEx and the filename here.
// (Go to [08-express-routers/server.js])
router.get('/test(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'test.html'));
});

module.exports = router;