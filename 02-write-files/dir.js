// 2.8.0 Let's do here something new, we'll create a directory with "mkdir" method.
// 2.8.1 Earlier we threw an error on purpose because we attempted to read a file that didn't exist. Well, we can check to see if files and directories exist or not so we don't get those errors. We also might want to check in this regard to say if the directory already exists let's not create it, because we don't want to write over what we already have. So we can use the "existsSync" method inside of condition and creating that directory only if it's not exist.
// ? 2.8.2 It can be fairly useful to check for file existence before we attempt to delete, rename or copy a file.
const fs = require("fs");
const path = require("path");

if (!fs.existsSync(path.join(__dirname, "new"))) {
  fs.mkdir(path.join(__dirname, "new"), (err) => {
    if (err) throw err;
    console.log("Directory created");
  });
} else {
  console.log("Directory is already exists");
}

// 2.9 Now, let's write some code to delete a directory. Here, we're checking for the directory's existence. If it exists, we'll attempt to delete it with the "rmdir" method.
if (fs.existsSync(path.join(__dirname, "new"))) {
  fs.rmdir(path.join(__dirname, "new"), (err) => {
    if (err) throw err;
    console.log("Directory removed");
  });
} else {
  console.log("Directory doesn't exist");
}