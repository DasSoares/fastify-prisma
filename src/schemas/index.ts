export const schemaSuccess = {
  $id: "PingSuccess",
  type: "object",
  properties: {
    message: { type: "string" },
  },
  required: ["message"],
};


export const schemaAPIResponseError = {
  $id: "APIResponseError",
  type: "object",
  properties: {
    message: { type: "string" },
  },
  required: ["message"]
}
