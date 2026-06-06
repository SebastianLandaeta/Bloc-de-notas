const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

const app = express();
app.use(cors());
app.use(express.json());

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
    const collection = client.db("DailyFocus").collection("Note");
    const result = await collection.insertOne({
      title,
      description,
      createdAt: new Date(),
    });
    const inserted = await collection.findOne({ _id: result.insertedId });
    res.status(201).json(inserted);
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await client.close();
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  const client = new MongoClient(process.env.ATLAS_URI);
  try {
    await client.connect();
    const { id } = req.params;
    const result = await client
      .db("DailyFocus")
      .collection("Note")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Nota no encontrada" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
