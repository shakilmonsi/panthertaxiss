// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getData } from "../utils/axiosInstance";

const Testing = () => {
  const [users, setUsers] = useState([]);
  const [checks, setChecks] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingChecks, setLoadingChecks] = useState(true);
  const [loadingDocs, setLoadingDocs] = useState(true);

  const [errorUsers, setErrorUsers] = useState("");
  const [errorChecks, setErrorChecks] = useState("");
  const [errorDocs, setErrorDocs] = useState("");

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await getData("user");
      setUsers(response.data?.users || []);
    } catch (err) {
      setErrorUsers("Failed to load users.");
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch completed checks
  const fetchCompletedChecks = async () => {
    try {
      const response = await getData("checks/all-checks");
      const allChecks = response.data?.checks || [];
      const completedChecks = allChecks.filter(
        (check) => check.status?.toLowerCase() === "completed",
      );
      setChecks(completedChecks);
    } catch (err) {
      setErrorChecks("Failed to load completed checks.");
      console.error(err);
    } finally {
      setLoadingChecks(false);
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const response = await getData("document/all-documents");
      const docs = response.data?.results || [];
      setDocuments(docs);
      console.log("📄 Console Log: Documents Data =>", docs);
    } catch (error) {
      setErrorDocs("Failed to load documents.");
      console.error(
        "❌ Document API Error:",
        error?.response?.data || error.message,
      );
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCompletedChecks();
    fetchDocuments();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      {/* ---------------- Users Section ---------------- */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>👤 All Users</h2>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : errorUsers ? (
          <p style={{ color: "red" }}>{errorUsers}</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {users.map((user) => (
              <li
                key={user.id}
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "0.5rem",
                }}
              >
                <img
                  src={user.profile_pic || "https://via.placeholder.com/50"}
                  alt={user.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    marginRight: "1rem",
                  }}
                />
                <div>
                  <strong>{user.name}</strong> <br />
                  <small>{user.email}</small> <br />
                  <small>Role: {user.role}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      {/* ---------------- Completed Checks Section ---------------- */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>✅ Completed Checks</h2>
        {loadingChecks ? (
          <p>Loading checks...</p>
        ) : errorChecks ? (
          <p style={{ color: "red" }}>{errorChecks}</p>
        ) : checks.length === 0 ? (
          <p>No completed checks found.</p>
        ) : (
          <table
            border="1"
            cellPadding="8"
            cellSpacing="0"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead style={{ backgroundColor: "#f5f5f5" }}>
              <tr>
                <th>Vehicle Reg No</th>
                <th>Mileage</th>
                <th>Details</th>
                <th>Completed By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((check) => (
                <tr key={check.id}>
                  <td>{check.vehicleRegNo}</td>
                  <td>{check.mileage}</td>
                  <td>{check.details || "N/A"}</td>
                  <td>{check.completedBy?.name || "Unknown"}</td>
                  <td>{new Date(check.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      {/* ---------------- Documents Section ---------------- */}
      <section>
        <h2>📄 Documents</h2>
        {loadingDocs ? (
          <p>Loading documents...</p>
        ) : errorDocs ? (
          <p style={{ color: "red" }}>{errorDocs}</p>
        ) : documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          <table
            border="1"
            cellPadding="8"
            cellSpacing="0"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead style={{ backgroundColor: "#f5f5f5" }}>
              <tr>
                {/* List all keys of the first document object dynamically */}
                {Object.keys(documents[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  {Object.entries(doc).map(([key, value]) => (
                    <td key={key}>
                      {/* For URLs, show clickable link */}
                      {key === "file" && typeof value === "string" ? (
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Document
                        </a>
                      ) : key.toLowerCase().includes("date") && value ? (
                        new Date(value).toLocaleDateString()
                      ) : (
                        String(value ?? "N/A")
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default Testing;
