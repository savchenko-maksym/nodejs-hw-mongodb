import { Contact } from '../db/models/contact.js';
import createHttpError from 'http-errors';
import { createPaginationMetaData } from '../utils/createPaginationMetaData.js';
import { getSortParams } from '../utils/getSortParams.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder,
  sortBy,
  filter,
}) => {
  const offset = (page - 1) * perPage;
  const { field, order } = getSortParams(sortOrder, sortBy);
  const contactsFilter = Contact.find();

  if (filter.contactType) {
    contactsFilter.where('contactType').equals(filter.contactType);
  }

  const [contacts, contactsCount] = await Promise.all([
    Contact.find()
      .merge(contactsFilter)
      .skip(offset)
      .limit(perPage)
      .sort({ [field]: order }),
    Contact.find().merge(contactsFilter).countDocuments(),
  ]);

  const metaData = createPaginationMetaData(page, perPage, contactsCount);

  return { contacts, ...metaData };
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const contact = await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

export const deleteContactById = async (contactId) => {
  const contact = await Contact.findByIdAndDelete(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
};
