import express from "express";

import Note from "../models/Note.js";

import protect from "../middleware/authMiddleware.js";

import {
  encrypt,
  decrypt,
} from "../utils/encryption.js";

const router = express.Router();



// ================= CREATE NOTE =================

router.post("/", protect, async (req, res) => {
  try {

    const {
      title,
      content,
    } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        message:
          "Missing required fields",
      });
    }

    // Encrypt title
    const encryptedTitleData =
      encrypt(title);

    // Encrypt content
    const encryptedContentData =
      encrypt(content);

    // Create note
    const note = await Note.create({
      userId: req.user.id,

      // TITLE
      encryptedTitle:
        encryptedTitleData.encryptedContent,

      titleIv:
        encryptedTitleData.iv,

      titleAuthTag:
        encryptedTitleData.authTag,

      // CONTENT
      encryptedContent:
        encryptedContentData.encryptedContent,

      contentIv:
        encryptedContentData.iv,

      contentAuthTag:
        encryptedContentData.authTag,
    });

    res.status(201).json({
      message:
        "Note created successfully",

      note,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});



// ================= GET NOTES =================

router.get("/", protect, async (req, res) => {
  try {

    const notes = await Note.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    // Decrypt notes
    const decryptedNotes =
      notes.map((note) => ({
        _id: note._id,

        title: decrypt(
          note.encryptedTitle,
          note.titleIv,
          note.titleAuthTag
        ),

        content: decrypt(
          note.encryptedContent,
          note.contentIv,
          note.contentAuthTag
        ),

        createdAt:
          note.createdAt,
      }));

    res.status(200).json(
      decryptedNotes
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});



// ================= UPDATE NOTE =================

router.put(
  "/:id",

  protect,

  async (req, res) => {
    try {

      const {
        title,
        content,
      } = req.body;

      // Validation
      if (!title || !content) {
        return res.status(400).json({
          message:
            "Missing required fields",
        });
      }

      // Find note
      const note =
        await Note.findOne({
          _id: req.params.id,

          userId:
            req.user.id,
        });

      if (!note) {
        return res.status(404).json({
          message:
            "Note not found",
        });
      }

      // Encrypt updated title
      const encryptedTitleData =
        encrypt(title);

      // Encrypt updated content
      const encryptedContentData =
        encrypt(content);

      // Update note
      note.encryptedTitle =
        encryptedTitleData.encryptedContent;

      note.titleIv =
        encryptedTitleData.iv;

      note.titleAuthTag =
        encryptedTitleData.authTag;

      note.encryptedContent =
        encryptedContentData.encryptedContent;

      note.contentIv =
        encryptedContentData.iv;

      note.contentAuthTag =
        encryptedContentData.authTag;

      await note.save();

      res.status(200).json({
        message:
          "Note updated successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);



// ================= DELETE NOTE =================

router.delete(
  "/:id",

  protect,

  async (req, res) => {
    try {

      const note =
        await Note.findOne({
          _id: req.params.id,

          userId:
            req.user.id,
        });

      if (!note) {
        return res.status(404).json({
          message:
            "Note not found",
        });
      }

      await note.deleteOne();

      res.status(200).json({
        message:
          "Note deleted successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);



export default router;