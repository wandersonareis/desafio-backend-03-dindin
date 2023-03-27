const { categoriesList } = require("../../controllers/categoriesController");

const router = require("express").Router();

router.get("/categoria", categoriesList);

module.exports = router;
