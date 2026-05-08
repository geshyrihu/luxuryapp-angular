# Guía de Guardianes de Ruta (Route Guards) 🚦

En nuestra aplicación de Angular, los guardianes de ruta actúan como el personal de seguridad de un club exclusivo. Su trabajo es decidir si un usuario puede o no acceder a una sección (ruta) de la aplicación, basándose en una serie de reglas.

Este sistema es crucial para proteger nuestras rutas y asegurar que cada usuario solo vea las secciones que le corresponden.

---

## Nuestros Guardianes y sus Roles

Tenemos un equipo de cuatro guardianes especializados, cada uno con una misión específica. Se ejecutan en cadena para crear un sistema de seguridad por capas.

### 1. `AuthGuard` (El Portero Principal) 🚪

Es el primer filtro y el más importante. Su única pregunta es: **"¿Estás autenticado?"**.

- **Misión**: Proteger todas las rutas que no son públicas.
- **Lógica**:
  1. Espera pacientemente a que el `AuthService` termine su comprobación inicial de sesión al cargar la aplicación.
  2. Una vez completada la comprobación, verifica si el usuario tiene una sesión válida (`isAuthenticated$`).
  3. Si el usuario está autenticado, le cede el paso al siguiente guardián de la cadena.
  4. Si no, lo redirige inmediatamente a la página de `/auth/login`.

```typescript
// en app.routes.ts
canActivate: [AuthGuard, ...otrosGuardianes];
```

### 2. `roleRedirectGuard` (El Clasificador Inicial) 🧭

Este guardián solo actúa en la entrada principal de la aplicación (la ruta vacía `''`). Su trabajo es mirar el rol del usuario y enviarlo a su "página de inicio" correcta.

- **Misión**: Redirigir al usuario a su layout principal justo después de iniciar sesión o al entrar a la raíz del sitio.
- **Lógica**:
  1. Verifica el rol del usuario.
  2. Si es `Comite`, lo redirige a `/committee`.
  3. Si es cualquier otro rol, lo redirige a la primera ruta de empleado (ej. `/dashboard`).

### 3. `committeeGuard` (El Guardia de la Zona VIP) 👑

Este es el guardia personal de la sección de Comité. Es estricto y solo deja pasar a los miembros del club VIP.

- **Misión**: Proteger la ruta `/committee` y todas sus rutas hijas.
- **Lógica**:
  1. Se ejecuta después de `AuthGuard`.
  2. Al igual que `AuthGuard`, espera a que la autenticación inicial se complete para evitar decisiones prematuras.
  3. Una vez completada, obtiene la información más reciente de la sesión del usuario (`userToken$`).
  4. Revisa los roles en la sesión y si encuentra el rol `Comite`, permite el acceso.
  5. Si no encuentra el rol, redirige al usuario a `/auth/login`.

```typescript
// en app.routes.ts
{
  path: "committee",
  canActivate: [AuthGuard, committeeGuard],
  // ...
}
```

### 4. `employeeGuard` (El Guardia del Área General) 👷

Este guardián se asegura de que los miembros VIP (Comité) no se mezclen con el resto de usuarios en las áreas generales de empleados.

- **Misión**: Proteger el layout principal de los empleados.
- **Lógica**:
  1. Se ejecuta después de `AuthGuard` en las rutas de empleados.
  2. Espera a que la autenticación se complete.
  3. Obtiene la sesión del usuario y revisa sus roles.
  4. Si encuentra el rol `Comite`, asume que el usuario se ha perdido y lo redirige amablemente a su zona correcta: `/committee`.
  5. Si el usuario no es del comité, le permite el acceso.

---

## El Flujo de Ejecución: Un Ejemplo Práctico

Imagina que un usuario del **comité** recarga la página en la URL: `/committee/board-directors/meeting-minutes`.

1. **El Router se activa**: Intenta cargar la ruta `/committee`.
2. **`AuthGuard` interviene**:
   - "¿Estás en la lista?"
   - Espera a que `AuthService` verifique el token guardado.
   - `AuthService` responde: "Sí, la sesión es válida".
   - `AuthGuard` dice: "Adelante".
3. **`committeeGuard` interviene**:
   - "Ok, estás en la lista, pero ¿eres VIP?"
   - Espera a que `AuthService` termine su comprobación.
   - Obtiene la sesión del usuario y sus roles.
   - Ve el rol `Comite` y dice: "Bienvenido, pase por favor".
4. **Acceso Concedido**: El usuario permanece en la página de actas de reunión.

Este flujo asíncrono y en cadena es la clave para evitar ser redirigido al login al recargar la página.

## Estilos de Guardianes: Clases vs. Funciones

Puede que notes que `AuthGuard` es una `class`, mientras que los otros tres son `const` (funciones).

- **Guardianes de Clase**: Es el estilo tradicional de Angular. Funciona perfectamente y es muy robusto.
- **Guardianes Funcionales**: Es el estilo moderno, recomendado desde Angular 14. Es más conciso y se integra mejor con la nueva arquitectura `standalone`.

Ambos estilos son 100% compatibles y pueden convivir sin problemas, como se demuestra en nuestra aplicación.
