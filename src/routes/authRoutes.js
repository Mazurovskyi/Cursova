const Router = require('koa-router');
const { loginHandler, showLogin, logoutHandler } = require('../constructors/authController');

const router = new Router();

router.get('/login', showLogin);
router.post('/login', loginHandler);

router.post('/logout', logoutHandler);

module.exports = router;