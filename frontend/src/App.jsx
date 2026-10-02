import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");

  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Get all students
  const getStudents = async () => {
    try {
      const response = await fetch("http://localhost:8080/students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error(error);
      alert("Cannot connect to the backend.");
    }
  };

  // Add or update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(age) < 1 || Number(age) > 100) {
  alert("Please enter a valid age between 1 and 100.");
  return;
}

    const student = {
      name: name,
      email: email,
      age: Number(age),
      course: course
    };

    try {
      let response;

      if (editingId) {
        response = await fetch(
          `http://localhost:8080/students/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
          }
        );
      } else {
        response = await fetch("http://localhost:8080/students", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(student)
        });
      }

      if (response.ok) {
        alert(
          editingId
            ? "Student updated successfully!"
            : "Student added successfully!"
        );

        clearForm();
        getStudents();
      } else {
        alert("Operation failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to the backend.");
    }
  };

  // Edit student
  const editStudent = (student) => {
    setEditingId(student.id);
    setName(student.name);
    setEmail(student.email);
    setAge(student.age);
    setCourse(student.course);
  };

  // Delete student
 const deleteStudent = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this student?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/students/${id}`,
      {
        method: "DELETE"
      }
    );

    if (response.ok) {
      alert("Student deleted successfully!");
      getStudents();
    } else {
      alert("Failed to delete student.");
    }
  } catch (error) {
    console.error(error);
    alert("Cannot connect to the backend.");
  }
};

  // Clear form
  const clearForm = () => {
    setName("");
    setEmail("");
    setAge("");
    setCourse("");
    setEditingId(null);
  };

  // Load students
  useEffect(() => {
    getStudents();
  }, []);

  return (
    <div className="container">

      <h1>Student Management System</h1>

      {/* Student Form */}
      <div className="form-card">

        <h2>
          {editingId ? "Update Student" : "Add Student"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Enter age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Enter course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />

          </div>

          <div className="form-buttons">

            <button
              type="submit"
              className="primary-btn"
            >
              {editingId ? "Update Student" : "Add Student"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* Student Table */}
      <div className="table-card">

        <h2>Student List</h2>

        {students.length === 0 ? (
          <p className="empty-message">
            No students found.
          </p>
        ) : (
          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {students.map((student) => (
                <tr key={student.id}>

                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.age}</td>
                  <td>{student.course}</td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() => editStudent(student)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteStudent(student.id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}

export default App;