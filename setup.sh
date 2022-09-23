#!/bin/bash

echo "start to setup blog..."
npm install  # 安装依赖
npm install hexo-deployer-git --save # 安装部署工具

# 生成静态文件
hexo g
# 本地测试
hexo server

echo "success to setup blog!"
