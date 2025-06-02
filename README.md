# 郭佳仑 💕 钱海宁 - 我们的爱情记录网站

一个专为郭佳仑和钱海宁设计的美好回忆记录网站，记录从2023年9月26日开始的爱情故事。

## 🌟 功能特色

### 💘 爱情计数器
- 实时显示在一起的天数、小时数、分钟数
- 从确认关系的那一刻开始计算
- 每分钟自动更新

### 📅 时间轴
- 记录重要的恋爱里程碑
- 按时间顺序展示美好回忆
- 可以添加、删除回忆事件
- 支持自定义日期、标题和描述

### 💬 留言板
- 郭佳仑和钱海宁都可以留言
- 支持选择留言者身份
- 显示留言时间
- 可以删除留言
- 支持 Ctrl+Enter 快捷发送

### 📸 照片墙
- 上传和展示你们的合影
- 支持多张照片同时上传
- 点击照片可以放大查看
- 每张照片都有时间戳
- 可以删除不需要的照片

### 🎨 美好回忆
- 专门的回忆记录区域
- 卡片式展示
- 可以添加详细的回忆描述

## 🚀 本地使用方法

1. **打开网站**：双击 `index.html` 文件在浏览器中打开

2. **添加回忆**：
   - 在时间轴部分点击"添加回忆"按钮
   - 填写日期、标题和描述
   - 点击保存即可

3. **发送留言**：
   - 在留言板输入框中写下想说的话
   - 选择留言者身份（郭佳仑/钱海宁）
   - 点击"发送爱意"按钮

4. **上传照片**：
   - 在照片墙点击"上传照片"按钮
   - 选择一张或多张图片
   - 照片会自动添加到照片墙

5. **导航**：
   - 点击顶部导航菜单快速跳转到不同部分
   - 支持平滑滚动效果

## 🌐 部署为公开网站

### 方法一：GitHub Pages（推荐）

1. **创建GitHub仓库**：
   - 在GitHub上创建新仓库，命名如：`love-memory-website`
   - 设置为公开仓库

2. **上传文件**：
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Love memory website"
   git branch -M main
   git remote add origin https://github.com/你的用户名/love-memory-website.git
   git push -u origin main
   ```

3. **启用GitHub Pages**：
   - 进入仓库的 Settings 页面
   - 滚动到 "Pages" 部分
   - 在 "Source" 下选择 "Deploy from a branch"
   - 选择 "main" 分支和 "/ (root)" 文件夹
   - 点击 "Save"

4. **获取网站地址**：
   - 几分钟后，网站将在 `https://你的用户名.github.io/love-memory-website/` 可访问

### 方法二：Netlify

1. **注册Netlify账号**：访问 [netlify.com](https://netlify.com)

2. **部署网站**：
   - 将所有文件打包成zip
   - 直接拖拽到Netlify的部署区域
   - 或连接GitHub仓库自动部署

3. **自定义域名**（可选）：
   - 在Netlify控制台设置自定义域名

### 方法三：Vercel

1. **注册Vercel账号**：访问 [vercel.com](https://vercel.com)

2. **导入项目**：
   - 连接GitHub仓库
   - 选择项目并部署

### 方法四：Firebase Hosting

1. **安装Firebase CLI**：
   ```bash
   npm install -g firebase-tools
   ```

2. **初始化项目**：
   ```bash
   firebase login
   firebase init hosting
   ```

3. **部署**：
   ```bash
   firebase deploy
   ```

## 💾 数据存储

- 所有数据都保存在浏览器的本地存储（localStorage）中
- 数据不会丢失，除非主动清除浏览器数据
- 可以通过控制台导出数据备份

## 🔧 高级功能

在浏览器控制台中，你可以使用以下命令：

```javascript
// 导出所有数据
window.loveWebsite.exportData()

// 清除所有数据（谨慎使用）
window.loveWebsite.clearAllData()

// 添加测试回忆
window.loveWebsite.addSampleMemory()
```

## ⌨️ 键盘快捷键

- `Ctrl + Enter`：在留言输入框中快速发送留言
- `Esc`：关闭打开的模态框

## 📱 响应式设计

- 完美支持桌面、平板和手机浏览
- 在移动设备上自动调整布局
- 触摸友好的交互设计

## 🎨 设计特色

- 紫色渐变主题，浪漫温馨
- 毛玻璃效果和阴影
- 飘动的心形背景装饰
- 平滑的动画过渡
- 现代化的卡片式设计

## 🔮 未来计划

- [ ] 添加更多主题颜色选择
- [ ] 支持照片编辑功能
- [ ] 添加音乐播放器
- [ ] 创建更多纪念日提醒
- [ ] 支持数据同步功能

## 💝 特别说明

这个网站是为了记录郭佳仑和钱海宁美好的爱情时光而创建的，希望你们的每一个回忆都能在这里得到珍藏。

**从2023年9月26日开始，愿你们的爱情故事永远美好！** 🌹

---

*Made with 💕 for 郭佳仑 & 钱海宁* 