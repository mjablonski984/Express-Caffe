const express = require('express');
const employeesRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const timesheetsRouter = require('./timesheets.js');
employeesRouter.use('/:employeeId/timesheets', timesheetsRouter);

// middleware for routes with param :employeeId
employeesRouter.param('employeeId', (req, res, next, employeeId) => {
  db.get(
    'SELECT * FROM Employee WHERE Employee.id = $employeeId',
    { $employeeId: employeeId },
    (err, employee) => {
      if (err) {
        next(err);
      } else if (employee) {
        req.employee = employee;
        next();
      } else {
        res.sendStatus(404);
      }
    }
  );
});

employeesRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Employee WHERE Employee.is_current_employee = 1', (err, employees) => {
    err ? next(err) : res.status(200).json({ employees: employees });
  });
});

employeesRouter.get('/:employeeId', (req, res, next) => {
  res.status(200).json({ employee: req.employee });
});

employeesRouter.post('/', (req, res, next) => {
  const { name, position, wage } = req.body.employee;
  const isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;
  if (!name || !position || !wage) {
    return res.sendStatus(400);
  }

  const sql = `INSERT INTO Employee (name, position, wage, is_current_employee) VALUES ($name, $position, $wage, $isCurrentEmployee)`;
  const values = {
    $name: name,
    $position: position,
    $wage: wage,
    $isCurrentEmployee: isCurrentEmployee
  };

  db.run(sql, values, function(err) {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Employee WHERE Employee.id = ${this.lastID}`, (err, employee) => {
        res.status(201).json({ employee: employee });
      });
    }
  });
});

employeesRouter.put('/:employeeId', (req, res, next) => {
  const { name, position, wage } = req.body.employee;
  const isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;
  if (!name || !position || !wage) {
    return res.sendStatus(400);
  }

  const sql = `UPDATE Employee SET name = $name, position = $position, wage = $wage, is_current_employee = $isCurrentEmployee 
            WHERE Employee.id = $employeeId`;
  const values = {
    $name: name,
    $position: position,
    $wage: wage,
    $isCurrentEmployee: isCurrentEmployee,
    $employeeId: req.params.employeeId
  };

  db.run(sql, values, err => {
    if (err) {
      next(err);
    } else {
      db.get(
        `SELECT * FROM Employee WHERE Employee.id = ${req.params.employeeId}`,
        (err, employee) => {
          res.status(200).json({ employee: employee });
        }
      );
    }
  });
});

employeesRouter.delete('/:employeeId', (req, res, next) => {
  db.run(
    'UPDATE Employee SET is_current_employee = 0 WHERE Employee.id = $employeeId',
    { $employeeId: req.params.employeeId },
    err => {
      if (err) {
        next(err);
      } else {
        db.get(
          `SELECT * FROM Employee WHERE Employee.id = ${req.params.employeeId}`,
          (err, employee) => {
            res.status(200).json({ employee: employee });
          }
        );
      }
    }
  );
});

module.exports = employeesRouter;
