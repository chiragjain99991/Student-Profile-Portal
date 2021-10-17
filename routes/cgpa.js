const express = require('express');
const router = express();
let { requireAuth } = require("../middlewares/userMiddleware");
const CgpaController = require("../Controllers/cgpa-controllers")


router.post("/createCgpa", requireAuth, CgpaController.createNewCgpa)
router.get("/getCgpa/:year", requireAuth, CgpaController.getCgpa)
router.post("/editCgpa/:year", requireAuth, CgpaController.editCgpa)




module.exports = router;