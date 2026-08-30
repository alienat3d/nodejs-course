// ? 11.14 Well, we've renamed the "whitelist" to "allowedOrigins", as it's more common naming nowadays, actually.
// (Go to [11-express-jwt/middleware/credentials.js])
const allowedOrigins = [
    'https://www.yoursite.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500'
];

module.exports = allowedOrigins;