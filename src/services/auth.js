import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { sendEmail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import { ENV_VARS } from '../constants/envVars.js';
import Handlebars from 'handlebars';
import fs from 'node:fs';
import path from 'node:path';
import { TEMPALTE_DIR } from '../constants/paths.js';

const reaetPasswordTemplate = fs
  .readFileSync(path.join(TEMPALTE_DIR, 'sendResetEmailTemplate.html'))
  .toString();

const createSession = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + 1000 * 60 * 15),
  refreshTokenValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
});

export const registerUser = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    ...payload,
    password: hashedPassword,
  });
  return user;
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'Email is wrong');
  }

  const isEqualPassword = await bcrypt.compare(payload.password, user.password);

  if (!isEqualPassword) {
    throw createHttpError(401, 'Password is wrong');
  }

  await SessionsCollection.findOneAndDelete({
    userId: user._id,
  });

  const session = await SessionsCollection.create({
    ...createSession(),
    userId: user._id,
  });

  return session;
};

export const logoutUser = async (sessionId, refreshToken) => {
  await SessionsCollection.findOneAndDelete({
    _id: sessionId,
    refreshToken,
  });
};

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionsCollection.findByIdAndDelete(sessionId);

  const newSession = await SessionsCollection.create({
    ...createSession(),
    userId: session.userId,
  });

  return newSession;
};

export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    getEnvVar(ENV_VARS.JWT_SECRET),
    {
      expiresIn: '5m',
    },
  );

  const template = Handlebars.compile(reaetPasswordTemplate);

  const html = template({
    name: user.name,
    link: `${getEnvVar(
      ENV_VARS.FRONTEND_DOMAIN,
    )}/reset-password?token=${token}`,
  });

  await sendEmail({ email, html, subject: 'Reset your password' });
};

export const resetPassword = async ({ token, password }) => {
  let tokenPayload;

  try {
    tokenPayload = jwt.verify(token, getEnvVar(ENV_VARS.JWT_SECRET));
  } catch (error) {
    console.log(error);
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findById(tokenPayload.sub);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.findByIdAndUpdate(tokenPayload.sub, { password: hashedPassword });
  await SessionsCollection.findOneAndDelete({ userId: tokenPayload.sub });
};
