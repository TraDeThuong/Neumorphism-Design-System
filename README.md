# Neumorphism Design System (Soft UI)

Bộ giao diện thành phần (Design System) độc lập được xây dựng trên **Next.js 16** (App Router), **React 19** và **Tailwind CSS v4**, mang ngôn ngữ thiết kế **Neumorphism (Soft UI)** với hiệu ứng bóng đổ kép 3D (raised/inset), tự động chuyển đổi giao diện sáng/tối (Light/Dark mode) và không phụ thuộc vào bất kỳ dịch vụ ngoài nào.

---

## Tính năng nổi bật

- **Neumorphic Tokens & Dual Shadows**: Hệ thống token đổ bóng hai hướng mượt mà (`--nm-raised-sm`, `--nm-raised`, `--nm-raised-lg`, `--nm-inset`, `--nm-pressed`, `--nm-btn-*`).
- **Dark Mode mượt mà**: Hỗ trợ chuyển đổi chủ đề sáng/tối không flash (`data-theme="light"` / `data-theme="dark"`), tự động ghi nhớ tùy chọn vào `localStorage` và phát hiện `prefers-color-scheme`.
- **Thư viện UI Components toàn diện**:
  - **Typography**: 5 biến thể (`default`, `embossed`, `debossed`, `soft`, `display`), hỗ trợ chữ nổi 3D và khắc chìm định hình 100% bằng ánh sáng.
  - **Button**: 9 biến thể (`primary`, `secondary`, `outline`, `ghost`, `danger`, `hybrid`, `sculpted`, `aurora`, `metal`) và 3 kích thước (`sm`, `md`, `lg`).
  - **Card**: 6 biến thể (`default`, `raised`, `inset`, `interactive`, `glass`, `accent`) cùng 4 mức padding.
  - **Toast Notifications**: Thông báo Neumorphic & Wooden với 4 trạng thái (`success`, `error`, `loading`, `blank`), tự động đồng bộ theme và hiệu ứng đổ bóng 3D.
  - **Loader & Skeleton**: Spinner xoay tròn, Dots chấm nhảy và hiệu ứng Skeleton shimmer giả lập khung giao diện khi tải dữ liệu.
  - **Input & Textarea**: Ô nhập liệu một dòng và nhiều dòng (3 kích thước, icon huy hiệu 3D nổi, prefix/suffix), Textarea auto-grow tự co dãn và PasswordInput ẩn/hiện mật khẩu.
  - **Selection Controls**: Checkbox (hỗ trợ `indeterminate`), RadioGroup, công tắc gạt Switch êm ái và menu Select kính mờ.
  - **Form Orchestration**: Kết hợp `FormField`, `FormSection` đa cột và `FormActions` tích hợp nút thao tác và trạng thái loading.
- **Hoàn toàn độc lập**: Không phụ thuộc vào bất kỳ API backend, logic xác thực hay file nguồn từ dự án khác.

---

## Cấu trúc thư mục

```
neumorphism-design-system/
├── public/                     # Tài nguyên SVG và static assets
├── src/
│   ├── app/                    # Next.js App Router (trang showcase & demo)
│   │   ├── globals.css         # Tailwind v4 import & custom dark variant
│   │   ├── layout.tsx          # Root Layout (Theme Script, Font, SideNav, Toaster)
│   │   ├── page.tsx            # Trang chủ tổng quan Design System
│   │   ├── side-nav.tsx        # Menu điều hướng các chuyên mục
│   │   ├── foundations/        # Trang demo Bảng màu, Typography & Neumorphism Shadows
│   │   └── components/         # Danh mục showcase cho từng component
│   │       ├── button/
│   │       ├── card/
│   │       ├── form/
│   │       ├── input/
│   │       ├── loader/
│   │       ├── selection/
│   │       ├── toast/
│   │       └── typography/
│   ├── components/
│   │   └── ui/                 # Thư viện component UI cốt lõi (tái sử dụng)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── inline-script.tsx
│   │       ├── loader.tsx
│   │       ├── neumorphic-surface.tsx
│   │       ├── skeleton.tsx
│   │       ├── theme-toggle.tsx
│   │       ├── toaster.tsx
│   │       ├── typography.tsx
│   │       └── form/
│   └── styles/
│       └── tokens.css          # Single Source of Truth cho Design Tokens
├── next.config.ts              # Cấu hình Next.js & Turbopack
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript path alias (@ui/*, @/*)
└── README.md
```

---

## Hướng dẫn cài đặt & chạy Local

### Yêu cầu môi trường
- Node.js 20 trở lên (khuyến nghị Node.js 20 LTS hoặc 22/24)
- npm 9+ (hoặc pnpm / yarn tương đương)

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy server phát triển (Development)
Theo mặc định, dự án khởi chạy trên cổng **3001**:
```bash
npm run dev
```
Truy cập: [http://localhost:3001](http://localhost:3001)

#### Đổi cổng nếu cổng 3001 đang bị chiếm dụng:
```bash
# Cách 1: Truyền cờ -p
npm run dev -- -p 3002

# Cách 2: Thiết lập biến môi trường PORT
PORT=3005 npm run dev
```

### 3. Kiểm tra kiểu dữ liệu (TypeScript)
```bash
npx tsc --noEmit
```

### 4. Build dự án (Production Build)
```bash
npm run build
```

### 5. Chạy server production sau khi build
```bash
npm run start
```
(Hoặc chạy với cổng khác: `npm run start -- -p 3002`)

---

## Hướng dẫn Deploy lên Vercel

Dự án này là một ứng dụng Next.js tiêu chuẩn, sẵn sàng deploy trực tiếp lên Vercel mà không cần cấu hình biến môi trường phức tạp.

### Cách 1: Deploy từ Repository riêng (Khuyến nghị)
1. Đẩy thư mục `neumorphism-design-system` lên một Git repository riêng (GitHub / GitLab / Bitbucket):
   ```bash
   cd neumorphism-design-system
   git init
   git add .
   git commit -m "feat: initial commit for standalone neumorphism design system"
   git remote add origin https://github.com/<your-username>/neumorphism-design-system.git
   git branch -M main
   git push -u origin main
   ```
2. Đăng nhập vào [Vercel Dashboard](https://vercel.com).
3. Nhấp **Add New...** -> **Project**.
4. Chọn repository `neumorphism-design-system` vừa tạo.
5. Vercel sẽ tự động nhận diện:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
6. Nhấp **Deploy**.

### Cách 2: Deploy từ Monorepo
Nếu dự án nằm bên trong một monorepo:
1. Trong Vercel project configuration, mở mục **Root Directory**.
2. Thiết lập Root Directory thành `neumorphism-design-system`.
3. Bật tùy chọn **Include files outside the Root Directory in the Build Step** nếu có các gói chia sẻ ngoài thư mục (với cấu hình hiện tại, mọi file đã được cô lập hoàn toàn bên trong `neumorphism-design-system`).
4. Nhấn **Deploy**.

---

## Sử dụng UI Components trong dự án khác

Tất cả component UI được đặt tại `src/components/ui` và cấu hình qua path alias `@ui/*`. Để sử dụng trong dự án Next.js khác:
1. Sao chép thư mục `src/components/ui/` và `src/styles/tokens.css`.
2. Khai báo alias trong `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@ui/*": ["./src/components/ui/*"]
       }
     }
   }
   ```
3. Import tokens vào CSS chính (`globals.css`):
   ```css
   @import "tailwindcss";
   @import "./path/to/tokens.css";
   ```
4. Sử dụng component:
   ```tsx
   import { Button } from "@ui/button";
   import { Typography } from "@ui/typography";
   import { Card, CardContent } from "@ui/card";
   import { Input } from "@ui/form";
   import { showToast } from "@ui/toaster";
   ```
