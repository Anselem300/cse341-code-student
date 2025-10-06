/* eslint-disable prettier/prettier */
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');

module.exports = function(passport){
    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: process.env.GITHUB_CALLBACK_URL,
                scope: ['user:email'],
            },
            async function (accessToken, refreshToken, profile, done) {
                try{
                    const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || null;
                    const username = profile.username || profile.displayName || (email ? email.split('@')[0] : 'github_user');


                    if (!email) {
                    // GitHub may not return email; treat as error for simplicity
                    return done(new Error('No email available from GitHub'), null);
                    }


                    let user = await User.findOne({ email });
                    if (!user) {
                    user = new User({ username, email, password: 'oauth' });
                    await user.save();
                    }


                    return done(null, user);
                }
                catch (err) {
                    return done(err, null)
                }
            }
        )
    )
}