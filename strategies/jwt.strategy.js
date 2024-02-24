const JwtStrategy = require("passport-jwt").Strategy;
const UserService = require("../services").user;
const { ExtractJwt } = require("passport-jwt");

module.exports = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "secret",
}, async (jwt_payload, done) => {
    console.log("jwt_payload");
    console.log(jwt_payload);
    let id = jwt_payload.id;
    let user = await UserService.findUserById(id);

    if (user) {
        return done(null, user);
    } else {
        return done(err, false);
    }
});
