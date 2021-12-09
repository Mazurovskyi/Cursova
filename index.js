const Koa = require('koa');
const session = require('koa-session');
const path = require('path');
const config = require("config");
const bodyParser = require('koa-bodyparser');
const mainRoutes = require('./src/routes/main');
const authRoutes = require('./src/routes/authRoutes');
const render = require('koa-ejs');
const static = require('koa-static');
const mongoose = require('mongoose');
const cors = require('@koa/cors');

const app = new Koa();
const PORT = config.get('Server.Port') || 3000;
const mongo_auth = config.get('Mongo.Auth')

app.keys = ['lets celebrate'];

const CONFIG = {
  key: 'koa.sess',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true, 
  rolling: false,
  renew: false, 
  secure: false,
  sameSite: null, 
};

app.use(session(CONFIG, app));
app.use(cors());
app.use(bodyParser({
  extendTypes: {
    json: ['application/x-javascript'] // will parse application/x-javascript type body as a JSON string
  }
}));
app.use(static(__dirname + '/src/public'));

async function main() {
  try{
      await mongoose.connect(`mongodb+srv://${mongo_auth}@cluster0.jzeol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(() => console.log('db has been connected'))
      
      render(app, {
          root: path.join(__dirname, 'views'),
          layout: 'layout',
          viewExt: 'html',
          cache: false,
          debug: true,
        });

      app.use(mainRoutes.routes());
      app.use(authRoutes.routes());
      app.listen(PORT, () => { console.log(`Server has been started on ${PORT} port`) });
  }catch(e){
    throw e;
  }
}

main();


//   mongodb+srv://vladpanchuk:vlad300800V@cluster0.jzeol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority