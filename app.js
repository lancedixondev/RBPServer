require('dotenv').config();
const Express = require("express");
const app = Express();
const dbConnection = require('./db');
const controllers = require("./controllers")
const middleware = require('./middleware');

app.use(Express.json());
app.use(middleware.headers);
app.use('/user', controllers.userController);
app.use('/blog', controllers.blogController);
app.use('/posts', controllers.postsController);
app.use('/comments', controllers.commentsController);

dbConnection.authenticate()
.then(() => dbConnection.sync()) 
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log((`[Server]: App is listening on port ${process.env.PORT}`))
    })
})
.catch((err) => {
    console.log((`[Server]: Ayooooo Goodbye ${err}`));
});