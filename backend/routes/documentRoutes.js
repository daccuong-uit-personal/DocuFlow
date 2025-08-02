// Các route liên quan đến văn bản (/api/documents)

const express = require("express");
const router = express.Router();

const {
    createDocument,
    getDocumentById,
    updateDocument,
    deleteDocument,
    getDocuments,
    delegateDocument,
    markAsComplete,
    recallDocument,
    updateProcessor
} = require("../controllers/documentController");

const { authenticateToken, authorizePermissions } = require("../middlewares/authMiddleware");

router.route("/").get(authenticateToken, authorizePermissions(['document:read']), getDocuments);
router.route("/").post(authenticateToken, authorizePermissions(['document:create']), createDocument);
router.route("/:id").get(authenticateToken, authorizePermissions(['document:read']), getDocumentById);
router.route("/:id").put(authenticateToken, authorizePermissions(['document:update']), updateDocument);
router.route("/:id").delete(authenticateToken, authorizePermissions(['document:delete']), deleteDocument);

router.route("/:id/delegate").post(authenticateToken, authorizePermissions(['document:delegate']), delegateDocument);
router.route("/:id/add-processor").post(authenticateToken, authorizePermissions(['document:add-processor']), delegateDocument);
router.route("/:id/complete").post(authenticateToken, authorizePermissions(['document:complete']), markAsComplete);
router.route("/:id/recall").post(authenticateToken, authorizePermissions(['document:recall']), recallDocument);
router.route("/:id/updateProcess").put(authenticateToken, authorizePermissions(['document:updateProcess']), updateProcessor);

module.exports = router;