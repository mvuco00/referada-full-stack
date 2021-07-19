let studentService = require("../services/student-service");

let title = "Student Dashboard";
let root = "student";

async function getStudentRecords(req, res, next) {
  try {
    let certData = await studentService.getStudentRecords();
    res.render("dashboard-student", {
      title,
      root,
      certData,
      logInType: req.session.user_type || "none",
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
}

module.exports = { getStudentRecords };
