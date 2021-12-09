
const index = async (ctx) => {
    
    const data = { title: 'Main', isUserLoggedIn: ctx.session.authenticated || false };
    
    await ctx.render('index', data);
}

module.exports = index;