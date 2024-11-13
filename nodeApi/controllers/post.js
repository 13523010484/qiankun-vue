const { v4: uuidv4 } = require('uuid');
const ExcelJS = require('exceljs');
const fs = require('fs');
const XLSX = require('xlsx');
const { Post } = require('../model/post');
const { drrStatusMap, drrOperTypeMap } = require('./dic');

// 假设convertExcelDate是一个将Excel日期值转换为JavaScript Date对象的函数
function convertExcelDate(excelDateValue) {
  // Excel的基准日期是1899年12月30日，但需要注意1900年的闰年问题
  const startDate = new Date(Date.UTC(1899, 11, 30));

  // 调整时间以考虑Excel的日期系统（1900年被错误地当作闰年）
  let adjustedExcelDateValue = excelDateValue;
  if (excelDateValue > 59) {
    adjustedExcelDateValue -= 1; // 减去一天以纠正1900年的闰年错误
  }

  // 计算实际的日期和时间
  const date = new Date(
    startDate.getTime() + adjustedExcelDateValue * 86400 * 1000
  );

  // 格式化日期和时间
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以需要+1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // 组合成 yyyy-mm-dd hh:mm:ss 格式
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}

// 申请岗位批量导入数据（从Excel文件）
const batchImport = async (ctx) => {
  try {
    if (!ctx.request.files || !ctx.request.files.file) {
      throw new Error('No file uploaded.');
    }

    const filePath = ctx.request.files.file.filepath;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // 假设我们处理第一个工作表
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      blankrows: false,
    }); // 假设第一行是标题行

    // 已经从Excel数据中获取了二维数组data
    const headers = data.shift(); // 移除第一行数据（表头），并获取它作为headers
    // 遍历剩余的数据行
    for (const record of data) {
      const postData = {};

      // 使用headers数组中的元素作为键，record数组中的元素作为值
      headers.forEach((header, index) => {
        if (
          header == 'drrDate' ||
          header == 'reviewTm' ||
          header == 'revokeTm'
        ) {
          postData[header] = convertExcelDate(record[index]);
        } else {
          postData[header] = record[index];
        }
      });

      // 假设您有一个postData模型，并且它有一个save方法
      const post = new Post(postData);
      await post.save(); // 保存数据到数据库
      // 在保存后，你可以通过post._id访问新生成的_id
      console.log(`Saved department application with _id: ${post._id}`);
    }

    ctx.body = { status: 'success', message: '岗位申请数据批量导入成功' };
  } catch (error) {
    console.error('Error during Excel batch import:', error);
    ctx.body = { status: 'error', message: '岗位数据批量导入时发生错误' };
    ctx.status = 500;
  }
};

// 岗位申请查询：待复核 (1.待复核; 3.复核拒绝;4.已撤销)
const query = async (ctx) => {
  const { drrStatus, drrOperType, pageSize, pageNum } = ctx.request.body;

  // 构建查询条件对象
  const queryConditions = {
    drrStatus: {
      $in: ['1', '3', '4'],
    },
  };

  if (drrStatus && drrStatus.length) {
    queryConditions.drrStatus = {
      $in: drrStatus,
    };
  }

  if (drrOperType && drrOperType.length) {
    queryConditions.drrOperType = {
      $in: drrOperType,
    };
  }

  try {
    // 同时进行分页查询和总数统计，根据查询条件
    let [docs, total] = await Promise.all([
      Post.find(queryConditions)
        .lean()
        .limit(pageSize)
        .skip(pageSize * (pageNum - 1))
        .exec(), // 根据查询条件执行查询并返回结果
      Post.countDocuments(queryConditions).exec(), // 根据查询条件执行计数并返回总数
    ]);

    // 遍历查询结果，将drrStatus的数字值替换为映射的描述
    docs = docs.map((doc) => {
      if (doc.drrStatus && drrStatusMap[doc.drrStatus]) {
        doc.drrStatusName = drrStatusMap[doc.drrStatus];
      }
      if (doc.drrOperType && drrOperTypeMap[doc.drrOperType]) {
        doc.drrOperTypeName = drrOperTypeMap[doc.drrOperType];
      }
      return doc;
    });

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

// 岗位申请查询：已复核(2.复核通过)
const reviewedQuery = async (ctx) => {
  const { pageSize, pageNum } = ctx.request.body;

  // 构建查询条件对象
  const queryConditions = {
    drrStatus: '2',
  };

  try {
    // 同时进行分页查询和总数统计，根据查询条件
    let [docs, total] = await Promise.all([
      Post.find(queryConditions)
        .lean()
        .limit(pageSize)
        .skip(pageSize * (pageNum - 1))
        .exec(), // 根据查询条件执行查询并返回结果
      Post.countDocuments(queryConditions).exec(), // 根据查询条件执行计数并返回总数
    ]);

    // 遍历查询结果，将drrStatus的数字值替换为映射的描述
    docs = docs.map((doc) => {
      if (doc.drrStatus && drrStatusMap[doc.drrStatus]) {
        doc.drrStatusName = drrStatusMap[doc.drrStatus];
      }
      if (doc.drrOperType && drrOperTypeMap[doc.drrOperType]) {
        doc.drrOperTypeName = drrOperTypeMap[doc.drrOperType];
      }
      return doc;
    });

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

// 岗位申请复核
const review = async (ctx) => {
  try {
    // 解构赋值直接从请求体中获取_id和drrStatus
    const { _id } = ctx.request.body;

    // 更新操作，这里不再硬编码drrStatus的值
    await Post.updateOne({ _id }, { drrStatus: '2' });
    ctx.body = {
      status: 200,
      msg: '复核成功',
    };
  } catch (error) {
    // 错误处理
    ctx.body = {
      status: 500,
      msg: '撤销失败',
    };
  }
};

// 岗位申请撤销
const revoke = async (ctx) => {
  try {
    // 解构赋值直接从请求体中获取_id和drrStatus
    const { _id } = ctx.request.body;
    console.log('撤销::===========================', _id);

    // 更新操作，这里不再硬编码drrStatus的值
    await Post.updateOne({ _id }, { drrStatus: '4' });
    ctx.body = {
      status: 200,
      msg: '撤销成功',
    };
  } catch (error) {
    // 错误处理
    ctx.body = {
      status: 500,
      msg: '撤销失败',
      error: err.message, // 返回具体的错误信息，而不是整个Error对象
    };
  }
};

// 岗位申请详情，根据id 查询详情
const detail = async (ctx) => {
  const { _id } = ctx.query;
  await Post.find({ _id })
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

// 岗位申请下载
const download = async (ctx, next) => {
  // 创建一个新的Excel工作簿
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('岗位申请管理');

  // 设置Excel的标题行
  worksheet.addRow([
    '申请编号',
    '申请日期',
    '操作类型',
    '岗位编号',
    '岗位名称',
    '备注',
    '申请状态',
    '申请人',
    '复核人',
    '复核时间',
    '撤销时间',
  ]);

  // 查询数据库并将结果添加到Excel中
  const data = await Post.find({}).exec();
  data.forEach((item) => {
    worksheet.addRow([
      item.drrCode,
      item.drrDate,
      item.drrOperType,
      item.deptId,
      item.deptName,
      item.remark,
      item.drrStatus,
      item.inputOperName,
      item.reviewOperName,
      item.reviewTm,
      item.revokeTm,
    ]);
  });

  // 设置HTTP响应头
  ctx.set(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  ctx.set('Content-Disposition', 'attachment; filename="Posts.xlsx"');

  // 生成Excel文件的Buffer
  const excelBuffer = await workbook.xlsx.writeBuffer();

  // 将Buffer作为响应体发送
  ctx.body = excelBuffer;

  await next();
};

// 查询岗位名称
const postName = async (ctx) => {
  try {
    // 使用 await 等待异步操作完成
    const posts = await Post.find({}).select({ _id: 1, postName: 1 });

    ctx.body = {
      status: 200,
      msg: '查询成功',
      data: posts.map((item) => ({ code: item._id, name: item.postName })),
    };
  } catch (err) {
    // 发生错误时返回500状态码和错误信息
    ctx.body = {
      status: 500,
      msg: '查询失败',
      error: err.message || '未知错误', // 返回具体的错误信息，或默认信息
    };

    // 可以在这里添加额外的错误处理逻辑，如日志记录等
    console.error('查询过程中发生错误:', err);
  }
};

const permissionId = async (ctx) => {
  const { ids } = ctx.request.body;
  console.log('ids::', ids);
  const data = [];

  if (ids.includes('66715869f3089e9e858da9b3')) {
    data.push('department:query');
  }
  if (ids.includes('66715869f3089e9e858da9b5')) {
    data.push('department:add');
  }
  if (ids.includes('66715869f3089e9e858da9b7')) {
    data.push('departmentApplication:add');
  }
  if (ids.includes('66715869f3089e9e858da9b9')) {
    data.push('permissionManagement:position:query');
  }
  if (ids.includes('66715869f3089e9e858da9bb')) {
    data.push('userAdmin:add');
  }

  ctx.body = {
    status: 200,
    msg: '查询成功',
    data: data,
  };
};

module.exports = {
  batchImport,
  review,
  revoke,
  query,
  reviewedQuery,
  detail,
  download,
  postName,
  permissionId,
};
