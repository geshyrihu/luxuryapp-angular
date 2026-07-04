src/
├── app/
│ ├── core/ # 🧠 LÓGICA COMPARTIDA (Núcleo)
│ │ ├── services/ # Servicios de API, lógica de negocio pura
│ │ ├── state/ # Estado global (NgRx, Akita, o Signals)
│ │ ├── guards/ # Guards de autenticación/roles
│ │ └── interceptors/ # Interceptores HTTP
│ │
│ ├── shared/ # 🧩 CATÁLOGO DE COMPONENTES REUTILIZABLES
│ │ ├── models/ # Interfaces, DTOs, Tipos (Compartidos)
│ │ ├── utils/ # Pipes, Directivas, Funciones helper
│ │ └── ui/ # 🎨 COMPONENTES DE PRESENTACIÓN (Aislados)
│ │ ├── web/ # 🖥️ Componentes envoltorios de PrimeNG
│ │ │ ├── buttons/
│ │ │ ├── tables/
│ │ │ └── modals/
│ │ └── mobile/ # 📱 Componentes envoltorios de Ionic
│ │ ├── buttons/
│ │ ├── lists/
│ │ └── modals/
│ │
│ ├── features/ # 🚀 PÁGINAS / VISTAS (Smart Components)
│ │ ├── product-catalog/ # Ejemplo de una característica
│ │ │ ├── product-catalog.facade.ts # Lógica específica de esta vista (compartida)
│ │ │ ├── product-catalog.model.ts # Modelos específicos de esta vista
│ │ │ ├── web/ # 🖥️ Vista Web (PrimeNG)
│ │ │ │ └── product-catalog-web.component.ts
│ │ │ └── mobile/ # 📱 Vista Móvil (Ionic)
│ │ │ └── product-catalog-mobile.component.ts
│ │ │
│ │ └── user-profile/ # Otra característica...
│ │ ├── user-profile.facade.ts
│ │ ├── web/
│ │ └── mobile/
│ │
│ ├── layout/ # 🏗️ SHELLS / LAYOUTS
│ │ ├── web-shell/ # Layout PrimeNG (Sidebar, Header, Footer)
│ │ └── mobile-shell/ # Layout Ionic (ion-tabs, ion-header)
│ │
│ ├── app.routes.ts # Enrutamiento con carga perezosa (Lazy Loading)
│ └── app.component.ts
