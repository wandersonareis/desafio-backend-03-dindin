const router = require("express").Router();

const authenticationValidate = require("../auth/authenticationValidate");

router.use(authenticationValidate);
router.use(require("./auth/authUserRouters"));
router.use(require("./auth/authCategoriesRouters"));
router.use(require("./auth/authTransactionsRouters"));

module.exports = router;
