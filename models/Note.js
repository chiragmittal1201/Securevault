import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ================= TITLE =================

    encryptedTitle: {
      type: String,
      required: true,
    },

    titleIv: {
      type: String,
      required: true,
    },

    titleAuthTag: {
      type: String,
      required: true,
    },



    // ================= CONTENT =================

    encryptedContent: {
      type: String,
      required: true,
    },

    contentIv: {
      type: String,
      required: true,
    },

    contentAuthTag: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Note = mongoose.model(
  "Note",
  noteSchema
);

export default Note;