const JwtStrategy = require("passport-jwt").Strategy;
const userRepository = require('../repositories').users;
const { ExtractJwt } = require("passport-jwt");

module.exports = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "secret",
}, async (jwt_payload, done) => {
    let id = jwt_payload.id;
    let user = await userRepository.findUserById(id);

    if (user) {
        return done(null, user);
    } else {
        return done(err, false);
    }
});
