const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('./models').User;

module.exports = passport => {
    passport.use(new Strategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    },
        function (jwtPayload, cb) {
            console.log('payload', jwtPayload);
            return User.findOne({ where: { email: jwtPayload.email } })
                .then(user => {
                    return cb(null, user);
                }).catch(error => {
                    return cb(error);
                })
        }));
}