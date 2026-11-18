# 蓝星智能教室 · 前端

Vue 3、Vite、TypeScript、Pinia 和 Element Plus。提供师生预约、教室管理员审核、系统管理三个工作台。

## 本地运行

需要 Node.js 18+。先在同级的 [GraduationProject 后端](https://github.com/Kaolennoodle/GraduationProject)目录启动演示服务：

```sh
mvn spring-boot:run -Dspring-boot.run.profiles=demo
```

然后在本目录运行：

```sh
npm ci
npm run dev
```

打开 <http://127.0.0.1:5173>。Vite 会将 `/api` 请求转发到本机 `8081` 端口。

| 演示账号 | 体验流程 |
| --- | --- |
| `student` | 按容量和位置筛选教室、查看占用时段、预约、查看结果 |
| `steward` | 查看并审核负责教室的申请 |
| `manager` | 管理用户、教室和预约 |

演示账号的密码都是 `Lanxing2026`。演示数据由后端创建，重启后恢复初始状态。

## 构建与部署

`npm run build` 会先做 TypeScript 检查，再生成 `dist/`。部署时，为前端路由配置回退到 `index.html`，并把 `/api/*` 转发给后端，转发时删除 `/api` 前缀。

`src/router/workspaces.ts` 定义三个角色的导航入口。登录会话由 Pinia 管理，所有请求通过 `src/utils/request.ts` 发送。
