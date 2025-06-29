const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

const app = express();
app.use(cors());
app.use(express.json()); // Agrega esto arriba de tus endpoints

const PORT = 3001;

app.get("/api/notes", async (req, res) => {
  const client = new MongoClient(process.env.ATLAS_URI);
  try {
    await client.connect();
    const notes = await client
      .db("DailyFocus")
      .collection("Note")
      .find({})
      .toArray();
    res.json(notes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await client.close();
  }
});

app.post("/api/notes", async (req, res) => {
  const client = new MongoClient(process.env.ATLAS_URI);
  try {
    await client.connect();
    const { title, description } = req.body;
    const result = await client
      .db("DailyFocus")
      .collection("Note")
      .insertOne({ title, description });
    res.status(201).json(result.ops?.[0] || { title, description });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
