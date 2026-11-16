# 蓝星智能教室管理系统 · 前端

> 毕业设计项目 · Vue 3 + Vite 前端页面

## 技术栈

| 组件 | 版本 |
|---|---|
| Vue | 3.5.x |
| Vite | 6.x |
| TypeScript | 5.x |
| Vue Router | 4.x |
| Pinia | 2.x |
| Element Plus | 2.9.x |
| Axios | 1.x |
| mitt | 3.x |

## 项目结构

```
src/
├── assets/          # 静态资源（CSS、图片）
├── components/      # 功能组件
│   ├── Manager/     # 系统管理员视图组件
│   ├── ClassroomAdmin/ # 教室管理员视图组件
│   └── User/        # 普通用户视图组件
├── router/
│   └── index.ts     # 路由配置（含导航守卫）
├── stores/
│   └── user.ts      # Pinia 用户状态
├── types/
│   └── index.ts     # TypeScript 类型定义
├── utils/
│   ├── request.ts   # Axios 实例（统一拦截器）
│   └── date.ts      # 日期格式化工具
└── views/           # 页面级组件（Login、Register、布局框架）
```

## 本地开发

### 前置要求

- Node.js 18+
- 后端服务在 `http://localhost:8081` 运行

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173`。

Vite 配置了 `/api` → `http://localhost:8081` 的代理，所有 API 请求通过代理转发，本地开发无需修改任何 URL。

### 生产构建

```bash
npm run build
```

产物输出到 `dist/`。部署时将 `dist/` 托管到任意静态文件服务器，并将 `/api` 路由代理到后端即可。

## 角色与路由

| 角色 | 登录后跳转 | 功能 |
|---|---|---|
| 系统管理员（type=4） | `/manager` | 用户管理、教室管理、预约管理 |
| 教室管理员（type=3） | `/classroom-admin` | 新预约审批、现存预约管理、所管教室信息 |
| 学生/教师（type=1/2） | `/user` | 预约教室、查看我的预约、消息中心 |

所有受保护路由通过 `router.beforeEach` 守卫检查登录状态，未登录访问任何路径均重定向到 `/login`。

## 2026 年重构说明

原始版本（毕业答辩时）使用 Vue 2 + Vue CLI，本次升级主要变更：

### 构建工具链
- Vue CLI + Webpack → **Vite 6**（冷启动 < 500ms，热更新即时）
- 新增 TypeScript 支持（`tsconfig.json`，主要基础设施层已类型化）
- 删除 `babel.config.js`、`jsconfig.json`、`vue.config.js`

### 框架升级
- Vue `2.6` → **Vue 3.5**
- Vue Router `3.x` → **Vue Router 4.x**（`createRouter` / `createWebHistory`）
- Element UI `2.x` → **Element Plus 2.9**
- 新增 **Pinia** 统一管理用户状态，替代分散在 12+ 个组件里的 `localStorage.getItem('user')`
- 全局事件总线从 `Vue.prototype.$bus = this`（Vue 2 trick）改为 **mitt**，并在 `beforeUnmount` 中清理监听器

### 安全性
- 新增路由导航守卫（`router.beforeEach`）：未登录访问受保护页面自动重定向到 `/login`
- 文件上传的 `el-upload` action 由 `http://localhost:8081/file/upload` 改为 `/api/file/upload`，通过 axios 拦截器自动携带 token，修复了原版本文件上传不鉴权的问题
- 删除了所有 42 处 `console.log`，包括打印密码的 `Header.vue:103`

### Bug 修复
- **分页总数**：5 处 `this.total = res.data.length`（取当前页数组长度）→ `res.data.total`（服务端返回的总数），修复后分页翻页功能恢复正常
- **编辑弹窗**：`this.form = row`（引用赋值，导致在弹窗里打字直接修改表格）→ `this.form = { ...row }`
- **提交崩溃**：`ClassroomAdminAppointment.vue` 中 `.then.then` 拼写错误导致提交方法必然抛出 `TypeError`，已修复
- **登录校验**：`Login.vue` 中 `validateEmail` 变量在 `return` 之后声明，始终为 `undefined`，表单校验形同虚设，已修复
- **响应式缺失**：`UserHome.vue` 中 `messageList` 未在 `data()` 声明直接赋值，Vue 2 不追踪该属性变化，消息列表不更新，已修复
- **登录名校验**：邮箱格式正则替换为账号非空校验，管理员账号 `admin` 可正常登录
- **Vue 3 语法适配**：
  - `:visible.sync` → `v-model:visible`（所有对话框）
  - `slot="footer"` → `#footer`（所有插槽）
  - `<el-submenu>` → `<el-sub-menu>`（侧边栏）
  - `size="mini"` → `size="small"`（全局）
  - `this.$set()` → 直接赋值
  - `this.$bus.$on/emit/off` → `this.$bus.on/emit/off`

### API 层重构
- 删除组件内部 14 处硬编码 `http://localhost:8081`
- 统一使用 `src/utils/request.ts` 中的 Axios 实例（`baseURL: '/api'`，token 注入，401 自动跳转登录，错误统一提示）

## 已知待办

- 大型组件（`Manager/Appointment.vue`、`ClassroomAdmin/ClassroomAdminNewAppointment.vue`）可进一步拆分
- 生产构建产出 `index.js` 约 1.2 MB，建议按路由做代码分割（`vite-plugin-inspect` 分析后处理）
- 状态管理可进一步迁移，目前 Pinia store 仅覆盖用户信息，业务数据仍在组件本地 `data()`
