const { errorHandler, notFoundHandler } = require("../middleware");

const router = require("express").Router();

router.use(require("./openRouters"));

router.use('/auth', require("./authRouters"));

router.use(require("./swagger"))

router.use(notFoundHandler);
router.use(errorHandler);

module.exports = router;
