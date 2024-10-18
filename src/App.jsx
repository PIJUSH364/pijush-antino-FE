import "./App.css";

import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskDetails from "./component/TaskDetails";
import toast from "react-hot-toast";

export default function App() {
  const [data, setData] = useState({ title: "", description: "" });
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      axios
        .get("http://localhost:4000/allData")
        .then((res) => {
          if (res.data.status === 200) {
            setAllData(res.data.data);
          }
        })
        .catch(() => {
          throw new Error("Failed to fetch data");
        });
    } catch (err) {
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
      const res = await axios
        .post("http://localhost:4000/createTask", payload)
        .then((res) => {
          if (res.data.status === 201) {
            setData({ title: "", description: "" });
            fetchData();
            alert("Data added successfully");
          }
        })
        .catch((res) => {
          if (res.response.data.status == 400) {
            alert(res.response.data.errors);
          }
        });
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  return (
    <div>
      <div
        className="table-container"
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
        {loading && <h2>Loading...</h2>}
        {!loading && allData.length === 0 && <h4>No Data Available</h4>}{" "}
        {!loading && allData.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {allData.map((item, index) => (
                <TaskDetails key={item._id} data={item} index={index} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
