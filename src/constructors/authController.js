const bcrypt = require('bcrypt');
const _ = require('lodash');
const User = require('../models/User');

const showLogin = async (ctx) => {
    await ctx.render('loginForm', {
        isUserLoggedIn: ctx.session.authenticated || false,
    });
}

const loginHandler = async (ctx) => {
    const { name, lastname, email, password } = ctx.request.body;
    const isUserExist = await User.findOne({ email });
    if (_.isEmpty(isUserExist)) {
        const hashedPass = bcrypt.hashSync(password, 10);
        const newUser = new User({ name, lastname, email, password: hashedPass });
        const res = await newUser.save();
        ctx.session.authenticated = true;
        ctx.session.id = res._id;
        ctx.session.name = res.name;
    } else if (!_.isEmpty(isUserExist)) {
        const isUserPassValid = bcrypt.compareSync(password, isUserExist.password);
        if (isUserPassValid) {
            ctx.session.authenticated = true;
            ctx.session.id = isUserPassValid._id;
            ctx.session.name = isUserPassValid.name;
        }
    }

    ctx.redirect('/book');
}

const logoutHandler = (ctx) => {
    console.log('Youre gonna logout');
    if (ctx.session.authenticated === true) {
        ctx.session.authenticated = false;
        ctx.session.id = null;
        ctx.session.name = null;
        ctx.status = 200;
        ctx.redirect('/');
    }
}

module.exports = {
    showLogin,
    loginHandler,
    logoutHandler,
}