-- ==========================================================================
-- SCRIPT DE MIGRACIÓN DE ICONOS POR ID (Seguro)
-- ==========================================================================
-- Actualiza únicamente los registros identificados en el volcado JSON.
-- Tabla: [LuxuryBuildingGroup].[dbo].[ModuleApp]
-- ==========================================================================

BEGIN TRANSACTION;

-- 1. Reservaciones
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:calendar-plus'         WHERE Id = '019C6C02-7718-7A06-B275-1F15302E76F9';
-- 2. Tickets
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:ticket'                WHERE Id = '019C6C02-7718-7C8E-B2EC-1F81D82857CA';
-- 3. Entrega recepción
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:truck'                 WHERE Id = '019C6C02-7718-74EE-A030-25D72AB3B7B2';
-- 4. Recursos Humanos
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:account-group'         WHERE Id = '019C6C02-7718-78AA-85FD-433B0EA0C50C';
-- 5. Biblioteca
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:book'                  WHERE Id = '019C6C02-7718-7F7B-943F-438BF08435FF';
-- 6. Calendarios
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:calendar'              WHERE Id = '019C6C02-7719-7050-8781-453A786E649E';
-- 7. Recursos Humanos v2
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:account-group'         WHERE Id = '019D3694-8FAE-71A4-A8D9-6AC580CEB888';
-- 8. Supervisión
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:briefcase'             WHERE Id = '019C6C02-7718-723F-8E03-6C12B6F13D18';
-- 9. Utilidades
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:cog'                   WHERE Id = '019C6C02-7718-7FD0-B3C3-6CEB5528CCF0';
-- 10. Almacen
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:package'               WHERE Id = '019C6C02-7718-728F-A691-7156BB2AA172';
-- 11. Mesa directiva
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:crown'                 WHERE Id = '019C6C02-7718-7AE4-B7DF-7C1062FB3EC1';
-- 12. Inventarios
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:warehouse'             WHERE Id = '019C6C02-7718-766B-B0EE-853D4343D251';
-- 13. Pases QR
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:barcode'               WHERE Id = '019C6C02-7718-74D8-87A1-9404852A76F9';
-- 14. Legal
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:briefcase'             WHERE Id = '019C6C02-7719-7663-B231-98CCF16BECBC';
-- 15. Anuncios
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:bullhorn'              WHERE Id = '019C6C02-7719-731C-849A-9D78CF4E0E4E';
-- 16. Directorios
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:card-account-details'  WHERE Id = '019C6C02-7719-7972-BF6E-AE3010CA16CF';
-- 17. Compras
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:shopping'              WHERE Id = '019C6C02-7718-7728-AE75-B43E98B81E0F';
-- 18. Sistemas
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:monitor'               WHERE Id = '019C6C02-7718-7153-89B6-BD6F5E474A69';
-- 19. Bitacoras
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:book'                  WHERE Id = '019C6C02-7718-7429-BD70-D01E02B398ED';
-- 20. Reportes
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:chart-bar'             WHERE Id = '019C6C02-7718-7785-A59A-D3BC1D5368BB';
-- 21. Reclutamiento
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:account-plus'          WHERE Id = '019C6C02-7718-7392-A97E-D6D46BCDB6FC';
-- 22. Paqueteria
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:truck'                 WHERE Id = '019C6C02-7718-7EC0-BFAE-E1F03C2701AB';
-- 23. Juntas de comite
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:graduation-cap'        WHERE Id = '019C6C02-7718-7AB9-ACB4-E6D9F02C7126';
-- 24. Inspecciones
UPDATE [dbo].[ModuleApp] SET Icon = 'mdi:format-list-bulleted'  WHERE Id = '019C6C02-7718-739B-BA01-FFA93CCFBA42';

-- Verificación de cambios
SELECT Id, Label, Icon FROM [dbo].[ModuleApp] WHERE Icon LIKE 'mdi:%';

-- Confirmar si todo se ve bien
COMMIT;
-- ROLLBACK;
