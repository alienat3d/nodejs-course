"MongoDB" is "M" in MERN Stack, and it represents the DataBase. The frontend in MERN is handled by React ("R") along with Node.js ("N") and Express.js ("E") MongoDB completes the RestAPI. Traditional SQL-databases are built in a traditional relational structure. Related tables reference each other with joins as data is queried. These relational tables also normalize the data. That means data is not duplicated in the tables ("DRY" principle). However, with no SQL-databases like MongoDB you can throw all of that out. MongoDB stores data in collections and the individual records in the collections are called "documents":

`{
    _id: ObjectId("6178381e46324"),
    username: "al",
    password: "$2b$11$tWpdc7",
    roles: {
        User: 2001,
        Editor: 1984
    },
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
}`

The "documents" have a "key: value" structure and look a lot like JSON. A collection holds all the data about a user for example instead of breaking it into related tables and likewise duplicating and distributing the data where deemed necessary in a NoSQL-structure is permitted. 

So why choose NoSQL-databases? Advantages:
* Performance is key: the speed at which a collection is queried is very fast;
* Flexibility: it's very easy to make structural changes like adding a new field without wreaking havoc in your total structure. It is much like adding a new property to an object;
* Scalability: NoSQL can support large databases with high request rates at a very low latency;
* Usability: we can get up and running with MongoDB in the cloud very fast.

? 1.0.0 Let's start with https://www.mongodb.com/. After creating (or logging in) an account we'll head to "All projects" and click on "New Project" button. We'll name the project and after that it asks to set permissions or members, and it'll assign that to your default account. We don't need to add anything here so far as we already have our account listed as "Project Owner" there. So, just click "Create Project". Next, we'll creat a DB cluster by clicking on "Create" button in the "Database" section. For the sake of learning and testing we'll choose "Free plan" by now and then click on "Create Deployment". After that we'll click on "Add data" button to add our custom data to the MongoDB database. Then it'll ask us to input the Database name and Collection name. That is what we're going to do and then click "Create Database".

? 1.0.1 Now that mongodb.com has created an empty database and collection for our inputted data, we need to go to the "Security" section, then "Database & Network Access." This is where we create users. Let's add a user by clicking the "Add new database user" button. The user should have read and write access to the database.

? 1.0.2 Then, we'll return to our cluster overview and wait for the message "We are deploying your changes..." to disappear. Finally, we'll click on the "Connect" button. In the pop-up window, choose "Drivers" to connect to the DB via MongoDB's native drivers. This gives us a connection string. Notice that there are places in the string to replace with our username and password. 

1.1 We need to copy that string back to our code. First, we'll open our ".env" file with the secret codes and add an extra line: "DATABASE_URI". We'll set it equal to the MongoDB connection string that we recently copied from the MongoDB website. And will be using the "process.env" to pull this value out when we need it to connect. 

1.2.0 We actually need to put it in three different files. And really we could've just put it at the beginning of the project, as we not really require here other things like JWT that need to go in individual files as they're needed. So this can just go at the beginning of server.js
(Go to [13-mongodb-mongoose-intro/middleware/verifyJWT.js])