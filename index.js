const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
const port = 3010;

app.use(express.json()); 

app.use(express.static('static'));

mongoose.connect("mongodb+srv://rosnakavvayi123:malvan1@cluster0.wugsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true 
  },
  password: {
    type: String,
    required: true,
  }
});

const User = mongoose.model("User", userSchema);

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/register', async (req, res) => {
  try{
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).send("Please enter all fields");
    }
    const user = await User.findOne({email});
    if (user) {
      return res.status(400).send("User already available");
    } 

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
      email,
      password: hashedPassword 
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

app.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body;

      
      if (!email || !password) {
          return res.status(400).json({ message: "Email and password are required" });
      }

      
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      
    const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      Zres.status(500).json({ message: "Server error", error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
