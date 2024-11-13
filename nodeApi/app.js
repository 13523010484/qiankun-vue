const Koa = require('koa');

const { koaBody } = require('koa-body');
const jsonError = require('koa-json-error');
const parameter = require('koa-parameter');
const koajwt = require('koa-jwt');

const { connectDB } = require('./db/index.js');

const user = require('./routes/user.js');
const department = require('./routes/department.js');
const departmentApplication = require('./routes/departmentApplication.js');
const certificate = require('./routes/certificate.js');
const post = require('./routes/post.js');
const userApplication = require('./routes/userApplication.js');

const app = new Koa();

// 登录校验，除了登录、注册的路由不需要校验外，其他都需要校验
app.use(
  koajwt({
    secret: 'jqh-server-jwt',
  }).unless({
    path: [/^\/api\/user\/login/],
  })
);

// 注意 bodyParser router 有先后顺序
app.use(jsonError());
app.use(
  koaBody({
    multipart: true, // 支持文件上传
    formidable: {
      maxFileSize: 2000 * 1024 * 1024, // 限制文件上传大小，例如2GB
    },
  })
);
app.use(parameter(app));

// 连接数据库
connectDB();

app.use(user.routes()).use(user.allowedMethods());
app.use(department.routes()).use(department.allowedMethods());
app
  .use(departmentApplication.routes())
  .use(departmentApplication.allowedMethods());
app.use(certificate.routes()).use(certificate.allowedMethods());
app.use(post.routes()).use(post.allowedMethods());
app.use(userApplication.routes()).use(userApplication.allowedMethods());

app.listen(3000);
