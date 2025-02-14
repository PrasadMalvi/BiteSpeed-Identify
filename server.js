const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5051;

//Route
app.use("/identify", require("./Routes/IdentifyRoute"));

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
