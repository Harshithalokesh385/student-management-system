import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/students";

const INITIAL_FORM = {
  name: "",
  email: "",
  age: "",
  course: "",
};

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch all students
  async function fetchStudents() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load student records.");
      }

      const data = await response.json();
      setStudents(data);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        "Unable to connect to the backend. Make sure Spring Boot is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  // Update form fields
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  // Reset form
  function resetForm() {
    setForm({ ...INITIAL_FORM });
    setEditingId(null);
  }

  // Add or update student
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim();
    const ageText = String(form.age).trim();
    const course = form.course.trim();

    if (!name || !email || !ageText || !course) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\d+$/.test(ageText)) {
      setError("Please enter age as a whole number.");
      return;
    }

    const age = Number(ageText);

    if (!Number.isInteger(age) || age < 1 || age > 100) {
      setError("Age must be between 1 and 100.");
      return;
    }

    const student = {
      name,
      email,
      age,
      course,
    };

    try {
      setSaving(true);

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || `Request failed with status ${response.status}.`
        );
      }

      resetForm();
      await fetchStudents();
    } catch (err) {
      console.error("Save error:", err);
      setError(
        err.message || "Could not save the student. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  // Edit student
  function handleEdit(student) {
    setEditingId(student.id);

    setForm({
      name: student.name ?? "",
      email: student.email ?? "",
      age: String(student.age ?? ""),
      course: student.course ?? "",
    });

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Delete student
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Delete failed with status ${response.status}.`);
      }

      await fetchStudents();
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || "Could not delete the student.");
    }
  }

  // Cancel editing
  function cancelEdit() {
    resetForm();
    setError("");
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">S</span>
          <span>
            Student<span className="brand-light">Hub</span>
          </span>
        </div>

        <span className="topbar-label">
          STUDENT MANAGEMENT SYSTEM
        </span>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">STUDENT ADMINISTRATION</p>

            <h1>
              Manage students <span>with ease.</span>
            </h1>

            <p className="hero-description">
              Add, view, update and manage student records in one place.
            </p>
          </div>

          <div className="hero-symbol">S</div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span className="stat-label">TOTAL STUDENTS</span>
            <strong>{students.length}</strong>
            <span className="stat-note">Registered records</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">SYSTEM STATUS</span>
            <strong className="status-text">
              {loading ? "Loading" : error ? "Check connection" : "Active"}
            </strong>
            <span className="stat-note">Student portal</span>
          </div>
        </section>

        <section className="content-grid">
          {/* Student form */}
          <div className="panel form-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">STUDENT DETAILS</p>
                <h2>{editingId ? "Update student" : "Add a student"}</h2>
              </div>

              <span className="heading-icon">＋</span>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Full name</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter student name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label htmlFor="email">Email address</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="student@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />

              <div className="form-row">
                <div>
                  <label htmlFor="age">Age</label>

                  <input
                    id="age"
                    name="age"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Enter age"
                    value={form.age}
                    onChange={(event) => {
                      const value = event.target.value;

                      setForm((previousForm) => ({
                        ...previousForm,
                        age: value,
                      }));
                    }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="course">Course</label>

                  <input
                    id="course"
                    name="course"
                    type="text"
                    placeholder="e.g. CSE"
                    value={form.course}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="error-message" role="alert">
                  {error}
                </p>
              )}

              <button
                className="primary-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Student"
                    : "＋ Add Student"}
              </button>

              {editingId && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Student records */}
          <div className="panel students-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">RECORDS DIRECTORY</p>
                <h2>All students</h2>
              </div>

              <span className="count-badge">
                {students.length} records
              </span>
            </div>

            {loading ? (
              <p className="empty-state">Loading student records...</p>
            ) : students.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">▤</div>
                <h3>No students yet</h3>
                <p>Add your first student using the form.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>STUDENT</th>
                      <th>AGE</th>
                      <th>COURSE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <div className="student-name">{student.name}</div>
                          <div className="student-email">{student.email}</div>
                        </td>

                        <td>{student.age}</td>

                        <td>
                          <span className="course-badge">
                            {student.course}
                          </span>
                        </td>

                        <td>
                          <div className="actions">
                            <button
                              className="edit-button"
                              type="button"
                              onClick={() => handleEdit(student)}
                            >
                              Edit
                            </button>

                            <button
                              className="delete-button"
                              type="button"
                              onClick={() => handleDelete(student.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <footer>
          StudentHub <span>·</span> Student records made simple
        </footer>
      </main>
    </div>
  );
}

export default App;