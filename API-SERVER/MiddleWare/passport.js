// const passport = require("passport-jwt");
const passport = require("passport");
const User = require("../Modals/userModal");

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = (req,res,next)=>{
  const opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = 'sruthi';

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwt_payload);
      User.findOne({id: jwt_payload.sub}, function(err, user) {
        // console.log("From passport"+user);

          if (err) {
              // return done(err, false);
              return next();
          }
          if (user) {
              // return done(null, user);
              req.userId = jwt_payload.sub;
              return next();
          } else {
              // return done(null, false);
              // or you could create a new account
          }

      });

  }));

  next();

};
