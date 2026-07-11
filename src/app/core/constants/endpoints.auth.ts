export const EndpointsAuth = {
  AccesoCustomers: {
    addToUser: (applicationUserId: string) =>
      `AccesoCustomers/AddCustomerAccesoToUser/${applicationUserId}`,
    getByUser: (applicationUserId: string) =>
      `AccesoCustomers/GetCustomers/${applicationUserId}`,
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
    addRoleToUser: (id: string) => `application-users/AddRoleToUser/${id}`,
    cardUser: (id: string) => `application-users/CardUser/${id}`,
    createAccount: "application-users/CreateAccount",
    delete: (id: string) => `application-users/Delete/${id}`,
    getAll: (state: boolean, typePerson: any) =>
      `application-users/List/${state}/${typePerson}`,
    getById: (id: string) => `application-users/${id}`,
    getRoleUrl: (id: string, roleType: number | null) =>
      roleType !== null
        ? `application-users/GetRole/${id}/${roleType}`
        : `application-users/GetRole/${id}`,
    searchExistingPerson: (fullName: string) =>
      `application-users/SearchExistingPerson/${fullName}`,
    searchExistingPhone: (phone: string) =>
      `application-users/SearchExistingPhone/${phone}`,
    sendNewUserNameForEmail: (id: string) =>
      `application-users/SendNewUserNameForEmail/${id}`,
    toBlockAccount: (id: string) => `application-users/ToBlockAccount/${id}`,
    toUnlockAccount: (id: string) => `application-users/ToUnlockAccount/${id}`,
    updateAccount: (id: string) => `application-users/UpdateAccount/${id}`,
  },
  Auth: {
    sendNewPasswordForEmail: (id: string) =>
      `application-users/SendNewPasswordForEmail/${id}`,
  },
  ModuleAppRoles: {
    assignments: (roleId: string) => `module-app-roles/Assignments/${roleId}`,
    listModule: "module-app-roles/ListModule",
    listRole: "module-app-roles/ListRole",
    updateAssigned: "module-app-roles/UpdateModuleAppRolAssigned",
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
} as const;
