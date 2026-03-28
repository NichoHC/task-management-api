import 'dotenv/config';
import app from './app'; 
import { config } from "./config/config";
import './persistence/database';
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});