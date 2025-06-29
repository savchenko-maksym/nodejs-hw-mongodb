import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

import { parsePaginationParams } from '../utils/parsePagination.js';

export const getAllContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = req.query;
  const filter = parseFilterParams(req.query);
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
  const contact = await getContactById(contactId);

  res.json({
    status: 200,
    message: `Successfully found contact with id: ${contactId}`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);
  return res.json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await updateContact(contactId, req.body);
  return res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  await deleteContactById(contactId);

  res.status(204).send();
};
