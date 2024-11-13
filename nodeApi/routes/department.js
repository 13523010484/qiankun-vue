const Router = require('koa-router');
const department = require('../controllers/department.js');
const router = new Router({
  prefix: '/api',
});

// 新增
router.post('/department/add', department.add);
// 查询
router.post('/department/query', department.query);
// 修改
router.post('/department/update', department.update);
// 详情
router.get('/department/detail', department.detail);
// 下载
router.get('/department/download', department.download);

module.exports = router;
