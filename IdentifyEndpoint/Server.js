const express = require("express");

const app = express();
app.use(express.jspn);
app.use(cors());
const PORT = process.env.PORT || 5051;

//Route
app.post("/identify", require("./Routes/IdentifyRoute"));

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
