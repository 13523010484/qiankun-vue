# 第一阶段：构建
FROM node:18-alpine AS builder

WORKDIR /app

# 👇 关键！先只复制 package.json 和 package-lock.json
# 如果这两个文件没变，Docker 会直接使用缓存层，跳过 npm install！
COPY package*.json ./

# 设置国内镜像
RUN npm config set registry https://registry.npmmirror.com

# 安装依赖 —— 只有 package*.json 改变时才会重新执行这一步！
RUN npm install

# 👇 再复制源码（源码变动不会触发重新 install）
COPY . .

# 构建项目
RUN npm run build

# 第二阶段：部署
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# 根据你的项目修改目录（Vue: dist, React: build, etc.）
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]