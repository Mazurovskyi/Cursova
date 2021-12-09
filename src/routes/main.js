const Router = require('koa-router');
const indexController = require('../constructors/indexController');
const bookController = require('../constructors/bookController');

const authMiddleware = async (ctx, next) => {
    if (ctx.session.authenticated) await next();
    else ctx.redirect('/login');
}

const router = new Router();

router.get('/', indexController);

router.get('/book', authMiddleware, bookController.show);
router.post('/book', bookController.save);

router.get('/about', authMiddleware, async (ctx) => {
    await ctx.render('about', {
        isUserLoggedIn: ctx.session.authenticated || false,
    });
});

module.exports = router;