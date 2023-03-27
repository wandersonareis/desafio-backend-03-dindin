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
const { transactionIdValidate, transactionFilterValidate, transactionUpdateValidate, transactionCreateValidate } = require("../../middleware");

router.get("/transacao/extrato", transactionsHistorySum);

router.param("id", transactionIdValidate);

router.get("/transacao/:id", transactionsByCategoryId);
router.put("/transacao/:id", transactionMainSchema, transactionUpdateValidate, transactionUpdate);
router.delete("/transacao/:id", transactionDelete);
router.get("/transacao", transactionFilterValidate, transactionsListByUser);
router.post("/transacao", transactionMainSchema, transactionCreateValidate, transactionCreate);

module.exports = router;
