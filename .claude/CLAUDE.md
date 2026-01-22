# FusionXPay Web - Claude Code 项目指南

## 快速开始

每次会话开始时，请先阅读 `.claude/plans/current.md` 了解当前任务。

## 项目概述

FusionXPay Web 是 **FusionXPay 支付网关平台的管理后台前端**，提供商户登录、订单管理等功能。

> 后端服务: [FusionXPay](../FusionXPay/) - `admin-service` 微服务 (端口 8084)

### 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **UI 组件**: shadcn/ui + Radix UI
- **表单**: React Hook Form + Zod
- **HTTP**: Axios
- **认证**: JWT Token

## 项目结构

```
fusionxpay-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── login/              # 登录页
│   │   ├── orders/             # 订单列表/详情
│   │   └── layout.tsx          # 根布局
│   ├── components/
│   │   ├── ui/                 # shadcn/ui 组件
│   │   ├── auth/               # 认证相关组件
│   │   ├── layout/             # 布局组件 (Navbar, Sidebar)
│   │   └── orders/             # 订单相关组件
│   ├── lib/                    # 工具函数
│   └── types/                  # TypeScript 类型定义
├── public/                     # 静态资源
└── package.json
```

## 开发规范

### 语言偏好
- **交流**: 中文
- **代码变量名与注释**: 英文

### 文件操作
- 仅在当前工作目录下操作
- 禁止写入系统目录或无关目录

### 代码规范
- 使用 TypeScript 严格模式
- 组件使用函数式 + Hooks
- 使用 shadcn/ui 组件库
- 遵循 Next.js App Router 最佳实践

## 重要文件

| 文档 | 路径 |
|------|------|
| 当前计划 | `.claude/plans/current.md` |
| 进度记录 | `.claude/progress.md` |
| 后端项目 | `../FusionXPay/` |
| 后端 API 设计 | `../FusionXPay/.claude/plans/02-phase2-admin-mvp.md` |

## API 端点

后端 admin-service 运行在 `http://localhost:8084`

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/admin/auth/login` | 商户登录 |
| GET | `/api/admin/auth/me` | 获取当前用户 |
| GET | `/api/admin/orders` | 订单列表(分页) |
| GET | `/api/admin/orders/{id}` | 订单详情 |

### 测试账户
- Admin: `admin@fusionxpay.com` / `admin123`
- Merchant: `merchant@example.com` / `merchant123`

## 会话规范

### 会话开始
1. 阅读本文件了解项目概况
2. 阅读 `.claude/plans/current.md` 了解当前任务
3. 查看 `.claude/progress.md` 了解历史进度

### 会话结束前
运行 `/pm sync` 更新进度记录
