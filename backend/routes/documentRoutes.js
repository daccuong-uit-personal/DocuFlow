// Các route liên quan đến văn bản (/api/documents)

const express = require("express");
const router = express.Router();

const {
    createDocument,
    getDocumentById,
    updateDocument,
    deleteDocument,
    getDocuments,
    deleteManyDocuments,

    processDocuments,
    updateProcessors,
    returnDocuments,
    markAsComplete,
    recallDocuments,
} = require("../controllers/documentController");

const { authenticateToken, authorizePermissions } = require("../middlewares/authMiddleware");
const upload = require('../middlewares/uploadMiddleware');

router.route("/").get(authenticateToken, authorizePermissions(['document:read']), getDocuments);
router.route("/").post(authenticateToken, authorizePermissions(['document:create']), upload.array('attachments', 10), createDocument);
router.route("/:id").get(authenticateToken, authorizePermissions(['document:read']), getDocumentById);
router.route("/:id").put(authenticateToken, authorizePermissions(['document:update']), updateDocument);
router.route('/bulk-delete').delete(authenticateToken, authorizePermissions(['document:delete']), deleteManyDocuments);
router.route("/:id").delete(authenticateToken, authorizePermissions(['document:delete']), deleteDocument);

router.route("/process").post(authenticateToken, authorizePermissions(['document:delegate', 'document:add-processor']), processDocuments);
router.route("/update-processors").put(authenticateToken, authorizePermissions(['document:updateProcess']), updateProcessors);
router.route("/return").post(authenticateToken, authorizePermissions(['document:return']), returnDocuments);
router.route("/complete").post(authenticateToken, authorizePermissions(['document:complete']), markAsComplete);
router.route("/recall").post(authenticateToken, authorizePermissions(['document:recall']), recallDocuments);

module.exports = router;