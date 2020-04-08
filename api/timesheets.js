const express = require('express');
const timesheetsRouter = express.Router({ mergeParams: true });

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// middleware for routes with param :timesheetId
timesheetsRouter.param('timesheetId', (req, res, next, timesheetId) => {
  db.get(
    'SELECT * FROM Timesheet WHERE Timesheet.id = $timesheetId',
    { $timesheetId: timesheetId },
    (err, timesheet) => {
      if (err) {
        next(err);
      } else if (timesheet) {
        next();
      } else {
        res.sendStatus(404);
      }
    }
  );
});

timesheetsRouter.get('/', (req, res, next) => {
  db.all(
    'SELECT * FROM Timesheet WHERE Timesheet.employee_id = $employeeId',
    { $employeeId: req.params.employeeId },
    (err, timesheets) => {
      err ? next(err) : res.status(200).json({ timesheets: timesheets });
    }
  );
});

timesheetsRouter.post('/', (req, res, next) => {
  const { hours, rate, date } = req.body.timesheet;
  const employeeId = req.params.employeeId;
  if (!hours || !rate || !date) {
    return res.sendStatus(400);
  }

  const sql = `INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES ($hours, $rate, $date, $employeeId)`;
  const values = {
    $hours: hours,
    $rate: rate,
    $date: date,
    $employeeId: employeeId
  };

  db.run(sql, values, function(err) {
    if (err) {
      next(err);
    } else {
      db.get(
        `SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`,
        (err, timesheet) => {
          res.status(201).json({ timesheet: timesheet });
        }
      );
    }
  });
});

timesheetsRouter.put('/:timesheetId', (req, res, next) => {
  const { hours, rate, date } = req.body.timesheet;
  const employeeId = req.params.employeeId;
  if (!hours || !rate || !date) {
    return res.sendStatus(400);
  }

  const sql =
    'UPDATE Timesheet SET hours = $hours, rate = $rate, ' +
    'date = $date, employee_id = $employeeId WHERE Timesheet.id = $timesheetId';
  const values = {
    $hours: hours,
    $rate: rate,
    $date: date,
    $employeeId: employeeId,
    $timesheetId: req.params.timesheetId
  };

  db.run(sql, values, function(err) {
    if (err) {
      next(err);
    } else {
      db.get(
        `SELECT * FROM Timesheet WHERE Timesheet.id = ${req.params.timesheetId}`,
        (err, timesheet) => res.status(200).json({ timesheet: timesheet })
      );
    }
  });
});

timesheetsRouter.delete('/:timesheetId', (req, res, next) => {
  db.run(
    'DELETE FROM Timesheet WHERE Timesheet.id = $timesheetId',
    { $timesheetId: req.params.timesheetId },
    err => (err ? next(err) : res.sendStatus(204))
  );
});

module.exports = timesheetsRouter;
