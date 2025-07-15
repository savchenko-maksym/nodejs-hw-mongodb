import { createTransport } from 'nodemailer';
import { ENV_VARS } from '../constants/envVars.js';
import { getEnvVar } from './getEnvVar.js';
import createHttpError from 'http-errors';

const mailClient = createTransport({
  host: getEnvVar(ENV_VARS.SMTP_HOST),
  port: getEnvVar(ENV_VARS.SMTP_PORT),
  auth: {
    user: getEnvVar(ENV_VARS.SMTP_USER),
    pass: getEnvVar(ENV_VARS.SMTP_PASSWORD),
  },
});

export const sendEmail = async ({ email, html, subject }) => {
  try {
    await mailClient.sendMail({
      to: email,
      subject,
      html,
      from: getEnvVar(ENV_VARS.SMTP_FROM),
    });
  } catch (error) {
    console.error(error);
    throw createHttpError(500, 'Failed to send email');
  }
};
