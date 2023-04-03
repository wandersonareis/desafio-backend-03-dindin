const router = require("express").Router();

const { userDetails, userUpdate } = require("../../controllers/usersController");
const { userCommonMiddleware } = require("../../middleware");
const { userAccountCreateSchema } = require("../../schemas");

router.get("/usuario", userDetails);
router.put("/usuario", userAccountCreateSchema, userCommonMiddleware, userUpdate);

module.exports = router;
