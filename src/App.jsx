import "./App.css";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [data, setData] = useState({ title: "", description: "" });
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data from the API

  const fetchData = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/data");
      if (data.status === 200) setAllData(data.data);
      else throw new Error("Failed to fetch data");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    const { title, description } = data;
    const payload = { title, description };

    try {
      const res = await axios.post("http://localhost:4000/generate", payload);
      if (res.status === 200) {
        alert("Data added successfully");
        setData({ title: "", description: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:4000/delete/${id}`);
      if (res.status === 200) {
        alert("Task deleted successfully");
        fetchData(); // Refresh the table after deleting data
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;
  if (allData.length === 0) return <h2>No Data Available</h2>;

  return (
    <div>
      {/* Form to Add Data */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "20rem",
          gap: "0.5rem",
          marginBottom: "2rem",
        }}
      >
        <input
          type="text"
          name="title"
          value={data.title}
          onChange={handleChange}
          placeholder="Title..."
        />
        <input
          type="text"
          name="description"
          value={data.description}
          onChange={handleChange}
          placeholder="Description..."
        />
        <button type="submit" onClick={onSubmit}>
          Save
        </button>
      </div>

      {/* Table to Display Data */}
      <div className="table-container">
        <h1>Task List</h1>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allData.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>
                  <button onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
