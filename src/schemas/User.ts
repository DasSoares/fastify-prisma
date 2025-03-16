export const schemaUsers = {
  $id: "UsersResponse",
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "number" },
      name: { type: "string" },
      email: { type: "string" },
    },
    // required: ["id", "name", "email"]
  },
};

export const schemaUser = {
  $id: "UserResponse",
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    email: { type: "string" },
  },
  // required: ["id", "name", "email"]
};
