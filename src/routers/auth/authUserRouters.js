const router = require("express").Router();

const { userDetails, userUpdate } = require("../../controllers/usersController");
const { userUpdateValidate } = require("../../middleware");
const { userAccountCreateSchema } = require("../../schemas");

router.get("/usuario", userDetails);
router.put("/usuario", userAccountCreateSchema, userUpdateValidate, userUpdate);

module.exports = router;
