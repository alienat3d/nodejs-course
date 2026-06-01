(Link to "Node.js Full Course for Beginners | Complete All-in-One Tutorial | 7 Hours")[https://www.youtube.com/watch?v=f2EqECiTBL8]
>> (Lesson 1):
* We could use Node.js in terminal console just like a browser console by running `node` and then typing something like `2 + 2`. Or we can run any JS file from terminal with `node "path-to-file"` (.js is not necessary need). 
* To quit Node.js we shall hit "Ctrl" + "C" twice or type `.exit`.
* Different to Vanilla JS in Node.js there is a global object instead of window object. The window object referred to the browser where we could do `Window.innerHeight` and different properties like that. The Node.js global object is smaller but does have some of the same properties we used to seeing in the window object.
  (Go to [01/server.js])
* Node.js has common modules that we'll explore in this course. They're related to the file system and the other things we can do on the server. And to import those common (as well as any other) modules we use CommonJS imports instead of ES6 imports.
  (Go to [01/server.js])
>> (Lesson 4):
* When it comes to versioning of the packages at NPM, for each one we have semantic version numbers for example `^8.3.2`. Where the first number means `a major version`, the second — `a minor version` and the third number means `a patch`. The carrot `^` in front means "Go ahead and allow an update to the minor version and the patch if needed, but don't update a major version", as a major version possibly can have breaking changes to our app, so we don't necessary want to allow this and put it on risk. This is what we see by default, when installing some of NPM packages to the project.
* If we'll see a package version without a carrot in front `8.3.2` that would mean `Specifically this version and only this version for this project will work`.
* If we'll have a tilda in front of a version like that `~8.3.2` that would mean `Go ahead and update a patch version, but don't update a minor or a major versions`.
* If we'll have an astrix instead of a version `*`, then it would mean `Go ahead and update everything all the time and use the absolute latest version`. That's not too safe, although we might see it.
* If we specifically want to install any version of a package then we'll run such command (when installing "uuid" for example): `npm i uuid@8.3.1` and if we would type in `npm i uuid` then we'd get the latest version of "uuid" package.
* Also, if we want to check for newer minor or patch versions of our installed packages after some time, we can run `npm update`.
* To uninstall the package we can use `npm uninstall packageName`, `npm un packageName` or `npm rm packageName`. And if we're going to install