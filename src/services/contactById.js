import { Contact } from '../db/models/contact.js';

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};
