'use client';

import { useLocalStorage } from './useLocalStorage';

export interface UserContact {
  name: string;
  phone: string;
  email?: string;
  whatsapp?: boolean;
  collectedAt: number;
}

const STORAGE_KEY = 'aviniti_user_contact';
const INITIAL_CONTACT: UserContact = {
  name: '',
  phone: '',
  collectedAt: 0,
};

export function useUserContact() {
  const [contact, setContact] = useLocalStorage<UserContact>(STORAGE_KEY, INITIAL_CONTACT);

  const hasContact = !!(contact.phone && contact.collectedAt > 0);

  const updateContact = (data: Partial<UserContact>) => {
    setContact((prev) => ({
      ...prev,
      ...data,
      collectedAt: Date.now(),
    }));
  };

  const clearContact = () => {
    setContact(INITIAL_CONTACT);
  };

  return { contact, hasContact, updateContact, clearContact };
}
