import app from "./app";
import { config } from "./config/config";

app.listen(config.port, () => {
  console.log(`Backend server listening on http://localhost:${config.port}`);
});
