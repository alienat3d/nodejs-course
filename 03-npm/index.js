// ? 3.0 Here, we'll discuss NPM (Node Package Manager). It's a service that we often use to add Node modules created by other developers to our projects. To add a new module, we can use the "install," "i," or "add" commands in the terminal console after "npm," followed by the package name. With the "-g" flag, we can install the package globally so that we can use it no matter what directory we're in, without adding it to a specific project. The "nodemon" package will now look for the "index.js" file. We can run "nodemon" instead of "node index". However, if the file name is different from "index", we will still write "nodemon filename". Now, "nodemon" will watch this file. If we make any changes and save, it'll update the result in the terminal console.

// ? 3.1.0 Next, we will add a package to our project. First, we must initialize NPM for our project using the command npm init. This command will ask us questions to customize the package.json file. If we are okay with the standard settings, we can add the "-y" flag to skip the questions. Then, we'll type "npm i date-fns" to install a Node module called "date-fns" to work with dates.
// ? 3.1.1 It has been installed as a dependency, and we can see it inside the "package.json" file listed inside the "dependencies" object. These are production dependencies listed here, so when the project would build with a build command it would include this package, because we would know it would be part of the overall application that needed to go into production.
// ? 3.1.2 We can also have "devDependencies." Before we get to that, let's look at the file tree. Now that we have a "package-lock.json" file, we won't change anything inside it. That's handled by NPM. We'll just work with "package.json".

// 3.2.0 So, let's use the "date-fns" module that we installed. We can then destructure the "format" from it that we're going to use.
const {format} = require("date-fns");

// 3.5.0 We'll add another module with NPM, which will be a production dependency "uuid", which allows us to generate IDs which different for each entry. And here it's a little difference how we will import it here. In ES6 we would write "import { uuid as 'name we want to give it' } ...", but here we want to import a version, which is a specific version v4, but we want to import that as "uuid".
const {v4: uuid} = require("uuid");

// 4.5.3 But we'll keep it as the first variant and then run "uuid" function.
// ? 4.5.4 And if we run our app we'll notice that "uuid" will generate a new unique ID each time we add or change something in a code and that can be useful including with something we would log such as an event whether it's an error, a request or anything we might want to write to a log file we might want to give each entry its own ID.
console.log(uuid());

// ? 3.5.1 We may see it done in different ways as well. So instead of as we wrote above some could write it like that:
// const {v4} = require("uuid");
// ? 4.5.2.0 Or we may see something like that:
// const uuid = require("uuid");
// ? 4.5.2.1 And then referring to v4 later in a code. ↑
// console.log(uuid.v4());

// 3.2.1 And we'll use that "format" in console.log to log the date and current time in specific format with "\t" for tab space between them:
console.log(format(new Date(), "dd/MM/yyyy\tHH:mm:ss"));

// 3.3 All right, we've already installed "nodemon" as a global package, but we should still add it to the project as a "devDependency." For example, we could use the command "npm i nodemon -D" (or the longer version of the flag, "--save-dev", which is the same). Now, it's added to the "devDependencies" object in the "package.json", meaning it won't be included in the build version of our app because it's only a "development dependency."
// 3.4.0 So let's talk about scripts and how to run our app using scripts, because that's what server will use if we were to host this somewhere. We often see a "start" script, a "dev" script and a "build" script when working with different frontend frameworks like "React.js", "Vue.js" and so on.
// 3.4.1 So let's go ahead and add a "start" script. And there as a value we'll add "node index", because that's what we want to run our project with. We won't need "test" script here, so we can remove it and add another script "dev" and specify its value as "nodemon index".

