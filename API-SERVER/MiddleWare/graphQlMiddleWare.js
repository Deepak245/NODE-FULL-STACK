const { graphqlHTTP } = require('express-graphql');
const authenticate = require("../MiddleWare/passport")();

const graphqlSchema = require("./GraphQl/schema");
const graphqlResolver = require("./GraphQl/resolvers");

module.exports=graphqlHTTP((req,res)=>{
  const next = (req.user,info={})=>{
    schema:graphqlSchema,
    rootValue:graphqlResolver,
    graphiql:true,
    context: {
          user: user || null,
          auth: authentication
        },
    customFormatErrorFn(err){
      if(!err.originalError){
        return err;
      }
      const data = err.originalError.data;
        const message = err.message || 'An error occurred.';
        const code = err.originalError.code || 500;
        return { message: message, status: code, data: data };
    }
  };
});
