import type { Contact } from "../interfaces/IContact"



export function saveContact(contact: Contact) {
  const existing = getAllContacts()
  const updated = [...existing, contact]
  localStorage.setItem("contacts", JSON.stringify(updated))
}

export function getAllContacts(): Contact[] {
  const raw = localStorage.getItem("contacts")
  return raw ? JSON.parse(raw) : []
}

export function getContactsByUser(username: string) {
  return getAllContacts().filter(contact => contact.username === username)
}

export function getContactsByCity(city: string) {
  return getAllContacts().filter(contact => contact.address.localidade === city)
}

export function getContactsByState(uf: string) {
  return getAllContacts().filter(contact => contact.address.uf === uf)
}

export function searchContactsByDisplayName(query: string) {
  return getAllContacts().filter(contact =>
    contact.displayName.toLowerCase().includes(query.toLowerCase())
  )
}

export function deleteContact(id: string) {
  const existing = getAllContacts()
  const updated = existing.filter(contact => contact.id !== id)
  localStorage.setItem("contacts", JSON.stringify(updated))
}

export function updateContactDisplayName(id: string, newDisplayName: string) {
  const existing = getAllContacts()
  const updated = existing.map(contact =>
    contact.id === id ? { ...contact, displayName: newDisplayName } : contact
  )
  localStorage.setItem("contacts", JSON.stringify(updated))
}

