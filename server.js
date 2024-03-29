const express = require('express');
const expressGraphQL = require('express-graphql');
const schemaConfig = require('./schema.js');

const app = express();

app.use('/graphql', expressGraphQL({
    schema: schemaConfig,
    graphiql: true
}))

app.listen(4000, ()=>{
    console.log('Server is running on port 4000');
})
