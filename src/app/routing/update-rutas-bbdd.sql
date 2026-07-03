-- ============================================================================
-- Script: update-rutas-bbdd.sql
-- Propósito: Actualizar RouterLink en Modules para que coincidan con los
--            paths reales del routing de Angular (route-paths.ts)
-- Tabla:   [LuxuryBuildingGroup].[dbo].[Modules]
-- Generado: 2026-07-02
-- ============================================================================
-- ============================================================================

-- ============================================================================
-- 1. MESA DIRECTIVA → COMITÉ (se añade prefijo /committee/)
-- ============================================================================
UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/committee/board-directors/monthly-meetings'
WHERE Id = '019c6c02-7718-7d53-a310-edb08c40c065';

UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/committee/board-directors/meeting-minutes'
WHERE Id = '019c6c02-7718-726b-b8da-28ea4e4b65d7';

UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/committee/board-directors/financial-reports'
WHERE Id = '019c6c02-7719-76db-ab9c-27e62125ae7b';

UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/committee/board-directors/documents'
WHERE Id = '019c6c02-7719-7673-800a-00b76aaf3ab3';

-- ============================================================================
-- 2. HUMAN-RESOURCES → RECURSOS-HUMANOS (prefijo cambiado)
-- ============================================================================
UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/recursos-humanos'
WHERE Id = '019c6c02-7718-78aa-85fd-433b0ea0c50c';

UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/recursos-humanos/my-requests'
WHERE Id = '019c6c02-7718-7dcc-87a6-9d45ed92d5f9';

UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/recursos-humanos/my-vacations'
WHERE Id = '019c6c02-7718-74fc-9ea8-e693ccf4d2dc';

UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/recursos-humanos/vacation-calendar'
WHERE Id = '019c6c02-7718-73ab-b439-6029212a06af';

UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/recursos-humanos/approval'
WHERE Id = '019c6c02-7718-71d6-a11e-d33332101191';

UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/recursos-humanos/register-past-vacations'
WHERE Id = '019c6c02-7718-7833-ab68-f9b8d625e5dd';

UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/recursos-humanos/requests-history'
WHERE Id = '019c6c02-7718-7342-b2c3-194075c44da0';

UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/recursos-humanos/auditoria-vacaciones'
WHERE Id = '019c7bb6-2c87-7f5c-82e0-6468ea413e96';

-- ============================================================================
-- 3. LEGAL — path segments normalizados a inglés real del routing
-- ============================================================================
UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/legal/documents/employee-contracts'
WHERE Id = '019c6c02-7718-7edf-8a46-1c8f4685d1cd';

UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/legal/documents/lawsuits'
WHERE Id = '019c6c02-7718-7df1-889f-1e9a4efb9c22';

-- ============================================================================
-- 4. RECLUTAMIENTO — vacantes → vacancies
-- ============================================================================
UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/recruitment/requests/vacancies'
WHERE Id = '019c6c02-7718-76a2-b115-565513472ce2';

-- ============================================================================
-- 5. ENTREGA-RECEPCIÓN — español → inglés (paths reales)
-- ============================================================================
UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/delivery-reception/hydrants'
WHERE Id = '019c6c02-7719-700c-9468-389fad9b1024';

UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/delivery-reception/keys'
WHERE Id = '019c6c02-7719-7be8-a9aa-8a0059617629';

-- ============================================================================
-- 6. COMPRAS — presupuestos → presupuesto (singular en el routing)
-- ============================================================================
UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/purchases/presupuesto'
WHERE Id = '019c6c02-7718-7f2e-a4a1-e6b987d22fc2';

-- ============================================================================
-- 7. DIAGRAMA — falta / inicial
-- ============================================================================
UPDATE [LuxuryBuildingGroup].[dbo].[Modules] SET RouterLink = '/diagram'
WHERE Id = '019db129-b0c6-7892-87ae-e8cca6bc90ea';

-- ============================================================================
-- FIN: Total 19 rutas actualizadas
-- ============================================================================
