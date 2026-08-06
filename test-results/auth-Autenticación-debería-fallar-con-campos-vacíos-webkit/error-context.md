# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Autenticación >> debería fallar con campos vacíos
- Location: e2e\specs\auth.spec.ts:31:7

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Saltar al contenido principal" [ref=e2]:
    - /url: "#app-root-outlet"
  - generic "Aplicación LuxuryApp" [ref=e3]:
    - generic:
      - alertdialog
    - main [ref=e4]:
      - generic [ref=e8]:
        - img "Slider Background" [ref=e10]
        - generic [ref=e12]:
          - generic [ref=e13]:
            - generic [ref=e15]:
              - generic [ref=e16]:
                - img "Logo Luxury Building Group" [ref=e17]
                - heading "Bienvenido de nuevo" [level=2] [ref=e18]
                - paragraph [ref=e19]: Inicia sesión
              - generic [ref=e20]:
                - generic [ref=e25]:
                  - generic [ref=e26]: Usuario *
                  - 'textbox "Ej: jperez" [ref=e28]'
                - generic [ref=e33]:
                  - generic [ref=e34]: Contraseña *
                  - textbox "••••••••" [ref=e37]
                - generic [ref=e40]:
                  - generic [ref=e47]:
                    - checkbox [checked] [ref=e49] [cursor=pointer]
                    - generic [ref=e54] [cursor=pointer]: Recordarme
                  - link "¿Olvidaste tu contraseña?" [ref=e55]:
                    - /url: /auth/recovery-password
                - generic [ref=e57]:
                  - button "INICIAR SESIÓN" [disabled]
            - generic [ref=e58]: © 2026 Luxury Building Group. Todos los derechos reservados.
          - generic [ref=e60]:
            - heading "Excelencia Inmobiliaria" [level=1] [ref=e66]
            - paragraph [ref=e67]: Gestiona recursos, proyectos y operaciones.
```