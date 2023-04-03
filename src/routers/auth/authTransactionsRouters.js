const router = require("express").Router();

const {
  transactionCreate,
  transactionsById,
  transactionUpdate,
  transactionDelete,
  transactionsHistorySum,
  transactionsListByUser,
} = require("../../controllers/transactionsController");

const { transactionMainSchema } = require("../../schemas");
const { transactionIdValidateMiddleware, transactionFilterValidateMiddleware, categoryValidateMiddleware } = require("../../middleware");

router.get("/transacao/extrato", transactionsHistorySum);

router.param("id", transactionIdValidateMiddleware);

router.get("/transacao/:id", transactionsById);
router.put("/transacao/:id", transactionMainSchema, categoryValidateMiddleware, transactionUpdate);
router.delete("/transacao/:id", transactionDelete);
router.get("/transacao", transactionFilterValidateMiddleware, transactionsListByUser);
router.post("/transacao", transactionMainSchema, categoryValidateMiddleware, transactionCreate);

module.exports = router;
