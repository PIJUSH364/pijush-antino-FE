import axios from "axios";
import React, { useState, useCallback } from "react";

export default function TaskDetails({ data, index }) {
  const [taskInfo, setTaskInfo] = useState(null);

  // Memoized handleShow function to avoid unnecessary re-renders
  const handleShow = useCallback(async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/taskDetails/${id}`
      );
      if (response.status === 200) {
        setTaskInfo(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  }, []);

  return (
    <tr key={data._id}>
      <td>{index + 1}</td>
      <td style={{ cursor: "pointer" }} onClick={() => handleShow(data._id)}>
        {data.title}
      </td>
      <td>
        {taskInfo && (
          <div style={{ textAlign: "left" }}>
            <p>Status: {taskInfo.status}</p>
            <p>Word Count: {taskInfo.calculatedField.wordCount}</p>
            <p>Hashtag: {taskInfo.calculatedField.hashtag}</p>
          </div>
        )}
      </td>
    </tr>
  );
}
