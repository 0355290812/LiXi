const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

// Kết nối MongoDB
mongoose.connect("mongodb+srv://ha2kv3:tZdFqljkfYnPYn8Y@cluster0.lgvys.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB", error);
});

// Tạo schema và model cho Lì xì
const liXiSchema = new mongoose.Schema({
    value: Number,
    name: String,
});

const LiXi = mongoose.model("LiXi", liXiSchema);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.set("view engine", "ejs");

// API để nhận lì xì
app.get("/api/liexi", async (req, res) => {
    const randomValues = [10000, 20000, 50000];
    const randomIndex = Math.floor(Math.random() * randomValues.length);
    const randomLiXi = new LiXi({ value: randomValues[randomIndex] });
    await randomLiXi.save();
    res.json(randomLiXi);
});

app.post("/api/liexi", async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Vui lòng nhập tên!" });
    }

    // Kiểm tra tên đã nhận lì xì chưa
    const existingLiXi = await LiXi.findOne({ name });
    if (existingLiXi) {
        return res.status(400).json({
            message: `Nhận lì xì rùi mà!`,
        });
    }

    // Giá trị lì xì (thêm các giá trị mới)
    const randomValues = [1000, 2000, 5000, 10000, 20000, 50000];
    const randomIndex = Math.floor(Math.random() * randomValues.length);
    const randomValue = randomValues[randomIndex];

    // Lưu lì xì vào cơ sở dữ liệu
    const liXi = new LiXi({ name, value: randomValue });
    await liXi.save();

    res.json({
        message: `Chúc mừng năm mới, ${name}! Bạn đã nhận được:`,
        value: liXi.value,
    });
});

// Giao diện chính
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
