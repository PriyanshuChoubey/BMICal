const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());  // Alternative JSON parser (ensure compatibility)

// MySql connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: "Abc098-*-=+",
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, // Default MySQL port
})

db.connect((err)=>{
    if(err){
        console.log("MySql connection failed:", err);
    }else{
        console.log('Connection done ✅');
    }
})

// API to fetch BMI Records
app.get("/bmi",(req,res)=>{
    db.query("SELECT * FROM users", (err, results)=>{
        if(err){
            return res.status(500).json(err);
        }
        res.json(results);
    })
})

// API to add BMI Data
app.post('/bmi',(req,res)=>{
    // console.log("Received Data:", req.body);
    const {name, bmi, remarks} = req.body;
    if (!name || !bmi || !remarks) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = "INSERT INTO users (name, bmi, remarks) VALUES (?, ?, ?)";
    db.query(sql,[name, bmi, remarks], (err, results) => {
        if(err){
            return res.status(500).json(err);
        }
        res.json({message: "Data added successfully", id: results.insertId});
    })
})

//API to delete BMI Data
app.delete('/bmi/:id', (req, res) => {
    const id = req.params.id;
    // console.log("Deleting ID:", id);
    const sql = "DELETE from users WHERE id = ?";
    db.query(sql, [id],(err, results) => {
        if(err){
            return res.status(500).json(err);
        }
        res.json({message: "Data deleted successfully", id: id});
    })
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})