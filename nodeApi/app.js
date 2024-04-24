// app.js
/**
 * 下面的代码写了一个 todolist 的增删查的接口，目的有两个：
 * 1、验证主项目中配置 proxy 代理访问子项目的接口
 * 2、验证主项目中是否可以正确加载子项目的静态资源，和服务端的资源
 * **/
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { v4: uuidv4 } = require('uuid');

const app = new Koa();
const router = new Router({
  prefix: '/api',
}); // 设置前缀

// 使用bodyParser中间件解析请求体
app.use(bodyParser());

const getCurrentDateTime = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 注意，JavaScript中的月份是从0开始的，所以需要加1
  const date = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // 为了保证格式统一，当值小于10时前面补0
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDate = date < 10 ? `0${date}` : date;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${year}-${formattedMonth}-${formattedDate} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const tableData = [];

// 带有前缀的路由
router.get('/table/list', (ctx, next) => {
  ctx.body = {
    data: tableData,
  };
});

// 创建POST接口
router.post('/table/save', async (ctx, next) => {
  const newData = ctx.request.body;
  console.log('newData::', newData);
  tableData.push({
    id: uuidv4(),
    date: getCurrentDateTime(),
    ...newData,
  });

  ctx.body = {
    status: 200,
    message: 'success',
  };
});

// 创建POST接口
router.post('/table/del', async (ctx, next) => {
  const { id } = ctx.request.body;
  const index = tableData.findIndex((item) => item.id == id);
  tableData.splice(index, 1);

  ctx.body = {
    status: 200,
    message: 'success',
  };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
