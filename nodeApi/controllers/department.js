const { v4: uuidv4 } = require('uuid');
const ExcelJS = require('exceljs');
const stream = require('stream');
const path = require('path');
const fs = require('fs');
const { Department } = require('../model/department');

// 部门新增
const add = async (ctx) => {
  const body = ctx.request.body;
  console.log('新增::=======', body);
  const newDepartment = new Department(body);
  await newDepartment
    .save()
    .then((res) => {
      console.log('User saved', res);
      ctx.body = {
        status: 200,
        msg: '保存成功',
      };
    })
    .catch((err) => {
      console.error('Error saving user:', err);
      ctx.body = {
        status: 500,
        msg: '保存失败',
        err,
      };
    });
};

// 部门查询
const query = async (ctx) => {
  const { deptName, memCode, deptStatus, pageSize, pageNum } = ctx.request.body;

  // 构建查询条件对象
  const queryConditions = {};

  if (deptName && deptName.length) {
    queryConditions.deptName = { $regex: new RegExp(deptName, 'i') };
  }

  if (memCode && memCode.length) {
    queryConditions.memCode = {
      $in: memCode,
    };
  }

  if (deptStatus && deptStatus.length) {
    queryConditions.deptStatus = {
      $in: deptStatus,
    };
  }

  try {
    // 同时进行分页查询和总数统计，根据查询条件
    const [docs, total] = await Promise.all([
      Department.find(queryConditions)
        .limit(pageSize)
        .skip(pageSize * (pageNum - 1))
        .exec(), // 根据查询条件执行查询并返回结果
      Department.countDocuments(queryConditions).exec(), // 根据查询条件执行计数并返回总数
    ]);

    // 格式化返回结果
    ctx.body = {
      status: 200,
      msg: '查询成功',
      data: {
        rows: docs,
        total,
      },
    };
  } catch (err) {
    // 发生错误时返回500状态码和错误信息
    ctx.body = {
      status: 500,
      msg: '查询失败',
      error: err.message, // 返回具体的错误信息，而不是整个Error对象
    };
  }
};

// 部门修改
const update = async (ctx) => {
  const { _id, deptName, memCode, parentDept, deptStatus, remark } =
    ctx.request.body;
  await Department.findOneAndUpdate(
    {
      _id, // 相当于 where 条件
    },
    {
      deptName,
      memCode,
      parentDept,
      deptStatus,
      remark,
    }
  )
    .then((res) => {
      console.log('更新::', res);
      if (res) {
        ctx.body = {
          status: 200,
          msg: '修改成功',
        };
      } else {
        ctx.body = {
          status: 202,
          msg: '修改失败',
        };
      }
    })
    .catch((error) => {
      console.log('error::', error);
      ctx.body = {
        status: 500,
        msg: '修改失败',
        err,
      };
    });
};

// 部门详情，根据id 查询详情
const detail = async (ctx) => {
  const { _id } = ctx.query;
  await Department.find({ _id })
    .then((res) => {
      ctx.body = {
        status: 200,
        msg: '查询成功',
        data: res[0],
      };
    })
    .catch((err) => {
      ctx.body = {
        status: 500,
        msg: '查询失败',
        err,
      };
    });
};

// 部门下载
const download = async (ctx, next) => {
  // 创建一个新的Excel工作簿
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('部门管理');

  // 设置Excel的标题行
  worksheet.addRow([
    '部门编号',
    '部门名称',
    '所属机构',
    '备注',
    '部门状态',
    '录入人',
    '更新人',
    '更新时间',
    '复核人',
    '复核时间',
  ]); // 示例字段名，请根据实际情况调整

  // 查询数据库并将结果添加到Excel中
  const data = await Department.find({}).exec();
  data.forEach((item) => {
    worksheet.addRow([
      item.deptId,
      item.deptName,
      item.memCode,
      item.remark,
      item.deptStatus,
      item.inputOperName,
      item.updateOperName,
      item.updateTm,
      item.reviewOperName,
      item.reviewTm,
    ]); // 根据实际字段名调整
  });

  // 设置HTTP响应头
  ctx.set(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  ctx.set('Content-Disposition', 'attachment; filename="departments.xlsx"');

  // 生成Excel文件的Buffer
  const excelBuffer = await workbook.xlsx.writeBuffer();

  // 将Buffer作为响应体发送
  ctx.body = excelBuffer;

  await next();
};

module.exports = {
  add,
  query,
  update,
  detail,
  download,
};
