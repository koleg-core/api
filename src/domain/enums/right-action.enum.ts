export enum RightAction {
  READ, // Public
  UPDATE, // Self, Manager, Admin
  CREATE, // Manager
  UPDATE_RIGHTS, // Admin
  UPDATE_PASSWORD, // Self, Admin
  UPDATE_SSH_KEY, // Self?, Admin
  DELETE, // Admin
  FULL_READ, // Self, Admin
  ALL, // Super admin
}
