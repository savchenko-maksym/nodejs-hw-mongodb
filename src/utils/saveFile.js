import { ENV_VARS } from '../constants/envVars.js';
import { getEnvVar } from './getEnvVar.js';
import { saveFileToCloudinary } from './saveFileToCloudinary.js';
import { saveFileToLocal } from './saveFileToLocal.js';

export const saveFile = async (file) => {
  if (getEnvVar(ENV_VARS.IS_CLOUDINARY_ENABLED) === 'true') {
    return await saveFileToCloudinary(file);
  } else {
    return await saveFileToLocal(file);
  }
};
