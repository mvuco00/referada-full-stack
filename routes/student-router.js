const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student-controller");

let title = "Student Dashboard";
let root = "student";

router.get("/allData", studentController.getStudentRecords);
