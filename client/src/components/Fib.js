import { useEffect, useState } from "react";
import axios from "axios";

export const Fib = (props) => {
  console.log("loading component");
  const [seenIndexes, setSeenIndex] = useState([]);
  const [index, setIndex] = useState("");
  const [values, setValues] = useState([]);

  useEffect(() => {
    fetchIndexes(setSeenIndex);
    x(setValues);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios.post("/api/values", {
      index,
    });
    setIndex("");
  };

  const renderSeenIndexes = () => {
    return seenIndexes.map(({ number }) => number).join(", ");
  };

  const renderValues = () => {
    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    return entries;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input
          value={index}
          onChange={(event) => setIndex(event.target.value)}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes()}

      <h3>Calculated Values:</h3>
      {renderValues()}
    </div>
  );
};

async function x(setState) {
  try {
    const values = await axios.get("/api/values/current");
    setState(values.data);
    debugger;
  } catch (e) {
    setState([]);
  }
}

async function fetchIndexes(setState) {
  try {
    const seenIndexes = await axios.get("/api/values/all");
    debugger;
    setState(seenIndexes.data);
  } catch (e) {
    setState(["1"]);
  }
}
