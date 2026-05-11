require("dotenv").config();
const ConnectDB = require("./src/config/db");
const app = require("./src/app");
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await ConnectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

startServer();
