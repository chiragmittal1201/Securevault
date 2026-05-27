import { useEffect, useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Dashboard() {

  const navigate = useNavigate();

  const { setUser } = useAuth();

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

  // ================= CREATE NOTE =================

  const handleCreateNote = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

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

      setTitle("");
      setContent("");

      fetchNotes();

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
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
    <div
      style={{
        padding: "40px",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",

          alignItems: "center",
        }}
      >
        <h1>
          SecureVault Dashboard
        </h1>

        <button
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>



      {/* CREATE NOTE */}

      <form onSubmit={handleCreateNote}>

        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <br />
        <br />

        <textarea
          rows="8"
          cols="40"
          placeholder="Write secure note..."
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
        />

        <br />
        <br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "Create Note"}
        </button>

      </form>

      <hr
        style={{
          margin: "40px 0",
        }}
      />



      {/* NOTES */}

      <h2>Your Notes</h2>

      {notes.length === 0 && (
        <p>No notes found</p>
      )}

      {notes.map((note) => (
        <div
          key={note._id}

          style={{
            border: "1px solid #ccc",

            padding: "20px",

            marginBottom: "20px",

            borderRadius: "10px",
          }}
        >

          <h3>{note.title}</h3>

          <p>{note.content}</p>

          <small>
            {new Date(
              note.createdAt
            ).toLocaleString()}
          </small>

          <br />
          <br />

          <button
            onClick={() =>
              setConfirmDeleteId(
                note._id
              )
            }
          >
            Delete
          </button>

        </div>
      ))}



      {/* DELETE CONFIRMATION MODAL */}

      {confirmDeleteId && (
        <div
          style={{
            position: "fixed",

            top: 0,
            left: 0,

            width: "100%",
            height: "100%",

            background:
              "rgba(0,0,0,0.5)",

            display: "flex",

            justifyContent:
              "center",

            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",

              padding: "30px",

              borderRadius: "10px",

              width: "300px",
            }}
          >
            <h3>
              Delete Note?
            </h3>

            <p>
              This action cannot be
              undone.
            </p>

            <div
              style={{
                display: "flex",

                gap: "10px",

                marginTop: "20px",
              }}
            >
              <button
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