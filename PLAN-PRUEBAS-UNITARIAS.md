# Plan de Implementación de Pruebas Unitarias

## Proyecto: LuxuryApp Angular (Standalone Components + Signals)

**Framework de pruebas:** Vitest v4.0.18 (`angular.json` aún referencia Karma, pero la ejecución real usa `vitest.config.ts`)

> **Constitución del proyecto:** Este plan cumple con los mandatos de `GEMINI.md` (raíz del repositorio). Las reglas arquitectónicas vinculantes se detallan en la sección 15.

---

## Estado Actual (Junio 2026)

### Estructura de features

Solo `features/configuration/` y `features/vault/` han sido migrados de `features/tenant/` a `features/`. El resto de los features (tasks, supervision, employees, dashboard, etc.) aún residen en `features/tenant/`. **Hasta que un feature sea migrado, sus specs deben permanecer en `features/tenant/`.

### Inventario de pruebas

| Área | Specs | Estado |
|------|-------|--------|
| `core/` (servicios, guards, pipes, directivas, componentes) | ~230 | ✅ Funcionales (Vitest) |
| `features/tenant/` (no migrados aún) | ~120 | ✅ Funcionales (Vitest) |
| `features/` (configuration, vault, etc.) | ~110 | ✅ Funcionales |
| `layout/` | ~28 | ✅ Funcionales |
| `login/` | 4 | ✅ Funcionales |
| `shared/` | 2 | ✅ Funcionales |
| **Total** | **507** (~2080 tests) | ✅ 0 fallos |

### Corregido en Junio 2026 (seguimiento)

| Archivo | Problema | Solución |
|---------|----------|----------|
| `header-employee-monitor.spec.ts` | 6 fallos por `NG0201: No provider found for MessageService` | Agregado `{ provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } }` en `TestBed` |
| `funding-list.spec.ts` | Aserto `toHaveBeenCalledWith` incompatible en vitest al comparar clases | Reemplazado por verificación manual de argumentos |
| `gastos-mantenimiento.spec.ts` | Import roto (`../../calendar/...` no existe) | Corregido path a `../../google-calendar/calendar/...` |
| `task-view.spec.ts` | Unhandled rejection: `this.route.params.subscribe is not a function` | Mock de `ActivatedRoute.params` corregido a `{ subscribe: vi.fn() }` |
| `test-setup.ts` | Unhandled rejections de Stencil Core (`adoptedStyleSheets` undefined) | Polyfill ampliado a `HTMLElement.prototype` y `ShadowRoot.prototype` |

> **Nota:** El test `gastos-mantenimiento.spec.ts` genera 3 warnings cosméticos de `Unhandled Rejection` (API error de escenario negativo y mocks de `onLoadData`) que no afectan los asserts. Se deja para limpieza en iteración futura menor.

### Dependencia: migración de features

Los specs de `features/tenant/` NO deben copiarse a `features/` hasta que los fuentes del feature respectivo sean migrados. La migración de cada feature incluye mover sus `.ts`, `.html` y `.spec.ts` juntos.

## Prioridades de Implementación

| Prioridad | Categoría | Justificación |
|-----------|-----------|---------------|
| **P0** | Servicios críticos | Núcleo de la aplicación: autenticación, roles, sesión, conectividad |
| **P1** | Guards | Control de acceso a rutas, seguridad |
| **P2** | Pipes | Lógica de transformación de datos pura y fácil de probar |
| **P3** | Componentes de layout | Navegación, sidebar, header, footer |
| **P4** | Componentes core reutilizables | Botones, inputs, badges, loaders |
| **P5** | Componentes de login/recuperación | Flujo de autenticación |
| **P6** | Componentes compartidos | AI chat, análisis de imágenes |
| **P7** | Componentes de features (84) | Páginas específicas de negocio |

---

## 1. Servicios (P0) ✅

### 1.1 `AuthService` (`core/services/auth.service.ts`) ✅

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 1.1.1 | `login()` exitoso | POST a Auth/Login, respuesta exitosa → `currentUserSession` actualizado, `userToken$` emite, `isAuthenticated$` true, redirección |
| 1.1.2 | `login()` fallido | POST a Auth/Login, error 401 → mensaje de error, no actualiza sesión |
| 1.1.3 | `logout()` | POST a Auth/Logout (sin interceptores), limpia sesión, `isAuthenticated$` false |
| 1.1.4 | `refreshToken()` exitoso | POST a Auth/Refresh (sin interceptores), nuevo token emitido |
| 1.1.5 | `refreshToken()` fallido | Error en refresh → `isAuthenticated$` false, redirección a login |
| 1.1.6 | `trySilentLogin()` | Llama a `refreshToken()` al inicio, `initialAuthCheckCompleted$` emite true |
| 1.1.7 | Estados iniciales | `isAuthenticated$` comienza como false, `initialAuthCheckCompleted$` false |
| 1.1.8 | Manejo de NgZone | `runOutsideAngular` se usa correctamente para refresh |

### 1.2 `AspRoleService` (`core/services/asp-role.service.ts`) ✅

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 1.2.1 | `roleSignal()` | Cada rol en `EApplicationRole` tiene un Signal que refleja `userToken$` |
| 1.2.2 | `hasRole(role)` | Retorna true cuando el usuario tiene el rol, false si no |
| 1.2.3 | `hasAny(roles)` | Retorna true si el usuario tiene al menos uno de los roles |
| 1.2.4 | `anyOf(roles)` | Comportamiento equivalente a hasAny con sintaxis de spread |
| 1.2.5 | `getUserRoles()` | Retorna todos los roles del usuario actual |
| 1.2.6 | Actualización reactiva | Signals se actualizan cuando `userToken$` cambia |
| 1.2.7 | Sin sesión | Todos los signals false cuando no hay usuario autenticado |

### 1.3 `CustomerIdService` (`core/services/customer-id.service.ts`) ✅

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 1.3.1 | `initializeCustomerStateAfterLogin()` | Lee de storage, fallback a token, carga datos del cliente |
| 1.3.2 | `setCustomerId(id)` | Cambia el customer activo, actualiza todos los signals derivados |
| 1.3.3 | Signals computados | `customerId`, `nombreCorto`, `customerName`, `customerPhotoPath` reflejan el estado |
| 1.3.4 | `customerDataReady` | Computado true solo cuando `isLoaded` es true |
| 1.3.5 | Persistencia | `setCustomerId` guarda en storage |

### 1.4 `SecurityService` (`core/services/security.service.ts`) ✅

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 1.4.1 | `setAuthData()` | Guarda en localStorage via StorageService |
| 1.4.2 | `getAuthData()` | Recupera de localStorage |
| 1.4.3 | `resetAuthData()` | Limpia todos los datos de autenticación |
| 1.4.4 | `getToken()` | Retorna el token JWT almacenado |

### 1.5 `StorageService` (`core/services/storage.service.ts`) ✅

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 1.5.1 | `store(key, value)` | Serializa a JSON y guarda en localStorage |
| 1.5.2 | `retrieve(key)` | Recupera y deserializa de localStorage |
| 1.5.3 | `remove(key)` | Elimina del localStorage |
| 1.5.4 | `clear()` | Limpia todo o por key específica |
| 1.5.5 | JSON inválido | `retrieve()` retorna null cuando el JSON es inválido |

### 1.6 `ConnectivityService` (`core/services/connectivity.service.ts`) ✅

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 1.6.1 | `isOnline` getter | Retorna `navigator.onLine` |
| 1.6.2 | `isOnline$` observable | Emite true/false según eventos online/offline |
| 1.6.3 | `onlineSignal` | Signal se actualiza con eventos de conectividad |
| 1.6.4 | Navegación offline | Efecto navega a `/offline` cuando se pierde conexión |
| 1.6.5 | Reconexión | Efecto navega de vuelta a la última URL cuando se recupera |

### 1.7 `ThemeService` (`core/services/theme.service.ts`) ✅

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 1.7.1 | `themeMode` signal | Inicializa desde localStorage o preferencia del sistema |
| 1.7.2 | `toggleTheme()` | Alterna entre light/dark |
| 1.7.3 | `setTheme(mode)` | Aplica el tema y persiste en localStorage |
| 1.7.4 | `isDarkMode()` | Retorna true si el tema actual es dark |
| 1.7.5 | Aplicación de clases | Agrega/remueve clases en `<html>` y `<body>` |

### 1.8 `LoaderService` (`core/services/loader.service.ts`) ✅

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 1.8.1 | Estado inicial | `loading$` signal comienza como false |
| 1.8.2 | `show()` | Pone loading$ a true |
| 1.8.3 | `hide()` | Pone loading$ a false |

### 1.9 `CustomToastService` (`core/services/custom-toast.service.ts`) ✅

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 1.9.1 | `showSuccess()` | Muestra toast de éxito (PrimeNG o Ionic según plataforma) |
| 1.9.2 | `showError()` | Muestra toast de error |
| 1.9.3 | `showInfo()` | Muestra toast informativo |
| 1.9.4 | `showWarn()` | Muestra toast de advertencia |
| 1.9.5 | Detección de plataforma | Usa Ionic en mobile, PrimeNG en desktop |

### 1.10 `JwtInterceptor` y `jwtInterceptor` (`core/services/`)

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 1.10.1 | Adjunta token | Agrega header `Authorization: Bearer <token>` a todas las requests |
| 1.10.2 | Salta refresh token | No intercepta requests a Auth/Refresh |
| 1.10.3 | 401 → refresh | En 401, llama a refreshToken y reintenta |
| 1.10.4 | Cola concurrente | Múltiples 401 simultáneos solo disparan un refresh |
| 1.10.5 | Refresh fallido | Si refresh falla, redirige a login |
| 1.10.6 | Auth check pendiente | Espera a `initialAuthCheckCompleted$` antes de adjuntar token |

### 1.11 `ApiResponseService` (`core/services/api-response.service.ts`)

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 1.11.1 | `onGetList()` | GET, respuesta exitosa, retorna lista |
| 1.11.2 | `onPost()` | POST con cuerpo, retorna respuesta |
| 1.11.3 | `onPut()` | PUT con actualización |
| 1.11.4 | `onDelete()` | DELETE |
| 1.11.5 | `onPostPaged()` | POST paginado, retorna PagedResultDTO |
| 1.11.6 | `onDownloadFile()` | Descarga de archivos (blob) |
| 1.11.7 | Errores HTTP | Manejo de errores, toast de error, global error |

### 1.12 Servicios adicionales prioritarios

| Servicio | Casos clave |
|----------|-------------|
| `SignalRService` | Conexión start/stop, `joinProposalGroup()`, eventos entrantes, auto-reconnect |
| `MenuService` | `sidebarMenuItems`, `triggerMenuLoad()`, `hasAccessToRoute()`, caché por customer |
| `PaginationService<T>` | `loadData()`, `handleLazyLoad()`, `applyFilter()`, estados loading/data/total |
| `DialogHandlerService` | `openDialog()` retorna Promise, configura tamaño títulos |
| `SwalService` | Wrapper de SweetAlert2, métodos success/error/fire/loading |
| `TitleService` | Signal `routeTitle` desde router data, efecto actualiza document.title |
| `SearchService` | `searchTerm()` filtra menú, expone `searchResult` y `menuItems` |

---

## 2. Guards (P1) ✅

### 2.1 `auth.guard.ts` ✅

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 2.1.1 | Usuario autenticado | `isAuthenticated$` true → retorna true |
| 2.1.2 | Usuario no autenticado | `isAuthenticated$` false → redirige a `/auth/login?returnUrl=...` |
| 2.1.3 | Ruta pública | Rutas públicas bypassan la verificación |
| 2.1.4 | Offline | `ConnectivityService.isOnline` false → retorna false |
| 2.1.5 | Auth check en progreso | Espera a `initialAuthCheckCompleted$` |

### 2.2 `employee.guard.ts` ✅

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 2.2.1 | Rol Employee | Retorna true |
| 2.2.2 | Rol Comite | Redirige a `/committee` |
| 2.2.3 | Rol Direccion | Redirige a `/direccion` |
| 2.2.4 | No autenticado | Redirige a login |
| 2.2.5 | Auth check pendiente | Espera a `initialAuthCheckCompleted$` |

### 2.3 `committee.guard.ts` ✅

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 2.3.1 | Rol Comite | Retorna true |
| 2.3.2 | Otro rol | Redirige a `/auth/login` |
| 2.3.3 | No autenticado | Redirige a login |

### 2.4 `direccion.guard.ts` ✅

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 2.4.1 | Rol Direccion | Retorna true |
| 2.4.2 | Otro rol | Redirige a `/unauthorized` |
| 2.4.3 | No autenticado | Redirige a `/unauthorized` |

### 2.5 `role-redirect.guard.ts` ✅

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 2.5.1 | Rol Comite | Redirige a `/committee`, retorna false |
| 2.5.2 | Rol Direccion | Redirige a `/direccion`, retorna false |
| 2.5.3 | Rol Employee | Redirige a `/dashboard`, retorna false |
| 2.5.4 | Síncrono | Verificar que no depende de observables asíncronos |

### 2.6 `super-user.guard.ts` ✅

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 2.6.1 | SuperUsuario | Retorna true |
| 2.6.2 | Legal | Retorna true |
| 2.6.3 | RecursosHumanos | Retorna true |
| 2.6.4 | Reclutamiento | Retorna true |
| 2.6.5 | Otros roles | Redirige a `/unauthorized`, retorna false |

---

## 3. Pipes (P2) ✅

(12 pipes implementados — `CapitalizadoPipe`, `CurrencyMexicoPipe`, `EBoolTextPipe`, `PhoneFormatPipe`, `CelularNumberPipe`, `FilesizePipe`, `StripTagsPipe`, `SanitizeHtmlPipe`, `HighlightPipe`, `InitialsAbbrPipe`, `ETipoGastoPipe`, `EAreaMinutasDetallesPipe`)

## 4. Directivas (P3) ✅

### 4.1 `ClickOutsideDirective` ✅
### 4.2 `PasswordValidationDirective` ✅
### 4.3 `AutosizeDirective` ✅

## 5. Componentes Core (P4)

### 5.1 `AppIcon` ✅
### 5.2 `Loader` ✅
### 5.3 `TapToTop` ✅
### 5.4 `StatusBadge` ✅
### 5.5 `GlobalErrorAlert` ✅
### 5.6 `PrimeNgCustomToast` ✅
### 5.7 `ActionIconsGroup` ✅
### 5.8 `ActionMenu` ✅
### 5.9 `PrimeNgCustomGlobalFilter` ✅
### 5.10 `Touchspin` ✅
### 5.11 `HeaderCustomer` ✅
### 5.12 `PageTitleReport` ✅
### 5.13 `ReportHeader` ✅
### 5.14 `PrimeNgCustomCaption` ✅
### 5.15 Botones web/mobile ✅ (12 web + 11 mobile = 23 completados)
### 5.16 Inputs web/mobile ✅ (28 web + 14 mobile + 3 base = 45 completados)
### 5.17 Charts ✅ (5 componentes completados)
### 5.18 Calendarios, Mesanio, PdfViewerModal, etc. ✅

### 5.1 `AppIcon`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.1.1 | Icon válido | `icon="mdi:home"` → renderiza `<iconify-icon icon="mdi:home">` |
| 5.1.2 | Icon null | `icon=null` → no renderiza nada |
| 5.1.3 | Icon vacío | `icon=""` → no renderiza nada |
| 5.1.4 | Resolución correcta | Pasa por `resolveIconifyIcon()` |

### 5.2 `Loader`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.2.1 | Loading true | `LoaderService.loading$` true → overlay visible |
| 5.2.2 | Loading false | `LoaderService.loading$` false → overlay oculto |
| 5.2.3 | Vista mobile | Clases CSS condicionales según plataforma |

### 5.3 `TapToTop`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.3.1 | Scroll > 600px | Botón visible |
| 5.3.2 | Scroll <= 600px | Botón oculto |
| 5.3.3 | Click | `ViewportScroller.scrollToPosition([0,0])` llamado |
| 5.3.4 | Cleanup | Remueve scroll listener en destroy |

### 5.4 `StatusBadge`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.4.1 | Status danger | `status` mapeado → badge con clase danger |
| 5.4.2 | Status success | `status` mapeado → badge con clase success |
| 5.4.3 | Status warning | `status` mapeado → badge con clase warning |
| 5.4.4 | Status neutral | `status` mapeado → badge con clase neutral |
| 5.4.5 | Click en badge | `statusClick.emit()` con `StatusClickEvent` |
| 5.4.6 | clickable=false | Click no emite evento |
| 5.4.7 | Tooltip | `tooltip` input se muestra como tooltip |

### 5.5 `GlobalErrorAlert`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.5.1 | Error presente | `GlobalErrorService` tiene error → alerta visible |
| 5.5.2 | Sin error | No hay error → alerta oculta |
| 5.5.3 | Cerrar error | Click en cerrar → llama a `clearError()` |

### 5.6 `PrimeNgCustomToast`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.6.1 | Renderiza p-toast | Componente `<p-toast>` presente con configuraciones correctas |

### 5.7 Componentes de botones web (`buttons/web`)

Cada botón (`CustomButton`, `CustomButtonAdd`, `CustomButtonEdit`, `CustomButtonDelete`, etc.)

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.7.1 | Label | Muestra el texto del label |
| 5.7.2 | Icon | Muestra el icono configurado |
| 5.7.3 | Disabled | `disabled` input → botón deshabilitado |
| 5.7.4 | Click | `(click)` emite evento |
| 5.7.5 | Severity/styles | Aplica clases de estilo correctas (p-button-*, etc.) |
| 5.7.6 | Loading state | Muestra spinner cuando loading=true |

### 5.8 Componentes de botones mobile (`buttons/mobile`)

Similar a los web pero con componentes Ionic (`<ion-button>`).

### 5.9 Componentes de inputs web (`inputs/web`)

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.9.1 | `CustomInputTextSignal` | Muestra input text, actualiza signal, muestra errores de validación |
| 5.9.2 | `CustomInputPasswordSignal` | Muestra input password con toggle de visibilidad |
| 5.9.3 | `CustomInputNumberSignal` | Muestra input numérico con formato |
| 5.9.4 | `CustomInputSelectSignal` | Muestra select con opciones, muestra placeholder |
| 5.9.5 | Validación | Muestra mensajes de error del formulario |
| 5.9.6 | Disabled | Input deshabilitado cuando `disabled=true` |

### 5.10 Componentes de inputs mobile (`inputs/mobile`)

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.10.1 | `IonInputText` | `<ion-input type="text">` con binding correcto |
| 5.10.2 | `IonInputPassword` | `<ion-input type="password">` con toggle |
| 5.10.3 | `IonInputSelect` | `<ion-select>` con opciones |

### 5.11 `ActionIconsGroup`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.11.1 | Renderiza iconos | Grupo de iconos de acción visibles |
| 5.11.2 | Click en icono | Emite evento correspondiente |

### 5.12 `ActionMenu`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.12.1 | Menú contextual | Opciones de menú visibles al hacer click |
| 5.12.2 | Acción seleccionada | Emite evento con la acción seleccionada |

### 5.13 Componentes de charts (`charts/`)

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.13.1 | `PieChart` | Renderiza gráfico de pastel con datos de entrada |
| 5.13.2 | `CustomBarChart` | Renderiza gráfico de barras |
| 5.13.3 | `MultiAxisChart` | Renderiza gráfico multi-eje |
| 5.13.4 | `AdvancedPieChart` | Renderiza gráfico de pastel avanzado |
| 5.13.5 | `PrimeNgRadarChart` | Renderiza gráfico radial |
| 5.13.6 | Datos vacíos | Maneja arrays vacíos sin errores |
| 5.13.7 | Datos nulos | Maneja null/undefined en inputs |

### 5.14 `HeaderCustomer`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.14.1 | Muestra datos | Renderiza información del cliente |
| 5.14.2 | Datos vacíos | Maneja cliente sin datos |

### 5.15 Componentes de calendario

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.15.1 | `RangoCalendarioMesAnio` | Selector de rango mes/año, emite fechas seleccionadas |
| 5.15.2 | `RangoCalendarioYyyymmdd` | Selector de rango fechas yyyy-mm-dd |

### 5.16 `Touchspin`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.16.1 | Incremento | Click + incrementa valor |
| 5.16.2 | Decremento | Click - decrementa valor |
| 5.16.3 | Límite mínimo | No decrementa por debajo del mínimo |
| 5.16.4 | Límite máximo | No incrementa por encima del máximo |
| 5.16.5 | Emite cambio | Emite nuevo valor al cambiar |

### 5.17 `TitlePageReport`, `TitlePageReportMaintenance`, `TitleSolicitudPagoPdf`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.17.1 | Renderiza título | Muestra el título del reporte |
| 5.17.2 | Inputs | Acepta inputs de configuración |

### 5.18 `ReportHeader`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.18.1 | Header de reporte | Renderiza encabezado con datos del reporte |

### 5.19 `DataViewMobile`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.19.1 | Lista de items | Renderiza lista de items en vista mobile |
| 5.19.2 | Items vacíos | Muestra empty state |
| 5.19.3 | Loading | Muestra skeleton o spinner mientras carga |

### 5.20 `PdfViewerModal`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.20.1 | Modal abierto | Visibilidad controlada por input |
| 5.20.2 | PDF source | Carga y muestra el PDF |
| 5.20.3 | Cerrar modal | Emite evento al cerrar |

### 5.21 `Mesanio`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.21.1 | Selector mes/año | Navegación entre meses, selección de año |

### 5.22 `PrimeNgCustomCaption`, `PrimeNgCustomGlobalFilter`, `PrimeNgCustomTableFooter`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.22.1 | Caption personalizado | Renderiza caption de tabla PrimeNG |
| 5.22.2 | Global filter | Input de filtro global para tabla PrimeNG |
| 5.22.3 | Footer personalizado | Renderiza footer de tabla con totales |

### 5.23 `BaseIonicButton` y `BaseButton`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 5.23.1 | Clases base | Verificar que las clases base se aplican correctamente |
| 5.23.2 | Inputs comunes | disabled, loading, icon, label, severity |

---

## 6. Componentes de Login (P5)

### 6.1 `LoginComponent`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 6.1.1 | Formulario renderizado | Campos username, password, rememberMe visibles |
| 6.1.2 | Validación | Form inválido → submit deshabilitado |
| 6.1.3 | Submit exitoso | `authS.login()` → `customerIdS.initializeCustomerStateAfterLogin()` → redirección |
| 6.1.4 | Submit fallido | Error en login → mensaje de error visible |
| 6.1.5 | Remember me | Guarda/carga credenciales de localStorage |
| 6.1.6 | Show password | Toggle visibilidad de contraseña |
| 6.1.7 | Loading state | `loading` signal controla estado del botón |
| 6.1.8 | Redirección post-login | Navega a returnUrl o dashboard según rol |
| 6.1.9 | Vista responsive | Layout cambia entre mobile y desktop |
| 6.1.10 | Slider de fondo | `LoginSliderService` provee imágenes para el background |

### 6.2 `RecoverPassword`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 6.2.1 | Formulario email | Campo email con validación |
| 6.2.2 | Submit exitoso | POST a Auth/RecoverPassword, muestra Swal success, inicia countdown |
| 6.2.3 | Submit fallido | Error → mensaje de error |
| 6.2.4 | Countdown | Botón deshabilitado durante 30s después de envío exitoso |
| 6.2.5 | Loading state | `submitting` signal controla estado |

### 6.3 `RecoveryWrapper`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 6.3.1 | Desktop | Muestra `RecoverPassword` (web) |
| 6.3.2 | Mobile | Muestra `RecoveryMobile` (Ionic) |

### 6.4 `ResetPassword`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 6.4.1 | Formulario | Campos newPassword + confirmPassword con validador match |
| 6.4.2 | Passwords no coinciden | Error de validación |
| 6.4.3 | Submit exitoso | POST a Auth/ConfirmRecoverPassword, redirige a login |
| 6.4.4 | Submit fallido | Error → mensaje de error |
| 6.4.5 | Token y email | Lee query params token y email de la ruta |

---

## 7. Componentes de Layout (P6)

### 7.1 `LayoutEmployee`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 7.1.1 | Vista mobile | `isMobileView` true → renderiza `ViewEmployeeMobile` |
| 7.1.2 | Vista desktop | `isMobileView` false → renderiza `ViewEmployeeMonitor` |
| 7.1.3 | Inicializa SignalR | `ngOnInit()` llama a `signalR.start()` |
| 7.1.4 | Inicializa OneSignal | `ngOnInit()` llama a `oneSignal.initializeAndLoginUser()` |

### 7.2 `ViewEmployeeMonitor`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 7.2.1 | Estructura | Header + Sidebar + Router Outlet + Loader |
| 7.2.2 | Footer dinámico | Tipo de footer según URL |
| 7.2.3 | AfterViewInit | `ChangeDetectorRef.detectChanges()` llamado |

### 7.3 `Sidebar`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 7.3.1 | Menú recursivo | Renderiza árbol de menú desde `MenuService.sidebarMenuItems` |
| 7.3.2 | Búsqueda | `searchTerm()` filtra items del menú |
| 7.3.3 | Resultados vacíos | Mensaje "sin resultados" cuando no hay match |
| 7.3.4 | Item activo | `setActiveOnNavigation()` expande rama activa |
| 7.3.5 | Customer info | Muestra nombre corto del customer |
| 7.3.6 | User info | Muestra avatar + nombre de usuario |
| 7.3.7 | Toggle sidebar | `sidebarToggle()` colapsa/expande |
| 7.3.8 | Loading state | Spinner mientras menú carga |
| 7.3.9 | Transformación | IMenuItem[] → MenuItem[] correcta |

### 7.4 `HeaderEmployeeMonitor`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 7.4.1 | Breadcrumb | Renderiza breadcrumb desde datos de ruta |
| 7.4.2 | Selector customer | `<p-select>` con lista de customers, cambio emite `selectCustomer()` |
| 7.4.3 | Iconos de navegación | Home, back, next, refresh visibles según rol |
| 7.4.4 | Theme toggle | `toggleTheme()` alterna tema |
| 7.4.5 | Notificaciones | `NotificationsGadget` visible |
| 7.4.6 | Perfil | `ProfileMonitor` visible |
| 7.4.7 | Input `isCommitteeView` | Cambia comportamiento según vista comité |
| 7.4.8 | PWA update | Botón de actualización cuando hay nueva versión |

### 7.5 `ProfileMonitor`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 7.5.1 | Avatar | Muestra avatar del usuario |
| 7.5.2 | Popover | Menú desplegable con opciones de perfil |
| 7.5.3 | Logout | `logOut()` → `authS.logout()` + redirección |
| 7.5.4 | PWA update | `onUpdateClick()` actualiza PWA |
| 7.5.5 | Profile route | Navegación a perfil de usuario |

### 7.6 `NotificationsGadget`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 7.6.1 | Badge de no leídas | Muestra contador de notificaciones no leídas |
| 7.6.2 | Sin notificaciones | Badge oculto cuando `messageInNotRead` es 0 |
| 7.6.3 | Popover | Lista de notificaciones al hacer click |
| 7.6.4 | Mark as read | Click → API call + navegación |
| 7.6.5 | SignalR updates | Escucha eventos de SignalR para nuevas notificaciones |

### 7.7 `NotificationsListWeb`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 7.7.1 | Lista completa | Renderiza todas las notificaciones |
| 7.7.2 | Navegación | Click en notificación navega a ruta correspondiente |
| 7.7.3 | Loading state | Mientras carga datos |

### 7.8 `FooterMonitor`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 7.8.1 | Copyright | Muestra año actual y texto de copyright |

### 7.9 `ViewEmployeeMobile`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 7.9.1 | Estructura Ionic | `<ion-app>` con menu + header + content + footer |
| 7.9.2 | Menú lateral | `<app-home-menu-mobile />` dentro de `<ion-menu>` |
| 7.9.3 | Close menu | `closeMenu()` cierra menu Ionic |

### 7.10 Componentes de Layout Dirección

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 7.10.1 | `ViewDireccionMonitor` | Estructura header + router outlet anidado |
| 7.10.2 | `ViewDireccionMobile` | Estructura Ionic |
| 7.10.3 | `HeaderDireccionMonitor` | Breadcrumb + navegación específica de dirección |

### 7.11 Cards de Dirección

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 7.11.1 | `AgendaSemanalCard` | Renderiza agenda semanal, datos desde servicio |
| 7.11.2 | `AgendaMesesModal` | Modal con vista de meses |
| 7.11.3 | `ContratosCard` | Lista de contratos vigentes |
| 7.11.4 | `ContratosVigentesModal` | Modal con detalle de contratos |
| 7.11.5 | `PersonalAusenteCard` | Personal ausente con estados |
| 7.11.6 | `ReclutamientoCard` | Solicitudes de reclutamiento activas |
| 7.11.7 | `TareasLegalCard` | Tareas legales pendientes |

### 7.12 Componentes de Layout Comité

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 7.12.1 | `HeaderCommitteeMonitor` | Header específico de comité |
| 7.12.2 | `FooterCommitteeMonitor` | Footer específico de comité |
| 7.12.3 | `ProfileCommitteeMonitor` | Perfil en vista comité |
| 7.12.4 | `CustomerHeaderDataCommittee` | Datos del cliente en vista comité |

### 7.13 Componentes Layout Compartidos

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 7.13.1 | `HeaderCommitteeMobile` (HeaderMobile) | Header Ionic con menú hamburguesa y título |
| 7.13.2 | `ProfileUserMobile` | Perfil de usuario en vista mobile |
| 7.13.3 | `CustomerHeaderDataMobile` | Datos del cliente en vista mobile |

---

## 8. Componentes Compartidos (P7)

### 8.1 `AiChatWidget`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 8.1.1 | Botón flotante | Botón visible en esquina inferior derecha |
| 8.1.2 | Toggle chat | Click abre/cierra ventana de chat |
| 8.1.3 | Chat coming soon | Muestra estado "Coming Soon" |
| 8.1.4 | Send message | `sendMessage()` → `AiChatService.sendMessage()` |
| 8.1.5 | Auto-scroll | Scroll al último mensaje automáticamente |
| 8.1.6 | Select session | `selectSession()` cambia sesión activa |

### 8.2 `ImageAnalysisDialogComponent`

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| 8.2.1 | `show()` | Abre el diálogo |
| 8.2.2 | `reset()` | Limpia el estado del diálogo |
| 8.2.3 | File upload | Selecciona archivo, muestra preview |
| 8.2.4 | `analyze()` | Llama a `TicketAnalysisService`, muestra progreso |
| 8.2.5 | `useResult()` | Emite `resultAccepted` con el texto analizado |
| 8.2.6 | Loading state | Barra de progreso durante análisis |
| 8.2.7 | Copy result | Copia resultado al portapapeles |

---

## 9. Componentes de Features (Ejemplos Representativos)

Por la gran cantidad de features (84), se priorizarán los más críticos:

| Prioridad | Feature | Casos clave |
|-----------|---------|-------------|
| **Alta** | `dashboard/` | Gráficos, cards de resumen, datos en tiempo real |
| **Alta** | `employees/` | CRUD de empleados, filtros, tabla |
| **Alta** | `property/` | Gestión de propiedades, mapa, detalle |
| **Alta** | `provider/` | CRUD de proveedores |
| **Alta** | `product/` | Catálogo de productos |
| **Media** | `recurring-tasks/` | Tareas recurrentes con calendario |
| **Media** | `reports/` | Generación de reportes |
| **Media** | `calendar/` | Google Calendar integration |
| **Media** | `tasks/` | Gestión de tareas |
| **Media** | `supervision/` | Reportes de supervisión |
| **Baja** | Resto de features | Pruebas básicas de renderizado |

Para cada feature component, probar:

| # | Caso de prueba | Descripción |
|---|----------------|-------------|
| F.1 | Renderizado básico | Componente se renderiza sin errores |
| F.2 | Datos vacíos | Maneja lista vacía o null |
| F.3 | Loading state | Muestra indicador de carga |
| F.4 | Error state | Muestra mensaje de error cuando API falla |
| F.5 | Navegación | Botones/links navegan a rutas correctas |
| F.6 | CRUD operations | Crear, leer, actualizar, eliminar |
| F.7 | Filtros/búsqueda | Filtros actualizan la lista |
| F.8 | Paginación | Carga de página siguiente/anterior |
| F.9 | Formularios | Validación, submit, errores |
| F.10 | Permisos | UI se adapta según rol del usuario |

---

## 10. Estrategia de Mocks

### 10.1 Servicios globales (provedIn: 'root')

```typescript
// Mock de AuthService
const authServiceMock = {
  userToken$: of(null),
  isAuthenticated$: of(false),
  initialAuthCheckCompleted$: of(true),
  login: jasmine.createSpy('login').and.returnValue(of({})),
  logout: jasmine.createSpy('logout'),
  refreshToken: jasmine.createSpy('refreshToken'),
  currentUserSession: signal(null),
};

// Mock de AspRoleService
const aspRoleServiceMock = {
  roleSignal: () => signal(false),
  hasRole: jasmine.createSpy('hasRole').and.returnValue(false),
  hasAny: jasmine.createSpy('hasAny').and.returnValue(false),
  getUserRoles: jasmine.createSpy('getUserRoles').and.returnValue([]),
  roleSignal: jasmine.createSpy('roleSignal').and.returnValue(signal(false)),
};

// Mock de CustomerIdService
const customerIdServiceMock = {
  customerId: signal(0),
  nombreCorto: signal(''),
  customerName: signal(''),
  customerPhotoPath: signal(''),
  customerDataReady: signal(false),
  setCustomerId: jasmine.createSpy('setCustomerId'),
  initializeCustomerStateAfterLogin: jasmine.createSpy('initializeCustomerStateAfterLogin'),
};
```

### 10.2 HttpClient

```typescript
// Usar HttpClientTestingModule + HttpTestingController
import { provideHttpClientTesting } from '@angular/common/http/testing';

TestBed.configureTestingModule({
  providers: [
    provideHttpClientTesting(),
    // servicio bajo prueba
  ]
});
```

### 10.3 PrimeNG Dialog/Toast

```typescript
// Mock de DialogService
const dialogServiceMock = {
  open: jasmine.createSpy('open').and.returnValue({
    onClose: of({})
  })
};

// Mock de MessageService
const messageServiceMock = {
  add: jasmine.createSpy('add'),
  clear: jasmine.createSpy('clear'),
};
```

### 10.4 Router y ActivatedRoute

```typescript
// Mock de Router
const routerMock = {
  navigate: jasmine.createSpy('navigate'),
  url: '/test',
  events: of(new NavigationEnd(1, '/test', '/test')),
  createUrlTree: jasmine.createSpy('createUrlTree'),
  serializeUrl: jasmine.createSpy('serializeUrl'),
};

// Mock de ActivatedRoute
const activatedRouteMock = {
  snapshot: { data: { title: 'Test' }, params: {}, queryParams: {} },
  data: of({ title: 'Test' }),
  params: of({}),
  queryParams: of({}),
};
```

### 10.5 SignalR

```typescript
const signalRServiceMock = {
  connectionState: signal('Disconnected'),
  connectionId: signal(''),
  connectedUser: signal(0),
  messageReceived$: of(null),
  budgetProposalItemUpdate$: of(null),
  projectedExpenseUpdate$: of(null),
  googleCalendarEventUpdate$: of(null),
  start: jasmine.createSpy('start').and.returnValue(Promise.resolve()),
  stop: jasmine.createSpy('stop'),
  joinProposalGroup: jasmine.createSpy('joinProposalGroup'),
  leaveProposalGroup: jasmine.createSpy('leaveProposalGroup'),
};
```

### 10.6 Plataforma (Ionic)

```typescript
// Mock de Platform
const platformMock = {
  is: jasmine.createSpy('is').and.returnValue(false),
  ready: jasmine.createSpy('ready').and.returnValue(Promise.resolve()),
};
```

---

## 11. Configuración de TestBed

### 11.1 Para servicios con signals

```typescript
TestBed.configureTestingModule({
  providers: [
    AuthService,
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(),
    { provide: StorageService, useValue: storageServiceMock },
    { provide: ConsoleLogger, useValue: consoleLoggerMock },
    // otros mocks...
  ],
});
```

### 11.2 Para componentes standalone con signals

```typescript
TestBed.configureTestingModule({
  imports: [ComponenteBajoPrueba],
  providers: [
    provideHttpClientTesting(),
    { provide: AuthService, useValue: authServiceMock },
    // mocks de dependencias...
  ],
});

const fixture = TestBed.createComponent(ComponenteBajoPrueba);
const component = fixture.componentInstance;
fixture.detectChanges();
```

### 11.3 Para componentes con ChangeDetection OnPush

```typescript
// Después de cambiar signals, usar:
fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();
// o
fixture.detectChanges();
// o marcar para check manualmente
```

---

## 12. Herramientas y Setup

### 12.1 Configuración existente

- **Framework:** Vitest v4.0.18 (vía `vitest.config.ts`)
- `test-setup.ts` ya configurado con polyfills (Worker para `heic2any`)
- `angular.json` tiene configuración de Karma (obsoleta, no usar)
- `vitest.config.ts` incluye `server.deps.inline` para `ng2-pdf-viewer`
- Tests existentes: 280 spec files (~1585 tests)

### 12.2 Comandos

```bash
npx vitest run                          # Una sola ejecución
npx vitest run --reporter verbose       # Con detalle por test
npx vitest run <path/to/file>           # Archivo específico
npx vitest --ui                         # UI interactiva (si está configurado)
```

### 12.3 Patrones recomendados

- **Arrange-Act-Assert** para estructura de tests
- **describe/it** anidado para organización
- **beforeEach** para configuración recurrente
- **SpyOn** para métodos de servicios
- **fakeAsync/tick** para código asíncrono
- **jasmine.createSpyObj** para mocks con múltiples métodos

---

## 13. Métricas de Cobertura Objetivo

| Tipo | Cobertura Mínima |
|------|------------------|
| Statements | 80% |
| Branches | 75% |
| Functions | 80% |
| Lines | 80% |

### Prioridad de archivos para cobertura

1. **Servicios críticos** (`auth.service.ts`, `asp-role.service.ts`, `customer-id.service.ts`, `security.service.ts`, `storage.service.ts`) → 90%+
2. **Guards** → 90%+
3. **Pipes** → 95%+
4. **Directivas** → 85%+
5. **Core components** → 80%+
6. **Layout components** → 70%+
7. **Login components** → 80%+
8. **Shared components** → 70%+
9. **Feature components** → 60%+

---

## 14. Resumen Ejecutivo

### Tests existentes (445 files, ~1883 tests)

| Categoría | Specs | Prioridad | Framework | Estado |
|-----------|-------|-----------|-----------|--------|
| Servicios core | 10 | P0 | Vitest | ✅ Funcional |
| Guards | 6 | P1 | Vitest | ✅ Funcional |
| Pipes | 12 | P2 | Vitest | ✅ Funcional |
| Directivas | 3 | P3 | Vitest | ✅ Funcional |
| Core components | ~170 | P4 | Vitest | ✅ Funcional |
| Login components | 4 | P5 | Vitest | ✅ Funcional |
| Layout components | 26 | P6 | Vitest | ✅ Funcional |
| Shared components | 2 | P7 | Vitest | ✅ Funcional |
| Feature components (tenant/) | 113 | P8 | Vitest | ✅ Funcional (en tenant/) |
| Feature components (configuration, vault) | 99 | P8 | Vitest | ✅ Funcional |
| **Total** | **445** | | | **~1883 tests — 0 fallos** |

### Migración pendiente: features/tenant/ → features/

Cuando un feature sea migrado de `features/tenant/` a `features/`, sus spec files deben migrarse junto con los fuentes, actualizando imports de `features/tenant/` → `features/`.

| Feature | Specs | Depende de migración de fuentes |
|---------|-------|-------------------------------|
| `configuration/` | 97 | ✅ Migrado (specs en features/) |
| `vault/` | 2 | ✅ Migrado (specs en features/) |
| `tasks/` | 28 | ⬜ Pendiente |
| `supervision/` | 14 | ⬜ Pendiente |
| `employees/` | 13 | ⬜ Pendiente |
| `calendar/` | 9 | ⬜ Pendiente |
| `reports/` | 8 | ⬜ Pendiente |
| `recurring-tasks/` | 8 | ⬜ Pendiente |
| `dashboard/` | 4 | ⬜ Pendiente |
| `funding/` | 4 | ⬜ Pendiente |
| `google-calendar/` | 3 | ⬜ Pendiente |
| `property/` | 3 | ⬜ Pendiente |
| `provider/` | 5 | ⬜ Pendiente |
| `product/` | 3 | ⬜ Pendiente |
| `contabilidad/` | 1 | ⬜ Pendiente |

### Fases de implementación

| Fase | Alcance | Estado |
|------|---------|--------|
| **Fase 1** | P0 (servicios críticos) + P1 (guards) | ✅ Completado en core/ |
| **Fase 2** | P2 (pipes) + P3 (directivas) + P4 (core components) | ✅ Completado en core/ |
| **Fase 3** | P5 (login) + P6 (layout) + P7 (shared) | ✅ Completado |
| **Fase 4** | P8 (features: tasks, supervision, employees, dashboard, etc.) | ✅ Specs existen en tenant/ |
| **Fase 5** | P8 (features migrados: configuration, vault) | ✅ Completado (99 specs en features/) |
| **Migración** | Mover specs de tenant/ → features/ junto con fuentes | ⬜ Pendiente de migración de features |

---

## 15. Notas Técnicas

### 15.1 Reglas vinculantes desde `GEMINI.md`

El proyecto sigue una constitución técnica (`GEMINI.md` en la raíz del repositorio) que impone reglas obligatorias para todas las implementaciones, incluyendo pruebas:

| Regla | Impacto en tests |
|-------|------------------|
| **Solo Signals, prohibido `@Input()`/`@Output()`** | Los componentes usan `input()`, `output()`, `signal()`, `computed()`, `effect()`. Prohibido usar `component.input` como propiedad decorada. Los tests deben acceder via `fixture.componentRef.setInput()` o signals. |
| **Iconify vía `<app-icon [icon]="'...'">`** | `app-icon` resuelve automáticamente `pi-*` y emojis a MDI. En tests, mockear como componente standalone o como `iconify-icon` web component. |
| **`FormHelper.submitCrud()` obligatorio en formularios** | Todo submit de formulario debe pasar por este helper. Mockearlo en tests de componentes de formulario. |
| **`HtmlPrintService` + `window.print()` para PDFs/reportes** | Prohibido usar `pdfmake`, `html2pdf.js`, `html2canvas`, `jspdf`. Tests deben mockear `window.print()` y verificar que se llama `buildStandardHeader`/`buildStandardFooter`. |
| **Componentes `custom-input-*-signal`** | Inputs del proyecto (`custom-input-text-signal`, `custom-input-password-signal`, `custom-input-number-signal`, `custom-input-select-signal`, `custom-input-check-signal`, `custom-input-date-signal`, `custom-input-hour-signal`, `custom-input-date-time-signal`). En tests de formularios, mockear estos componentes o importarlos reales. |
| **UTF-8 sin BOM, español, sin emojis** | Todos los archivos de test en UTF-8, nombres y descripciones en español, sin emojis ni caracteres especiales no estándar. |
| **IDs como Guid** | Los datos de prueba deben usar Guids, nunca ints. |
| **Manejo de fechas por semántica** | Al probar componentes con fechas, respetar la semántica: `DateOnly` → `custom-input-date-signal`, `TimeSpan` → `custom-input-hour-signal`, `DateTime` → `custom-input-date-time-signal`. |

### 15.2 Desafíos conocidos

1. **Signals + ChangeDetection OnPush**: Los componentes con `OnPush` requieren detectChanges manual después de cambiar signals. Usar `fixture.componentRef.setInput()` para inputs signal.
2. **Servicios con lazy injection** (`Injector`): Servicios como `AuthService` que inyectan lazy via `Injector` requieren configuración especial en mocks.
3. **Ionic components**: Los componentes que usan `<ion-*>` requieren `TestBed.configureTestingModule` con imports de Ionic standalone o mocks de componentes Ionic.
4. **Iconify (`<iconify-icon>`)**: Es un web component registrado globalmente. En tests de componentes que usan `<app-icon>`, mockear `AppIcon` o usar `CUSTOM_ELEMENTS_SCHEMA`.
5. **`window.print()`**: `PrintableDirective` y `HtmlPrintService` necesitan mock de `window.print`.
6. **OneSignal**: SDK externo requiere mock completo.
7. **Señales computadas con efectos**: Los `effect()` se ejecutan asíncronamente, usar `TestBed.flushEffects()` o `fakeAsync`.
8. **Interceptor con cola de requests**: La lógica de cola de 401s requiere escenarios de timing específicos.
9. **`FormHelper.submitCrud()`**: Es un helper global. Mockear como spy o reemplazo en `TestBed`.
10. **Componentes `custom-input-*-signal` con validación**: Los custom inputs incluyen lógica de validación (`validation-errors-custom-input.ts`). En tests unitarios de páginas, considerar mockearlos para aislar la lógica de la página de la validación del input.

### 15.3 Recomendaciones

- **Usar `TestBed.inject()`** para obtener señales y verificarlas.
- **Mock de ConsoleLogger**: Proveer un mock silencioso para evitar ruido en consola.
- **Compartir mocks**: Crear archivos `*.mock.ts` junto a cada servicio para reutilizar en múltiples tests. Incluir mocks de los servicios core (`auth.service.mock.ts`, `asp-role.service.mock.ts`, `customer-id.service.mock.ts`).
- **Test de integración**: Para servicios complejos como `AuthService`, considerar tests de integración con `HttpTestingController`.
- **Snapshot testing**: Considerar para componentes de UI pura (pipes, badges, etc.).
- **Mock de `<app-icon>`**: Crear un componente mock simple que renderice un span con el nombre del icono para verificar que se pasó el icono correcto.
- **Mock de `FormHelper`**: Proveer un objeto con `submitCrud: jasmine.createSpy('submitCrud').and.returnValue(of({}))`.
- **Mock de `HtmlPrintService`**: `jasmine.createSpyObj('HtmlPrintService', ['print', 'buildStandardHeader', 'buildStandardFooter'])`.
