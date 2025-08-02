const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'API documentation for your Node.js application',
    },
    servers: [
      {
        url: 'http://localhost:4000', // Adjust to your API's base URL
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to your API route files
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;