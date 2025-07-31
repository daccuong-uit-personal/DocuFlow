// Các route liên quan đến văn bản (/api/documents)

const express = require("express");
const router = express.Router();

const {
    createDocument,
    getDocumentById,
    updateDocument,
    deleteDocument,
    getDocuments
} = require("../controllers/documentController");

router.route("/").post(createDocument);
router.route("/").get(getDocuments);
router.route("/:id").get(getDocumentById);
router.route("/:id").put(updateDocument);
router.route("/:id").delete(deleteDocument);

module.exports = router;