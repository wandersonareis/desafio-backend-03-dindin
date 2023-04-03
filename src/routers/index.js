const { errorHandler, notFoundHandler, errorLogger } = require("../middleware");

const router = require("express").Router();

router.use(require("./openRouters"));

router.use("/auth", require("./authRouters"));

router.use(require("./swagger"));

router.get("/", (req, res) => {
  res.redirect("/docs");
});

router.use(notFoundHandler);
router.use(errorLogger);
router.use(errorHandler);

module.exports = router;
