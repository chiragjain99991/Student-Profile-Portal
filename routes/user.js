const express = require('express');
const router = express();
let { requireAuth } = require("../middlewares/userMiddleware");
const DataController = require("../Controllers/data-controller")


router.get('/', requireAuth, DataController.data)
router.get('/:sapId', requireAuth, DataController.dataForAdmin)
router.post('/', requireAuth, DataController.postData)
router.post('/:sapId', requireAuth, DataController.editUser)
router.delete("/:sapId",requireAuth,DataController.deleteUser)
router.get("/superAdmin/getAllFiles", requireAuth, DataController.getAllDocuments)




module.exports = router;
