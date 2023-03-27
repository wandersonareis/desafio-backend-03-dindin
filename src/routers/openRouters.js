const { registerUser, userLogin } = require("../controllers/usersController");
const { userAccountCreateSchema, userAccountLoginSchema } = require("../schemas");
const { userLoginValidate, userCreateValidate } = require("../middleware/userMiddleware");

const router = require("express").Router();

router.post("/usuario", userAccountCreateSchema, userCreateValidate, registerUser);

router.post("/login", userAccountLoginSchema, userLoginValidate, userLogin);

module.exports = router;
