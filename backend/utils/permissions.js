exports.canManageMembers = (role) => {
  return role === "owner" || role === "admin";
};

exports.isOwner = (role) => {
  return role === "owner";
};