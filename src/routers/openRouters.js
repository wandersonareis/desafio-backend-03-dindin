const { registerUser, userLogin } = require("../controllers/usersController");
const { userLoginValidate, userCommonMiddleware } = require("../middleware");
const { userAccountCreateSchema, userAccountLoginSchema } = require("../schemas");

const router = require("express").Router();

router.post("/usuario", userAccountCreateSchema, userCommonMiddleware, registerUser);

router.post("/login", userAccountLoginSchema, userLoginValidate, userLogin);

module.exports = router;
