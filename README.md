# 幺玖玖品牌策划官网

专业增长型品牌官网，包含案例展示、案例详情、微信咨询入口和轻量案例后台。

## 本地运行

```bash
npm install
npm run dev
```

如需本地联调 Netlify Functions 和 Blobs：

```bash
npm run netlify:dev
```

## 环境变量

部署到 Netlify 后，请在项目环境变量中设置：

```bash
ADMIN_PASSWORD=your-strong-password
```

未设置时，后台默认密码为：

```bash
change-me-199
```

## 常用路径

- 官网首页：`/`
- 案例详情：`/cases/:id`
- 案例后台：`/admin`
- 公开案例接口：`/api/cases`
- 后台案例接口：`/api/admin/cases`

## 替换微信信息

微信号和二维码在 `src/content.ts` 中配置。当前微信号为 `Soen_Nov24`，二维码图片为 `public/brand/wechat-qr.png`。
