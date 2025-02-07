const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

// Hàm chọn giá trị với tỉ lệ: 10.000 (90%), 20.000 (9%), 50.000 (1%)
function getRandomValue() {
    const r = Math.random(); // trả về số ngẫu nhiên từ 0 đến 1
    if (r < 0.90) {
        return 10000;
    } else if (r < 0.99) { // từ 0.90 đến 0.99 (tương đương 9%)
        return 20000;
    } else {
        return 50000; // từ 0.99 đến 1 (tương đương 1%)
    }
}

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.set("view engine", "ejs");

// API để nhận lì xì theo POST
app.post("/api/liexi", async (req, res) => {

    // Kiểm tra tên đã nhận lì xì chưa
    const randomValue = getRandomValue();

    res.json({
        message: `Chúc mừng năm mới! Chúc mừng quý khách đã nhận được`,
        value: randomValue,
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
