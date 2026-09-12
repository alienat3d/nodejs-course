? 1.0.0 In this tutorial we're going to create Mongoose schemas and data models that will allow us to perform
CRUD-operations on our MongoDB data collections. We'll start with creating a schema using Mongoose docs for
help (https://mongoosejs.com/docs/guide.html). As it says in the docs: "Everything in Mongoose starts with a Schema.
Each schema maps to a MongoDB collection and defines the shape of the documents within that collection". So, there is also an example of schema for a blog, where it's declared the data types for the different fields inside the documents that will be created with data model. And if we scroll down the docs a little bit further we'll see all the permitted schema types. Well "ObjectId" is important one, but it will be created automatically for us, so we don't need to specify an ID, as you don't see one specified on this example below either. 

<script lang="js">
    const blogSchema = new Schema({
      title: String, /* String is shorthand for {type: String} */
      author: String,
      body: String,
      comments: [{ body: String, date: Date }],
      date: { type: Date, default: Date.now },
      hidden: Boolean,
      meta: {
        votes: Number,
        favs: Number
      }
    });
</script>

1.1.0 So, let's get started creating our schemas for both our employees data and our users data. We've got "employees.json" & "users.json" because we were using just Node.js file system to write to both of these files, and we're going to get rid of that eventually, as we replace everything with MongoDB. Okay, let's start with creating a new schema file called "Employee.js" in that "model" folder.
(Go to [14-mongodb-mongoose-models/model/Employee.js])