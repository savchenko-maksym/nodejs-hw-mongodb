import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
} from '../controllers/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactValidation,
  updateContactSchema,
} from '../validation/createContactValidation.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/uploadFiles.js';

const contactsRouter = Router();
contactsRouter.use('/contacts', authenticate);

contactsRouter.use('/contacts/:contactId', isValidId('contactId'));

contactsRouter.get('/contacts', ctrlWrapper(getAllContactsController));
contactsRouter.get(
  '/contacts/:contactId',
  ctrlWrapper(getContactByIdController),
);
contactsRouter.post(
  '/contacts',
  upload.single('photo'),
  validateBody(createContactValidation),
  ctrlWrapper(createContactController),
);
contactsRouter.patch(
  '/contacts/:contactId',
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);
contactsRouter.delete(
  '/contacts/:contactId',
  ctrlWrapper(deleteContactController),
);

export default contactsRouter;
