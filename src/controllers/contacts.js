import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

import { parsePaginationParams } from '../utils/parsePagination.js';
import { saveFile } from '../utils/saveFile.js';

export const getAllContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = req.query;
  const filter = parseFilterParams(req.query);
  filter.userId = req.user._id;
  const contacts = await getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);

  res.json({
    status: 200,
    message: `Successfully found contact with id: ${contactId}`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const photo = req.file;
  let photoUrl;

  if (photo) {
    photoUrl = await saveFile(photo);
  }

  const contact = await createContact({
    ...req.body,
    userId: req.user._id,
    ...(photoUrl && { photo: photoUrl }),
  });

  return res.json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const photo = req.file;

  const photoUrl = await saveFile(photo);

  const contact = await updateContact(
    contactId,
    { ...req.body, ...(photoUrl && { photo: photoUrl }) },
    req.user._id,
  );

  return res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  await deleteContactById(contactId, req.user._id);

  res.status(204).send();
};
