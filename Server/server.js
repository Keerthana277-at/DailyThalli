const dotenv = require("dotenv");
dotenv.config();

console.log("Mongo:",process.env.MONGO_URI);
console.log("Port:",process.env.PORT);

const connectDB = require("./config/db");
const app = require("./app");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});