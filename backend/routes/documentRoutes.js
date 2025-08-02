// Các route liên quan đến văn bản (/api/documents)

const express = require("express");
const router = express.Router();

const {
    createDocument,
    getDocumentById,
    updateDocument,
    deleteDocument,
    getDocuments,
    delegateDocument
} = require("../controllers/documentController");

const { authenticateToken, authorizePermissions } = require("../middlewares/authMiddleware");

router.route("/").get(authenticateToken, authorizePermissions(['document:read']), getDocuments);
router.route("/").post(authenticateToken, authorizePermissions(['document:create']), createDocument);
router.route("/:id").get(authenticateToken, authorizePermissions(['document:read']), getDocumentById);
router.route("/:id").put(authenticateToken, authorizePermissions(['document:update']), updateDocument);
router.route("/:id").delete(authenticateToken, authorizePermissions(['document:delete']), deleteDocument);
router.route("/:id/delegate").post(authenticateToken, authorizePermissions(['document:delegate']), delegateDocument);
router.route("/:id/add-processor").post(authenticateToken, authorizePermissions(['document:add-processor']), delegateDocument);

module.exports = router;