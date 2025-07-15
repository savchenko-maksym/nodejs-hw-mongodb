import { Router } from 'express';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
  resetPasswordController,
  sendResetEmailController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserValidationSchema } from '../validation/registerUserValidation.js';
import { loginUserValidationSchema } from '../validation/loginUserValidation.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { sendResetEmailValidationSchema } from '../validation/sendResetEmailValidationSchems.js';
import { resetPasswordValidationSchema } from '../validation/resetPasswordValidationSchema.js';

const authRouter = Router();

authRouter.post(
  '/auth/register',
  validateBody(registerUserValidationSchema),
  ctrlWrapper(registerUserController),
);
authRouter.post(
  '/auth/login',
  validateBody(loginUserValidationSchema),
  ctrlWrapper(loginUserController),
);
authRouter.post('/auth/logout', ctrlWrapper(logoutUserController));
authRouter.post('/auth/refresh-session', ctrlWrapper(refreshSessionController));

authRouter.post(
  '/auth/send-reset-email',
  validateBody(sendResetEmailValidationSchema),
  ctrlWrapper(sendResetEmailController),
);
authRouter.post(
  '/auth/reset-pwd',
  validateBody(resetPasswordValidationSchema),
  ctrlWrapper(resetPasswordController),
);

export default authRouter;
