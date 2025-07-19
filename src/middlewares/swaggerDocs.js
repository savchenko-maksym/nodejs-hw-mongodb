import fs from 'node:fs';
import { SWAGGER_PATH } from '../constants/paths.js';
import swaggerUi from 'swagger-ui-express';

export const swaggerDocs = () => {
  try {
    const swaggerDocs = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    return [...swaggerUi.serve, swaggerUi.setup(swaggerDocs)];
  } catch (error) {
    console.log(error);
    return (req, res) => {
      res.status(500).json({ status: 500, message: "Can't load swagger docs" });
    };
  }
};
