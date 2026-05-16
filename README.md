Automated testing scripts for the [TodoMVC](https://demo.playwright.dev/todomvc/#/) demo application, built with **Playwright** and **TypeScript**.

---

## 📋 Table of Contents
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Environment](#-setup-environment)
- [Running Tests](#-running-tests)
- [Test Cases](#-test-cases)
- [Project Design](#-project-design)
- [CI/CD](#-cicd)

---

## 🛠 Tech Stack
| Technology      | Version   | Purpose                       |
| --------------- | --------- | ----------------------------- |
| Node.js         | ≥ 18      | Runtime environment           |
| Playwright      | ^1.60.0   | Browser automation framework  |
| TypeScript      | Built-in  | Type-safe test code           |

---

## 📁 Project Structure
```
playwright-todo-app/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD pipeline
├── tests/
│   ├── pages/
│   │   └── todo-page.ts            # Page Object Model
│   ├── helpers/
│   │   └── test-data.ts            # Test data constants
│   ├── add-todo.spec.ts            # TC-01 ~ TC-05 (เพิ่ม Todo)
│   ├── complete-todo.spec.ts       # TC-06 ~ TC-07 (Complete/Uncomplete)
│   ├── delete-todo.spec.ts         # TC-08 ~ TC-10 (ลบ Todo)
│   ├── edit-todo.spec.ts           # TC-11 ~ TC-12 (แก้ไข Todo)
│   └── filter-and-ui.spec.ts       # TC-13 ~ TC-17 (Filter & UI)
├── playwright.config.ts            # Playwright configuration
├── package.json
├── .gitignore
└── README.md
```

- **Page Object Model (POM)**: ทุก selector และ interaction อยู่ใน `TodoPage` class ช่วยให้ maintain ง่าย ถ้า UI เปลี่ยน แก้ที่เดียว
- **Centralized Test Data**: ข้อมูลทดสอบแยกไว้ใน `test-data.ts` ไม่ hardcode ในแต่ละ test
- **Grouped Test Specs**: แบ่ง test ตาม feature (Add, Complete, Delete, Edit, Filter) ต่อยอดง่าย

---

### Prerequisites
- **Node.js** ≥ 18 ([ดาวน์โหลด](https://nodejs.org/))
- **Git** ([ดาวน์โหลด](https://git-scm.com/))

### Step 1: Clone Repository
```bash
git clone https://github.com/MeeMarch/Todo_Playwright-Automation-Tests.git
cd Todo_Playwright-Automation-Tests
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Install Playwright Browsers
```bash
npx playwright install
```

> **หมายเหตุ**: คำสั่งนี้จะดาวน์โหลด Chromium, Firefox, และ WebKit browsers ที่ Playwright ใช้ในการทดสอบ

---

### Run All Tests (Headless)
```bash
npm test
```

### Run Tests with Browser UI (Headed Mode)
```bash
npm run test:headed
```

### Run Tests with Playwright UI Mode (Interactive)
```bash
npm run test:ui
```

### View HTML Test Report
```bash
npm run test:report
```

### Run Specific Test File
```bash
npx playwright test tests/add-todo.spec.ts
```

### Run Specific Test Case by Name
```bash
npx playwright test -g "TC-01"
```

---

| TC ID  | Test Case                                       | Expected Result                                         |
| ------ | ----------------------------------------------- | ------------------------------------------------------- |
| TC-01  | เพิ่ม todo รายการเดียว                            | ระบบแสดง Todo ในรายการได้ถูกต้อง                          |
| TC-02  | เพิ่ม todo หลายรายการ                              | ระบบแสดง Todo ครบทุกรายการตามลำดับ                        |
| TC-03  | กด Enter โดยไม่กรอกข้อความ                        | ระบบไม่เพิ่มรายการ                                       |
| TC-04  | กรอกแต่ Whitespace แล้วกด Enter                   | ระบบไม่เพิ่มรายการ                                       |
| TC-05  | กรอกข้อความมี Space นำหน้า/ตามหลัง                 | ระบบ Trim ข้อความก่อนบันทึก                               |
| TC-06  | ติ๊ก checkbox เพื่อ Complete Todo                 | รายการแสดงสถานะ completed                       |
| TC-07  | ยกเลิกสถานะ Complete                              | รายการกลับเป็น active                                    |
| TC-08  | ลบ Todo ออกจากรายการ                              | ระบบลบ Todo รายการนั้นสำเร็จ                       |
| TC-09  | ลบ todo จนหมดทุกรายการ                            | รายการ Todo ว่าง                                         |
| TC-10  | กด Clear Completed                               | ระบบลบเฉพาะรายการที่ completed เท่านั้น                   |
| TC-11  | แก้ไขข้อความของ Todo                              | ระบบแสดงข้อความใหม่ถูกต้อง                               |
| TC-12  | แก้ไขข้อความจนว่างแล้วกด Enter                    | รายการ Todo นั้นถูกลบออก                                       |
| TC-13  | กด Filter "All"                                  | ระบบแสดง Todo ทั้งหมด                    |
| TC-14  | กด Filter "Active"                               | ระบบแสดงเฉพาะ Todo ที่ยังไม่ Complete                       |
| TC-15  | กด Filter "Completed"                            | ระบบแสดงเฉพาะ Todo ที่ Complete แล้ว                          |
| TC-16  | ตรวจสอบการแสดงปุ่ม Clear Completed                   | ปุ่มแสดงเมื่อมี Completed Todo และซ่อนเมื่อไม่มี             |
| TC-17  | ตรวจสอบตัวนับจำนวน Todo                           | ระบบแสดงจำนวน Todo คงเหลือถูกต้อง                        |

---

### Page Object Model (`todo-page.ts`)
`TodoPage` class รวม method ทั้งหมดที่ใช้ interact กับ TodoMVC:

```typescript
const todoPage = new TodoPage(page);
await todoPage.goto();
await todoPage.addTodo('Buy milk');
await todoPage.toggleTodo(0);
await todoPage.editTodo(0, 'Buy almond milk');
await todoPage.deleteTodo(0);
await todoPage.filterActive();
await todoPage.clearCompleted();
```

### ข้อดีของโครงสร้างนี้
1. **Maintainability** — ถ้า selector เปลี่ยน แก้แค่ `todo-page.ts`
2. **Scalability** — เพิ่ม test case ใหม่ง่าย แค่สร้าง `.spec.ts` ไฟล์ใหม่
3. **Reusability** — method ใน `TodoPage` ใช้ซ้ำได้ทุก test

---

## 🔄 CI/CD
โปรเจกต์มี GitHub Actions workflow (`.github/workflows/playwright.yml`) ที่จะ:

1. **Trigger** เมื่อ push หรือ PR ไปที่ branch `main`
2. **Setup** Node.js environment
3. **Install** dependencies และ Playwright browsers
4. **Run** test ทั้งหมด
5. **Upload** HTML report เป็น artifact

---

## 📄 License
ISC
