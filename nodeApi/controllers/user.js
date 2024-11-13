const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const ExcelJS = require('exceljs');
const stream = require('stream');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const menuTestData = require('../data/menuTest.js');
const menuAdminData = require('../data/menuAdmin.js');
const { User } = require('../model/user');
const { UserCertificate } = require('../model/userCertificate');
const { Certificate } = require('../model/certificate.js');
const { UserPost } = require('../model/userPost.js');

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

// 登录
const login = async (ctx) => {
  console.log('ctx.request.body::', ctx.request.body);
  const { orgCode, optCode, password } = ctx.request.body;
  const token = jwt.sign({ orgCode, optCode, password }, 'jqh-server-jwt', {
    expiresIn: 36000000 * 24 * 7,
  });
  ctx.body = {
    status: 200,
    msg: '登录成功',
    data: {
      token,
    },
  };
};

// 获取用户信息
const userInfo = async (ctx) => {
  ctx.body = {
    status: 200,
    msg: '查询成功',
    data: {
      userName: '张三',
      userId: '12',
      avatar:
        'https://q0.itc.cn/q_70/images03/20240405/5ff2bc8e258448ae9d386bdb2b79bcd2.jpeg',
    },
  };
};

// 退出登录
const logout = async (ctx) => {
  ctx.body = {
    status: 200,
    msg: '退出登录成功',
  };
};

// 查询菜单
const permission = async (ctx) => {
  const { userName } = ctx.request.body;
  ctx.body = {
    status: 200,
    msg: '查询成功',
    data: userName == 'admin' ? menuAdminData.data : menuTestData.data,
  };
};

// 用户管理批量导入数据（从Excel文件）
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
      const userData = {};

      // 使用headers数组中的元素作为键，record数组中的元素作为值
      headers.forEach((header, index) => {
        if (
          header == 'inputTm' ||
          header == 'updateTm' ||
          header == 'reviewTm'
        ) {
          userData[header] = convertExcelDate(record[index]);
        } else {
          userData[header] = record[index];
        }
      });

      console.log('userData::', userData);

      // 假设您有一个User模型，并且它有一个save方法
      const user = new User(userData);
      await user.save(); // 保存数据到数据库
      // 在保存后，你可以通过user._id访问新生成的_id
      console.log(`Saved user with _id: ${user._id}`);
    }

    ctx.body = { status: 'success', message: '部门申请数据批量导入成功' };
  } catch (error) {
    console.error('Error during Excel batch import:', error);
    ctx.body = { status: 'error', message: '部门申请数据批量导入时发生错误' };
    ctx.status = 500;
  }
};

// 用户新增
const add = async (ctx) => {
  const body = ctx.request.body;
  console.log('新增::=======', body);
  const newUser = new User({
    ...body,
    operId: uuidv4(),
  });
  await newUser
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

// 用户查询
const query = async (ctx) => {
  const { operCode, operName, operStatus, pageSize, pageNum } =
    ctx.request.body;

  // 构建查询条件对象
  const queryConditions = {};
  if (operCode && operCode.length) {
    // queryConditions.operCode = { $regex: new RegExp(operCode, 'i') };
    queryConditions.operCode = operCode;
  }

  if (operName && operName.length) {
    // queryConditions.operName = { $regex: new RegExp(operName, 'i') };
    queryConditions.operName = operName;
  }

  if (operStatus && operStatus.length) {
    queryConditions.operStatus = {
      $in: operStatus,
    };
  }

  console.log('queryConditions::', queryConditions);

  try {
    // 同时进行分页查询和总数统计，根据查询条件
    const [docs, total] = await Promise.all([
      User.find(queryConditions)
        .limit(pageSize)
        .skip(pageSize * (pageNum - 1))
        .exec(), // 根据查询条件执行查询并返回结果
      User.countDocuments(queryConditions).exec(), // 根据查询条件执行计数并返回总数
    ]);

    console.log('docs::', docs);

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

// 用户修改
const update = async (ctx) => {
  const { _id } = ctx.request.body;
  await User.findOneAndUpdate(
    {
      _id, // 相当于 where 条件
    },
    ctx.request.body
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

// 用户详情，根据id 查询详情
const detail = async (ctx) => {
  const { _id } = ctx.query;
  const userId = new mongoose.Types.ObjectId(_id);

  // 查询用户信息
  try {
    // 并行执行查询以提高
    const [user, userPost] = await Promise.all([
      User.findById(userId).exec(),
      UserPost.find({ userId: userId }).exec(),
    ]);

    if (!user) {
      // 处理未找到用户的情况（如果需要）
      throw new Error('用户未找到');
    }

    // 提取并仅返回postId列表
    const postIdList = userPost.map((item) => item.postId);

    ctx.body = {
      status: 200,
      msg: '查询成功',
      data: {
        // ...user 会展开user对象的所有属性
        ...user.toObject(), // 如果User是一个Mongoose文档，使用toObject()将其转换为纯对象
        postList: postIdList, // 将postId列表作为postList返回
      },
    };
  } catch (err) {
    console.error('查询失败:', err);
    ctx.body = {
      status: 500,
      msg: '查询失败',
      error: err.message || '未知错误',
    };
  }
};

// 用户下载
const download = async (ctx, next) => {
  // 创建一个新的Excel工作簿
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('部门管理');

  // 设置Excel的标题行
  worksheet.addRow([
    '用户编号',
    '用户名',
    '用户姓名',
    '所属机构',
    '所属部门',
    '办公电话',
    '手机',
    '职务类型',
    '备注',
    '用户状态',
    '录入人',
    '录入时间',
    '更新人',
    '更新时间',
    '复核人',
    '复核时间',
  ]); // 示例字段名，请根据实际情况调整

  // 查询数据库并将结果添加到Excel中
  const data = await User.find({}).exec();
  data.forEach((item) => {
    worksheet.addRow([
      item.operId,
      item.operCode,
      item.operName,
      item.memCode,
      item.deptId,
      item.officeTel,
      item.mobile,
      item.updateOperName,
      item.posiType,
      item.reviewTm,
      item.remark,
      item.operStatus,
      item.operType,
      item.inputOperId,
      item.inputTm,
      item.updateOperId,
      item.updateTm,
      item.reviewOperId,
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

// 用户冻结
const freeze = async (ctx) => {
  try {
    const { _id } = ctx.request.body;

    await User.updateOne({ _id }, { operStatus: '2' });
    ctx.body = {
      status: 200,
      msg: '冻结成功',
    };
  } catch (error) {
    // 错误处理
    ctx.body = {
      status: 500,
      msg: '冻结失败',
    };
  }
};

// 用户解冻
const notFrozen = async (ctx) => {
  try {
    const { _id } = ctx.request.body;

    await User.updateOne({ _id }, { operStatus: '1' });
    ctx.body = {
      status: 200,
      msg: '解冻成功',
    };
  } catch (error) {
    // 错误处理
    ctx.body = {
      status: 500,
      msg: '解冻失败',
    };
  }
};

// 用户注销
const userLogout = async (ctx) => {
  try {
    const { _id } = ctx.request.body;

    await User.updateOne({ _id }, { operStatus: '3' });
    ctx.body = {
      status: 200,
      msg: '注销成功',
    };
  } catch (error) {
    // 错误处理
    ctx.body = {
      status: 500,
      msg: '注销失败',
    };
  }
};

// 用户重置密码
const resetPassword = async (ctx) => {
  const { _id } = ctx.request.body;
  await User.findOneAndUpdate(
    {
      _id, // 相当于 where 条件
    },
    {
      password: '123456',
    }
  )
    .then((res) => {
      if (res) {
        ctx.body = {
          status: 200,
          msg: '重置成功',
        };
      } else {
        ctx.body = {
          status: 202,
          msg: '重置失败',
        };
      }
    })
    .catch((error) => {
      console.log('error::', error);
      ctx.body = {
        status: 500,
        msg: '重置失败',
        err,
      };
    });
};

// 用户添加证书
const addCertificate = async (ctx) => {
  const body = ctx.request.body;
  console.log('新增::=======', body);
  const newUserCertificate = new UserCertificate({
    ...body,
  });
  await newUserCertificate
    .save()
    .then((res) => {
      console.log('UserCertificate saved', res);
      ctx.body = {
        status: 200,
        msg: '保存成功',
      };
    })
    .catch((err) => {
      console.error('Error saving UserCertificate:', err);
      ctx.body = {
        status: 500,
        msg: '保存失败',
        err,
      };
    });
};

// 用户查询证书
// const queryCertificate = async (ctx) => {
//   const { DN, isBind, userId, pageSize = 10, pageNum = 1 } = ctx.request.body;
//   const skip = (pageNum - 1) * pageSize;

//   // 构建查询条件对象（只针对DN，因为isBind将在后面处理）
//   const queryConditions = {};
//   if (DN && DN.length) {
//     queryConditions.DN = { $regex: new RegExp(DN, 'i') };
//   }

//   try {
//     // 查询当前用户绑定的证书ID（假设返回的是证书ID数组）
//     const userCertificateData = await UserCertificate.find(
//       { userId },
//       'certificateId'
//     );
//     const boundCertificateIds = userCertificateData.map((item) =>
//       item.certificateId.toString()
//     );

//     // 查询所有证书（先不考虑isBind）
//     const allCertificates = await Certificate.find(queryConditions)
//       .sort(/* 排序逻辑 */)
//       .skip(skip)
//       .limit(pageSize);

//     const { operCode, operName } = await User.findOne({ _id: userId }).select({
//       operName: 1,
//       operCode: 1,
//     });

//     // 根据isBind参数过滤证书列表
//     let markedCertificates;
//     if (isBind && isBind.length == 1 && isBind.includes('1')) {
//       // 假设 'true' 或 '1' 表示只查询已绑定的证书
//       markedCertificates = allCertificates.filter((cert) =>
//         boundCertificateIds.includes(cert._id.toString())
//       );
//     } else if (isBind && isBind.length == 1 && isBind.includes('0')) {
//       // 假设 'false' 或 '0' 表示只查询未绑定的证书
//       markedCertificates = allCertificates.filter(
//         (cert) => !boundCertificateIds.includes(cert._id.toString())
//       );
//     } else {
//       // 如果没有指定isBind或指定了无效的值，则返回所有证书
//       markedCertificates = allCertificates;
//     }

//     // 标记每个证书是否绑定（这一步现在是在过滤之后做的，但实际上在过滤时就已经确定了）
//     markedCertificates = markedCertificates.map((cert) => ({
//       ...cert.toObject(),
//       isBind: boundCertificateIds.includes(cert._id.toString()) ? '1' : '0', // 标记为'1'或'0'
//       operCode,
//       operName,
//     }));

//     // 格式化返回结果
//     ctx.body = {
//       status: 200,
//       msg: '查询成功',
//       data: {
//         rows: markedCertificates, // 带有isBind标记的证书列表
//         total: markedCertificates.length, // 匹配查询条件的证书总数（未过滤）
//       },
//     };
//   } catch (err) {
//     // 发生错误时返回500状态码和错误信息
//     ctx.body = {
//       status: 500,
//       msg: '查询失败',
//       error: err.message, // 返回具体的错误信息，而不是整个Error对象
//     };
//   }
// };
const queryCertificate = async (ctx) => {
  const { DN, isBind, userId, pageSize = 10, pageNum = 1 } = ctx.request.body;
  const skip = (pageNum - 1) * pageSize;

  // 构建查询条件对象（只针对DN，因为isBind将在后面处理）
  const queryConditions = {};
  if (DN && DN.length) {
    queryConditions.DN = { $regex: new RegExp(DN, 'i') };
  }

  try {
    // 查询当前用户绑定的证书ID（假设返回的是证书ID数组）
    const userCertificateData = await UserCertificate.find(
      { userId },
      'certificateId'
    );
    const boundCertificateIds = userCertificateData.map((item) =>
      item.certificateId.toString()
    );

    // 查询所有证书（先不考虑isBind）
    const allCertificates = await Certificate.find(queryConditions)
      .sort(/* 排序逻辑 */)
      .skip(skip)
      .limit(pageSize);

    const { operCode, operName } = await User.findOne({ _id: userId }).select({
      operName: 1,
      operCode: 1,
    });

    // 假设 'true' 或 '1' 表示只查询已绑定的证书
    let markedCertificates = allCertificates.filter((cert) =>
      boundCertificateIds.includes(cert._id.toString())
    );

    // 标记每个证书是否绑定（这一步现在是在过滤之后做的，但实际上在过滤时就已经确定了）
    markedCertificates = markedCertificates.map((cert) => ({
      ...cert.toObject(),
      operCode,
      operName,
    }));

    // 格式化返回结果
    ctx.body = {
      status: 200,
      msg: '查询成功',
      data: {
        rows: markedCertificates, // 带有isBind标记的证书列表
        total: markedCertificates.length, // 匹配查询条件的证书总数（未过滤）
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

const deleteCertificate = async (ctx) => {
  const { userId, certificateId } = ctx.request.body;
  await UserCertificate.deleteOne({
    userId: userId,
    certificateId: certificateId,
  })
    .then(() => {
      console.log('User-Certificate relation deleted');
      ctx.body = {
        status: 200,
        msg: '删除成功',
      };
    })
    .catch((error) => {
      console.error('Error deleting user-certificate relation', error);
      ctx.body = {
        status: 500,
        msg: '删除失败',
        err,
      };
    });
};

// 用户绑定岗位
const bindPost = async (ctx) => {
  const { userId, postIds } = ctx.request.body;

  if (!Array.isArray(postIds) || postIds.length === 0) {
    ctx.body = {
      status: 400,
      msg: '必须提供至少一个岗位ID',
    };
    return;
  }

  // 创建一个Promise数组，每个Promise都对应一个岗位ID的保存操作
  const savePromises = postIds.map(async (postId) => {
    try {
      const newUserPost = new UserPost({
        userId,
        postId,
      });
      await newUserPost.save();
      console.log(`岗位ID ${postId} 绑定成功`);
      // 在这里不需要返回任何内容，因为我们将检查Promise的完成状态
    } catch (err) {
      console.error(`岗位ID ${postId} 绑定失败:`, err);
      // 可以选择抛出错误，让Promise.all捕获它，或者在这里处理错误
      // 这里我选择抛出错误
      throw err;
    }
  });

  try {
    // 等待所有保存操作完成
    await Promise.all(savePromises);
    ctx.body = {
      status: 200,
      msg: '所有岗位绑定成功',
    };
  } catch (err) {
    // 如果有任何一个保存操作失败，Promise.all将抛出错误
    console.error('部分岗位绑定失败:', err);
    ctx.body = {
      status: 500, // 根据情况，您可能想使用更具体的状态码，如409（冲突）
      msg: '部分岗位绑定失败',
      err: err.message || '未知错误', // 根据需要调整错误信息的显示
    };
  }
};

module.exports = {
  login,
  userInfo,
  permission,
  logout,
  batchImport,
  add,
  query,
  update,
  detail,
  download,
  freeze,
  notFrozen,
  userLogout,
  resetPassword,
  addCertificate,
  queryCertificate,
  deleteCertificate,
  bindPost,
};
