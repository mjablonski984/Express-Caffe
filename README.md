# Express Caffe

## Project Overview
Express caffe - a simple app built with Express and SQLite. App was created as learning project to test SQLite.


App allows users to create, view, update, and delete:
-  menus
- menu items
- employees 
- employee's timesheets
 

### Database Table Properties

* **Employee**
  - id - Integer, primary key, required
  - name - Text, required
  - position - Text, required
  - wage - Integer, required
  - is_current_employee - Integer, defaults to `1`

* **Timesheet**
  - id - Integer, primary key, required
  - hours - Integer, required
  - rate - Integer, required
  - date - Integer, required
  - employee_id - Integer, foreign key, required

* **Menu**
  - id - Integer, primary key, required
  - title - Text, required

* **MenuItem**
  - id - Integer, primary key, required
  - name - Text, required
  - description - Text, optional
  - inventory - Integer, required
  - price - Integer, required
  - menu_id - Integer, foreign key, required

### Route Paths 

- **/api/employees** (GET, POST)
  
- **/api/employees/:employeeId** (GET, PUT, DELETE)

- **/api/employees/:employeeId/timesheets** (GET, POST)

- **/api/employees/:employeeId/timesheets/:timesheetId** (PUT, DELETE)

- **/api/menus** (GET, POST,)

- **/api/menus/:menuId** (GET, PUT, DELETE)

- **/api/menus/:menuId/menu-items** (GET, POST)

- **/api/menus/:menuId/menu-items/:menuItemId** (PUT, DELETE)

## Usage

In terminal type in:
```bash
npm install
```
```
cd src\utils\camelcase-keys

npm install
```

```bash
npm run server
```

```bash
start index.html
```
To rebuild database run:
```bash
npm run start-dev
```
