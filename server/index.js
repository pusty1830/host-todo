const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Connect to MongoDB
const MONGO_URI = "mongodb://localhost:27017/todo_host";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define the schema and model for the todo items
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const Todo = mongoose.model("Todo", todoSchema);

app.use(bodyParser.json());
app.use(cors());

// Routes

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).send("Error retrieving todos");
  }
});

// Get a specific todo by ID
app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).send("Todo item not found.");
    } else {
      res.status(200).json(todo);
    }
  } catch (err) {
    res.status(500).send("Error retrieving the todo item.");
  }
});

// Create a new todo
app.post("/todos", async (req, res) => {
  try {
    const newTodo = new Todo({
      title: req.body.title,
      description: req.body.description,
    });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).send("Error creating a todo item.");
  }
});

// Delete a todo by ID
app.delete("/todos/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      res.status(404).send("Todo item not found.");
    } else {
      res.status(200).json(deletedTodo);
    }
  } catch (err) {
    res.status(500).send("Error deleting the todo item.");
  }
});

// Update a todo by ID
app.put("/todos/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
      },
      { new: true, runValidators: true }
    );
    if (!updatedTodo) {
      res.status(404).send("Todo item not found.");
    } else {
      res.status(200).json(updatedTodo);
    }
  } catch (err) {
    res.status(500).send("Error updating the todo item.");
  }
});

// Serve static HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Catch-all route for undefined routes
app.use("*", (req, res) => {
  res.status(404).send("Route not defined");
});

// Start the server
app.listen(8080, () => {
  console.log("Listening at http://localhost:8080");
});

module.exports = app;
