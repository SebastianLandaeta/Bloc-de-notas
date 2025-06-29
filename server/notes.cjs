const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

const app = express();
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
