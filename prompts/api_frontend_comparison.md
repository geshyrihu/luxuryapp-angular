# Análisis Comparativo de Endpoints (API vs Frontend)

Este documento presenta una tabla comparativa entre el contrato Swagger (Backend) y los endpoints extraídos en el Frontend. Se incluye una propuesta de refactorización hacia estándares RESTful.

## Resumen

- **Total Endpoints en API (Swagger):** 1181
- **Total Endpoints en Frontend:** 0
- **Endpoints API usados en Front:** 0
- **Endpoints Frontend sin correspondencia clara en API:** 0

> **Nota sobre el Estándar Propuesto:** La columna de refactorización sugiere convenciones REST (ej. usar `GET /api/recurso` en lugar de `POST /api/recurso/listar`, estandarizar sustantivos en plural, etc.).

## Tabla de Correspondencias (Muestra Representativa de Endpoints Emparejados)

| API (Swagger) | Frontend Endpoint | Coincidencia | Propuesta Refactorización |
| ------------- | ----------------- | ------------ | ------------------------- |

## Endpoints del Frontend sin correspondencia clara en el Swagger (Huérfanos / Custom)

| Frontend Endpoint | Módulo | Estado | Observación |
| ----------------- | ------ | ------ | ----------- |

## Endpoints del API no detectados en Frontend (Potencialmente no usados o implementados de otra forma)

| API (Swagger)                                                                             | Módulo / Tag          |
| ----------------------------------------------------------------------------------------- | --------------------- |
| `GET` /api/AccesoCustomers/GetCustomers/{id}                                              | AccesoCustomers       |
| `POST` /api/AccesoCustomers/AddCustomerAccesoToUser/{id}                                  | AccesoCustomers       |
| `GET` /api/AccountingCatalog/customer/{customerId}                                        | AccountingCatalog     |
| `PUT` /api/Address/{addressId}                                                            | Address               |
| `GET` /api/AgendaSupervision/{id}                                                         | AgendaSupervision     |
| `PUT` /api/AgendaSupervision/{id}                                                         | AgendaSupervision     |
| `DELETE` /api/AgendaSupervision/{id}                                                      | AgendaSupervision     |
| `GET` /api/AgendaSupervision/list/{start}/{end}                                           | AgendaSupervision     |
| `POST` /api/AgendaSupervision                                                             | AgendaSupervision     |
| `POST` /api/AiAssistant/GenerateImage                                                     | AiAssistant           |
| `POST` /api/AiChat/StartSession                                                           | AiChat                |
| `POST` /api/AiChat/SendMessage                                                            | AiChat                |
| `GET` /api/AiChat/Sessions                                                                | AiChat                |
| `GET` /api/AiChat/History/{sessionId}                                                     | AiChat                |
| `GET` /api/AiKnowledgeBase                                                                | AiKnowledgeBase       |
| `POST` /api/AiKnowledgeBase                                                               | AiKnowledgeBase       |
| `PUT` /api/AiKnowledgeBase                                                                | AiKnowledgeBase       |
| `GET` /api/AiKnowledgeBase/{id}                                                           | AiKnowledgeBase       |
| `DELETE` /api/AiKnowledgeBase/{id}                                                        | AiKnowledgeBase       |
| `GET` /api/AiKnowledgeBase/modules                                                        | AiKnowledgeBase       |
| `GET` /api/Almacen/customer/{customerId}                                                  | Almacen               |
| `GET` /api/Almacen/my-warehouses/{customerId}                                             | Almacen               |
| `GET` /api/Almacen/{id}                                                                   | Almacen               |
| `PUT` /api/Almacen/{id}                                                                   | Almacen               |
| `DELETE` /api/Almacen/{id}                                                                | Almacen               |
| `POST` /api/Almacen                                                                       | Almacen               |
| `PUT` /api/Almacen/assign-responsibles                                                    | Almacen               |
| `POST` /api/Announcements/generate-draft                                                  | Announcements         |
| `GET` /api/Announcements                                                                  | Announcements         |
| `POST` /api/Announcements                                                                 | Announcements         |
| `GET` /api/Announcements/admin-list                                                       | Announcements         |
| `GET` /api/Announcements/{id}                                                             | Announcements         |
| `PUT` /api/Announcements/{id}                                                             | Announcements         |
| `DELETE` /api/Announcements/{id}                                                          | Announcements         |
| `GET` /api/Announcements/{id}/analytics                                                   | Announcements         |
| `GET` /api/Announcements/{id}/pdf                                                         | Announcements         |
| `GET` /api/application-roles/{roleId}                                                     | ApplicationRoles      |
| `GET` /api/application-roles                                                              | ApplicationRoles      |
| `POST` /api/application-roles                                                             | ApplicationRoles      |
| `PUT` /api/application-roles/{id}                                                         | ApplicationRoles      |
| `DELETE` /api/application-roles/{id}                                                      | ApplicationRoles      |
| `GET` /api/application-roles/{id}/pdf                                                     | ApplicationRoles      |
| `POST` /api/application-users/CreateAccount                                               | ApplicationUser       |
| `GET` /api/application-users/{applicationUserId}                                          | ApplicationUser       |
| `PUT` /api/application-users/UpdateAccount/{applicationUserId}                            | ApplicationUser       |
| `DELETE` /api/application-users/Delete/{applicationUserId}                                | ApplicationUser       |
| `POST` /api/application-users/AddRoleToUser/{applicationUserId}                           | ApplicationUser       |
| `GET` /api/application-users/ToBlockAccount/{id}                                          | ApplicationUser       |
| `GET` /api/application-users/ToUnlockAccount/{id}                                         | ApplicationUser       |
| `GET` /api/application-users/GetRole/{applicationUserId}/{roleType}                       | ApplicationUser       |
| `GET` /api/application-users/List/{customerId}/{state}/{typePerson}                       | ApplicationUser       |
| `GET` /api/application-users/List/{state}/{typePerson}                                    | ApplicationUser       |
| `GET` /api/application-users/SearchExistingEmail                                          | ApplicationUser       |
| `GET` /api/application-users/SearchExistingPhone/{phoneNumber}                            | ApplicationUser       |
| `GET` /api/application-users/SearchExistingPerson/{namePerson}                            | ApplicationUser       |
| `GET` /api/application-users/ExistsPersonByName/{namePerson}                              | ApplicationUser       |
| `GET` /api/application-users/ExistsEmail/{email}                                          | ApplicationUser       |
| `GET` /api/application-users/ExistsPhoneNumber/{phoneNumber}                              | ApplicationUser       |
| `GET` /api/application-users/CardUser/{applicationUserId}                                 | ApplicationUser       |
| `POST` /api/application-users/ChangePassword/{id}                                         | ApplicationUser       |
| `POST` /api/application-users/UpdateImage/{applicationUserId}                             | ApplicationUser       |
| `GET` /api/application-users/ExistsApplicationUserEmail                                   | ApplicationUser       |
| `GET` /api/application-users/ExistsApplicationUserPhoneNumber                             | ApplicationUser       |
| `GET` /api/application-users/ExistsApplicationUserUserName                                | ApplicationUser       |
| `POST` /api/application-users/SendMailRecoverPassword                                     | ApplicationUser       |
| `GET` /api/application-users/SendNewUserNameForEmail/{applicationUserId}                  | ApplicationUser       |
| `GET` /api/application-users/SendNewPasswordForEmail/{applicationUserId}                  | ApplicationUser       |
| `GET` /api/approval-rules/matrix                                                          | ApprovalRules         |
| `PUT` /api/approval-rules/matrix                                                          | ApprovalRules         |
| `GET` /api/aspel-customer-empresa                                                         | AspelCustomerEmpresa  |
| `POST` /api/aspel-customer-empresa                                                        | AspelCustomerEmpresa  |
| `PUT` /api/aspel-customer-empresa/{id}                                                    | AspelCustomerEmpresa  |
| `DELETE` /api/aspel-customer-empresa/{id}                                                 | AspelCustomerEmpresa  |
| `POST` /api/Auth/Login                                                                    | Auth                  |
| `POST` /api/Auth/Refresh                                                                  | Auth                  |
| `POST` /api/Auth/Logout                                                                   | Auth                  |
| `POST` /api/Auth/RecoverPassword                                                          | Auth                  |
| `POST` /api/Auth/ConfirmRecoverPassword                                                   | Auth                  |
| `GET` /api/Banks/{id}                                                                     | Banks                 |
| `PUT` /api/Banks/{id}                                                                     | Banks                 |
| `DELETE` /api/Banks/{id}                                                                  | Banks                 |
| `GET` /api/Banks                                                                          | Banks                 |
| `POST` /api/Banks                                                                         | Banks                 |
| `GET` /api/cobranza-nativa/billing-config/{customerId}                                    | BillingConfig         |
| `POST` /api/cobranza-nativa/billing-config                                                | BillingConfig         |
| `GET` /api/Birthday/{customerId}/{month}                                                  | Birthday              |
| `GET` /api/BitacoraMantenimiento/{id}                                                     | BitacoraMantenimiento |
| `DELETE` /api/BitacoraMantenimiento/{id}                                                  | BitacoraMantenimiento |
| `GET` /api/BitacoraMantenimiento/list/{customerId}/{startDate}/{finalDate}                | BitacoraMantenimiento |
| `GET` /api/BitacoraMantenimiento/BitacoraIndividual/{machineryId}/{startDate}/{finalDate} | BitacoraMantenimiento |
| `GET` /api/BitacoraMantenimiento/BitacoraDashboard/{customerId}/{startDate}/{finalDate}   | BitacoraMantenimiento |
| `POST` /api/BitacoraMantenimiento                                                         | BitacoraMantenimiento |
| `GET` /api/BoardDirectors/documents/{customerId}/{documentType}                           | BoardDirectors        |
| `GET` /api/BoardDirectors/financial-reports/{customerId}                                  | BoardDirectors        |
| `GET` /api/BoardDirectors/monthly-meetings/{customerId}                                   | BoardDirectors        |
| `GET` /api/BoardDirectors/meeting-minutes/{customerId}                                    | BoardDirectors        |
| `GET` /api/BoardDirectors/meeting-minutes-detail/{meetingId}                              | BoardDirectors        |
| `GET` /api/BoardDirectors/document-by-type/{customerId}/{documentType}                    | BoardDirectors        |
| `GET` /api/BudgetAccountRules/{customerId}                                                | BudgetAccountRules    |
| `POST` /api/BudgetAccountRules                                                            | BudgetAccountRules    |
| `PUT` /api/BudgetAccountRules/{id}                                                        | BudgetAccountRules    |
| ...                                                                                       | ...                   |
