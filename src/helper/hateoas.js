export const toUserResponse = (user) => {
  return {
    username: user.username,
    name: user.name,
    _links: {
      self: { href: "/api/users/me", method: "GET" },
      update: { href: "/api/users", method: "PATCH" },
      logout: { href: "/api/users/logout", method: "POST" },
      contacts: { href: "/api/contacts", method: "GET" },
    },
  };
};

export const toContactResponse = (contact) => {
  const result = {
    id: contact.id,
    first_name: contact.first_name,
    last_name: contact.last_name,
    email: contact.email,
    phone: contact.phone,
    _links: {
      self: { href: `/api/contacts/${contact.id}`, method: "GET" },
      update: { href: `/api/contacts/${contact.id}`, method: "PATCH" },
      delete: { href: `/api/contacts/${contact.id}`, method: "DELETE" },
      addresses: { href: `/api/contacts/${contact.id}/addresses`, method: "GET" },
      create_address: { href: `/api/contacts/${contact.id}/addresses`, method: "POST" },
    },
  };
  if (contact._fromCache) {
    result._fromCache = true;
  }
  return result;
};

export const toContactSearchResponse = (contacts, paging, size) => {
  const links = {
    self: { href: `/api/contacts?page=${paging.page}&size=${size}`, method: "GET" },
    first: { href: `/api/contacts?page=1&size=${size}`, method: "GET" },
    last: { href: `/api/contacts?page=${paging.total_page}&size=${size}`, method: "GET" },
  };
  if (paging.page > 1) {
    links.prev = { href: `/api/contacts?page=${paging.page - 1}&size=${size}`, method: "GET" };
  }
  if (paging.page < paging.total_page) {
    links.next = { href: `/api/contacts?page=${paging.page + 1}&size=${size}`, method: "GET" };
  }

  return {
    data: contacts.map((contact) => toContactResponse(contact)),
    paging,
    _links: links,
  };
};

export const toAddressResponse = (address, contactId) => {
  return {
    id: address.id,
    street: address.street,
    city: address.city,
    province: address.province,
    country: address.country,
    postal_code: address.postal_code,
    _links: {
      self: { href: `/api/contacts/${contactId}/addresses/${address.id}`, method: "GET" },
      update: { href: `/api/contacts/${contactId}/addresses/${address.id}`, method: "PUT" },
      delete: { href: `/api/contacts/${contactId}/addresses/${address.id}`, method: "DELETE" },
      contact: { href: `/api/contacts/${contactId}`, method: "GET" },
    },
  };
};
