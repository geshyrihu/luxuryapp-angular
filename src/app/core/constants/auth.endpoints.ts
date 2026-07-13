export const EndpointsAuth = {
  AccesoCustomers: {
    addToUser: (applicationUserId: string) =>
      `acceso-customers/add-customer-acceso-to-user/${applicationUserId}`,
    getByUser: (applicationUserId: string) =>
      `acceso-customers/get-customers/${applicationUserId}`,
  },
  ApplicationRoles: {
    create: "application-roles",
    delete: (id: string) => `application-roles/${id}`,
    getAll: "application-roles",
    getById: (id: string) => `application-roles/${id}`,
    getPdf: (id: string) => `application-roles/${id}/pdf`,
    update: (id: string) => `application-roles/${id}`,
  },
  ApplicationUsers: {
    addRoleToUser: (id: string) => `application-users/add-role-to-user/${id}`,
    cardUser: (id: string) => `application-users/card-user/${id}`,
    createAccount: "application-users/create-account",
    delete: (id: string) => `application-users/delete/${id}`,
    getAll: (state: boolean, typePerson: any) =>
      `application-users/list/${state}/${typePerson}`,
    getById: (id: string) => `application-users/${id}`,
    getRoleUrl: (id: string, roleType: number | null) =>
      roleType !== null
        ? `application-users/get-role/${id}/${roleType}`
        : `application-users/get-role/${id}`,
    searchExistingPerson: (fullName: string) =>
      `application-users/search-existing-person/${fullName}`,
    searchExistingPhone: (phone: string) =>
      `application-users/search-existing-phone/${phone}`,
    sendNewUserNameForEmail: (id: string) =>
      `application-users/send-new-user-name-for-email/${id}`,
    toBlockAccount: (id: string) => `application-users/to-block-account/${id}`,
    toUnlockAccount: (id: string) => `application-users/to-unlock-account/${id}`,
    updateAccount: (id: string) => `application-users/update-account/${id}`,
  },
  Auth: {
    login: "auth/login",
    logout: "auth/logout",
    refresh: "auth/refresh",
    sendNewPasswordForEmail: (id: string) =>
      `application-users/send-new-password-for-email/${id}`,
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
  RefactorAuth: {
    usersChangePasswordById: (id: any) => `users/change-password/${id}`,
    usersUpdateImageById: (applicationUserId: any) => `users/update-image/${applicationUserId}`,
  },
} as const;
