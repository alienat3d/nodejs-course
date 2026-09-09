> Authentication vs. Authorization

The terms "authentication" and "authorization" are being confused and often used interchangeably, but they're not the same things. 
Authentication refers to the process of verifying who someone is. 
Authorization is the process of verifying what specific resources a use has access to.
When we log in with the username and password we're verifying who we are and that is considered to be authentication. After logging in our express API issues users JSON Web Tokens. While it's true the tokens confirm the authentication process has already taken place. These tokens also allow access to our API endpoints which provide our API data. This is authorization. A hint towards that fact is that a JWT-token uses the authorization header.

In this tutorial we'll expand the authorization process by adding user roles with specific permissions to our API authorization process.
(Go to [12-express-user-roles/config/roles_list.js])