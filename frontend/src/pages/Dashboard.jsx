import { useEffect, useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "../styles/dashboard.css";

export default function Dashboard() {

  const navigate =
    useNavigate();

  const { setUser } =
    useAuth();

  const [notes, setNotes] =
    useState([]);

  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    confirmDeleteId,
    setConfirmDeleteId,
  ] = useState(null);

  const [
    editingNoteId,
    setEditingNoteId,
  ] = useState(null);

  // ================= FETCH NOTES =================

  const fetchNotes = async () => {
    try {

      const response =
        await axios.get(
          "http://localhost:5000/notes",

          {
            withCredentials: true,
          }
        );

      setNotes(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  // ================= LOAD NOTES =================

  useEffect(() => {
    fetchNotes();
  }, []);

  // ================= CREATE / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      // EDIT MODE
      if (editingNoteId) {

        await axios.put(
          `http://localhost:5000/notes/${editingNoteId}`,

          {
            title,
            content,
          },

          {
            withCredentials: true,
          }
        );

      } else {

        // CREATE MODE
        await axios.post(
          "http://localhost:5000/notes",

          {
            title,
            content,
          },

          {
            withCredentials: true,
          }
        );
      }

      // Reset
      setTitle("");

      setContent("");

      setEditingNoteId(null);

      fetchNotes();

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // ================= EDIT NOTE =================

  const handleEditNote = (note) => {

    setEditingNoteId(
      note._id
    );

    setTitle(note.title);

    setContent(note.content);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= CANCEL EDIT =================

  const handleCancelEdit = () => {

    setEditingNoteId(null);

    setTitle("");

    setContent("");
  };

  // ================= DELETE NOTE =================

  const handleDeleteNote = async (
    noteId
  ) => {
    try {

      await axios.delete(
        `http://localhost:5000/notes/${noteId}`,

        {
          withCredentials: true,
        }
      );

      fetchNotes();

    } catch (error) {

      console.log(error);
    }
  };

  // ================= LOGOUT =================

  const handleLogout = async () => {
    try {

      await axios.post(
        "http://localhost:5000/auth/logout",

        {},

        {
          withCredentials: true,
        }
      );

      setUser(null);

      navigate("/login");

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div className="dashboard-page">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">

        <h1 className="dashboard-title">
          SecureVault
        </h1>

        <button
          className="primary-button"

          onClick={handleLogout}
        >
          Logout
        </button>

      </div>



      {/* ================= FORM ================= */}

      <form
        className="note-form"

        onSubmit={handleSubmit}
      >

        <input
          className="note-input"

          type="text"

          placeholder="Note title"

          value={title}

          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
        />

        <textarea
          className="note-textarea"

          placeholder="Write your peaceful thoughts here..."

          value={content}

          onChange={(e) =>
            setContent(
              e.target.value
            )
          }
        />

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >

          <button
            className="primary-button"

            type="submit"

            disabled={loading}
          >
            {loading
              ? (
                editingNoteId
                  ? "Updating..."
                  : "Saving..."
              )
              : (
                editingNoteId
                  ? "Update Note"
                  : "Create Note"
              )}
          </button>

          {editingNoteId && (
            <button
              type="button"

              className="primary-button delete-button"

              onClick={
                handleCancelEdit
              }
            >
              Cancel
            </button>
          )}

        </div>

      </form>



      {/* ================= NOTES ================= */}

      <h2 className="notes-heading">
        Your Notes
      </h2>

      {notes.length === 0 ? (

        <div className="empty-notes">
          No notes yet.
          Start writing something calm.
        </div>

      ) : (

        <div className="notes-grid">

          {notes.map((note) => (

            <div
              key={note._id}

              className="note-card"
            >

              <h3 className="note-title">
                {note.title}
              </h3>

              <p className="note-content">
                {note.content}
              </p>

              <small className="note-date">
                {new Date(
                  note.createdAt
                ).toLocaleString()}
              </small>

              <div className="note-actions">

                <button
                  className="primary-button edit-button"

                  onClick={() =>
                    handleEditNote(
                      note
                    )
                  }
                >
                  Edit
                </button>

                <button
                  className="primary-button delete-button"

                  onClick={() =>
                    setConfirmDeleteId(
                      note._id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}



      {/* ================= DELETE MODAL ================= */}

      {confirmDeleteId && (

        <div className="modal-overlay">

          <div className="modal-card">

            <h3 className="modal-title">
              Delete Note?
            </h3>

            <p className="modal-text">
              This action cannot be
              undone.
            </p>

            <div className="modal-actions">

              <button
                className="primary-button delete-button"

                onClick={() => {

                  handleDeleteNote(
                    confirmDeleteId
                  );

                  setConfirmDeleteId(
                    null
                  );
                }}
              >
                Yes, Delete
              </button>

              <button
                className="primary-button"

                onClick={() =>
                  setConfirmDeleteId(
                    null
                  )
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}