const router = require("express").Router();

const {
  transactionCreate,
  transactionsByCategoryId,
  transactionUpdate,
  transactionDelete,
  transactionsHistorySum,
  transactionsListByUser,
} = require("../../controllers/transactionsController");

const { transactionMainSchema } = require("../../schemas");
const { transactionIdValidateMiddleware, transactionFilterValidate, categoryValidateMiddleware } = require("../../middleware");

router.get("/transacao/extrato", transactionsHistorySum);

router.param("id", transactionIdValidateMiddleware);

router.get("/transacao/:id", transactionsByCategoryId);
router.put("/transacao/:id", transactionMainSchema, categoryValidateMiddleware, transactionUpdate);
router.delete("/transacao/:id", transactionDelete);
router.get("/transacao", transactionFilterValidate, transactionsListByUser);
router.post("/transacao", transactionMainSchema, categoryValidateMiddleware, transactionCreate);

module.exports = router;
