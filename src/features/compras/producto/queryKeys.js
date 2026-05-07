export const productoKeys = {
  all: ["productos"],

  lists: () => [...productoKeys.all, "list"],

  list: (filters) => [...productoKeys.lists(), filters],

  details: () => [...productoKeys.all, "detail"],

  detail: (id) => [...productoKeys.details(), id],

  exists: (nombre) => [...productoKeys.all, "exists", nombre],
};