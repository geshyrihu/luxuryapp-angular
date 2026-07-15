export const EndpointsAuth = {
  AccesoCustomers: {
    addToUser: (applicationUserId: string) =>
      `auth/acceso-customers/add-customer-acceso-to-user/${applicationUserId}`,
    getByUser: (applicationUserId: string) =>
      `auth/acceso-customers/get-customers/${applicationUserId}`,
  },
  ApplicationRoles: {
    create: "application-roles",
    delete: (id: string) => `application-roles/${id}`,
    getAll: "application-roles",
    getById: (id: string) => `application-roles/${id}`,
    getPdf: (id: string) => `application-roles/${id}/pdf`,
    update: (id: string) => `application-roles/${id}`,
  },
  Auth: {
    login: "auth/login",
    logout: "auth/logout",
    refresh: "auth/refresh",
    recoverPassword: "auth/recover-password",
    confirmRecoverPassword: "auth/confirm-recover-password",
    recoverAccount: {
      sendMailRecoverPassword: "auth/account-recovery/send-mail-recover-password",
      sendNewPasswordForEmail: (id: string) =>
        `auth/account-recovery/send-new-password-for-email/${id}`,
      sendNewUserNameForEmail: (id: string) =>
        `auth/account-recovery/send-new-user-name-for-email/${id}`,
    },
  },
  ModuleAppRoles: {
    assignments: (roleId: string) => `module-app-roles/assignments/${roleId}`,
    listModule: "module-app-roles/list-module",
    listRole: "module-app-roles/list-role",
    updateAssigned: "module-app-roles/update-module-app-rol-assigned",
  },
  PasswordManager: {
    Credentials: {
      getPaged: "password-manager/credentials/filter",
      getById: (id: string) => `password-manager/credentials/${id}`,
      create: "password-manager/credentials",
      update: (id: string) => `password-manager/credentials/${id}`,
      delete: (id: string) => `password-manager/credentials/${id}`,
    },
  },
  Users: {
    changePassword: (id: string) => `users/change-password/${id}`,
    updateImage: (applicationUserId: string) =>
      `users/update-image/${applicationUserId}`,
  },
  RefactorAuth: {
    usersChangePasswordById: (id: any) => `users/change-password/${id}`,
    usersUpdateImageById: (applicationUserId: any) => `users/update-image/${applicationUserId}`,
  },
} as const;
