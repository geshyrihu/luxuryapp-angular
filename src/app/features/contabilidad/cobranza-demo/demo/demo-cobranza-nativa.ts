import { CommonModule, DecimalPipe } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SelectModule } from "primeng/select";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";

@Component({
  selector: "app-demo-cobranza-nativa",
  imports: [CommonModule, SelectModule, FormsModule],
  templateUrl: "./demo-cobranza-nativa.html",
  providers: [DecimalPipe],
})
export default class DemoCobranzaNativa implements OnInit {
  readonly DEMO_CUSTOMER_ID = "019c6bee-030e-79d2-8c40-47792943b1aa";
  readonly MOCK_TOTAL_FACTURADO = 33600;

  rolActual = signal<string | null>(null);

  // ─── Datos en vivo ───────────────────────────────────────────
  showcaseData = signal<any>(null);
  loadingShowcase = signal(false);

  // ─── Selector de propiedad (rol condómino) ───────────────────
  selectedPropIndex = signal(0);

  selectedProp = computed(() => {
    const data = this.showcaseData();
    if (!data?.propiedades?.length) return null;
    const idx = this.selectedPropIndex();
    return data.propiedades[idx] ?? data.propiedades[0];
  });

  // ─── KPIs calculados desde live data ─────────────────────────
  kpiPorCobrar = computed(() => {
    const props: any[] = this.showcaseData()?.propiedades ?? [];
    return props.reduce(
      (acc: number, p: any) =>
        acc + (p.currentBalance > 0 ? Number(p.currentBalance) : 0),
      0,
    );
  });

  kpiCobrado = computed(() =>
    Math.max(0, this.MOCK_TOTAL_FACTURADO - this.kpiPorCobrar()),
  );

  kpiVencido = computed(() => {
    const props: any[] = this.showcaseData()?.propiedades ?? [];
    return props
      .filter((p: any) => p.currentBalance > 5000)
      .reduce((acc: number, p: any) => acc + Number(p.currentBalance), 0);
  });

  kpiPorcentaje = computed(() => {
    const cobrado = this.kpiCobrado();
    return Math.round((cobrado / this.MOCK_TOTAL_FACTURADO) * 1000) / 10;
  });

  kpiAlCorriente = computed(
    () =>
      (this.showcaseData()?.propiedades ?? []).filter(
        (p: any) => p.currentBalance <= 0,
      ).length || 0,
  );

  kpiConDeuda = computed(
    () =>
      (this.showcaseData()?.propiedades ?? []).filter(
        (p: any) => p.currentBalance > 0 && p.currentBalance <= 5000,
      ).length || 0,
  );

  kpiMorosos = computed(
    () =>
      (this.showcaseData()?.propiedades ?? []).filter(
        (p: any) => p.currentBalance > 5000,
      ).length || 0,
  );

  kpiTotalProps = computed(() =>
    Math.max(12, (this.showcaseData()?.propiedades ?? []).length),
  );

  kpiPorcentajeAlCorriente = computed(() => {
    const total = this.kpiTotalProps();
    return total > 0
      ? Math.round((this.kpiAlCorriente() / total) * 1000) / 10
      : 0;
  });

  kpiPorcentajeDeuda = computed(() => {
    const total = this.kpiTotalProps();
    return total > 0 ? Math.round((this.kpiConDeuda() / total) * 1000) / 10 : 0;
  });

  kpiPorcentajeMorosos = computed(() => {
    const total = this.kpiTotalProps();
    return total > 0 ? Math.round((this.kpiMorosos() / total) * 1000) / 10 : 0;
  });

  // ─── Kardex computado del condómino seleccionado ─────────────
  kardexComputado = computed(() => {
    const prop = this.selectedProp();
    if (!prop?.ultimosMovimientos?.length) {
      return [
        {
          concepto: "Mantenimiento Mar 2026",
          det: "01 Mar 2026 · Cargo mensual",
          tipo: "+",
          monto: 2800,
          saldo: 5740,
        },
        {
          concepto: "Recargo por Mora",
          det: "10 Feb 2026 · Automático",
          tipo: "+",
          monto: 140,
          saldo: 2940,
        },
        {
          concepto: "Mantenimiento Feb 2026",
          det: "01 Feb 2026 · Cargo mensual",
          tipo: "+",
          monto: 2800,
          saldo: 2800,
        },
        {
          concepto: "Pago Enero 2026",
          det: "15 Ene 2026 · SPEI",
          tipo: "-",
          monto: 2800,
          saldo: 0,
        },
      ];
    }

    // Reconstruir kardex con saldo acumulado
    const movs: any[] = prop.ultimosMovimientos;
    let saldo = Number(prop.currentBalance);
    return movs.map((m: any) => {
      const row = {
        concepto: m.concepto,
        det:
          new Date(m.fecha).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }) +
          " · Cta " +
          prop.coiAccount,
        tipo: m.tipo,
        monto: Math.abs(Number(m.monto)),
        saldo: saldo,
      };
      // Ajustar saldo hacia atrás (los movs vienen más reciente primero)
      if (m.tipo === "+") saldo -= Number(m.monto);
      else saldo += Number(m.monto);
      return row;
    });
  });

  // ─── Modal Pago ──────────────────────────────────────────────
  modalPagoAbierto = signal(false);
  modalNombre = signal("");
  modalUnidad = signal("");
  modalMonto = signal(0);
  montoPagar = signal<string>("");
  metodoPago = signal("Transferencia bancaria (SPEI)");
  pagoManualCargando = signal(false);

  // ─── Toasts ──────────────────────────────────────────────────
  toastActivo = signal(false);
  toastTitulo = signal("");
  toastMsg = signal("");
  toastIconClass = signal("");
  toastEmoji = signal("");

  // ─── Modal Pasarela ──────────────────────────────────────────
  modalPasarelaAbierto = signal(false);
  tarjetaNumero = signal("");
  tarjetaNombre = signal("");
  tarjetaFecha = signal("");
  tarjetaCvv = signal("");
  pasarelaCargando = signal(false);

  // ─── Modal Condonación ───────────────────────────────────────
  modalCondonacionAbierto = signal(false);
  condonacionUnidad = signal("");
  condonacionMonto = signal(0);
  condonacionMotivo = signal("Acuerdo de asamblea");

  // ─── Modal Cancelación ───────────────────────────────────────
  modalCancelacionAbierto = signal(false);
  cancelacionReferencia = signal("");

  // ─── Modal PDF ───────────────────────────────────────────────
  modalPdfAbierto = signal(false);
  pdfGenerando = signal(false);
  hoyDate = new Date();

  // ─── UI state ────────────────────────────────────────────────
  cargosGeneradosText = signal("⚡ Simular Generación Abril 2026");
  cargosGeneradosDisabled = signal(false);
  cargosGeneradosOpacity = signal("");
  deudoresInactivos = signal<string[]>([]);

  // ─── Plantillas ──────────────────────────────────────────────
  plantillasActivas = signal<any[]>([
    {
      id: 1,
      concepto: "Mantenimiento Ordinario",
      detalles: "Monto fijo · Activa desde Enero 2026",
      montoStr: "$2,800",
      activaText: "Activa",
      activaClass: "badge badge-success",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      emoji: "🏠",
    },
    {
      id: 2,
      concepto: "Cuota de Agua",
      detalles: "Por indiviso (%) · Activa desde Enero 2026",
      montoStr: "Variable",
      activaText: "Activa",
      activaClass: "badge badge-success",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      emoji: "💧",
    },
    {
      id: 3,
      concepto: "Vigilancia 24/7",
      detalles: "Monto fijo · Activa desde Marzo 2026",
      montoStr: "$400",
      activaText: "Nueva",
      activaClass: "badge badge-warning",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      emoji: "🔒",
    },
  ]);
  modalPlantillaAbierto = signal(false);
  nuevaPlantillaConcepto = signal("");
  nuevaPlantillaMonto = signal<number>(0);

  // ─── Historial de pagos ───────────────────────────────────────
  historialPagos = signal<any[]>([
    {
      nombre: "Flores Medina · Depto 301",
      hora: "09:14 AM · Transferencia · Ref. SPEI-2026030801",
      monto: 2800,
    },
    {
      nombre: "Rodríguez Sánchez · Depto 201",
      hora: "10:32 AM · Efectivo · Recibo 00142",
      monto: 3200,
    },
  ]);

  private decimalPipe = inject(DecimalPipe);
  private api = inject(ApiResponseService);

  ngOnInit() {
    this.cargarShowcase();
  }

  async cargarShowcase() {
    this.loadingShowcase.set(true);
    const data = await this.api.onGetItem<any>(
      Endpoints.AccountingCoi.NativeCollection.Demo.showcaseData,
      false,
    );
    if (data) {
      this.showcaseData.set(data);
      // Mapear plantillas si hay datos reales del backend
      if (data.plantillas?.length) {
        const iconos = [
          { iconBg: "bg-blue-100", iconColor: "text-blue-600", emoji: "🏠" },
          { iconBg: "bg-cyan-100", iconColor: "text-cyan-600", emoji: "💧" },
          {
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            emoji: "🔒",
          },
          {
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            emoji: "📝",
          },
        ];
        this.plantillasActivas.set(
          data.plantillas.map((p: any, idx: number) => ({
            id: idx + 1,
            concepto: p.concepto,
            detalles: (p.esFijio ? "Monto fijo" : "Proporcional") + " · Activa",
            montoStr:
              "$" +
              (this.decimalPipe.transform(p.montoAsignado, "1.2-2") ||
                p.montoAsignado),
            activaText: p.estatus === "Vigente" ? "Activa" : p.estatus,
            activaClass:
              p.estatus === "Vigente"
                ? "badge badge-success"
                : "badge badge-warning",
            ...(iconos[idx] ?? iconos[0]),
          })),
        );
      }
    }
    this.loadingShowcase.set(false);
  }

  async triggerDemoAction(actionName: string, targetId: string) {
    this.mostrarToast(
      "info",
      "Enviando aviso real...",
      "El backend enviará el correo y push notification.",
    );
    const result = await this.api.onPost<boolean>(
      Endpoints.AccountingCoi.NativeCollection.Demo.triggerAction,
      { actionName, targetId, delayMs: 1000 },
    );
    if (result !== false) {
      this.mostrarToast(
        "exito",
        "Aviso Enviado",
        "Correo y push notification despachados al condómino.",
      );
    } else {
      this.mostrarToast("error", "Error", "No se pudo despachar el aviso.");
    }
  }

  seleccionarPropiedad(index: number) {
    this.selectedPropIndex.set(index);
  }

  // ─── Aging buckets ───────────────────────────────────────────
  getAgingLabel(balance: number, status: string): string {
    if (balance <= 0) return "Al corriente";
    if (balance <= 2800) return "< 30 días";
    if (balance <= 5600) return "30–60 días";
    if (balance <= 8400) return "60–90 días";
    return "D+90 · Judicial";
  }

  getAgingClass(balance: number): string {
    if (balance <= 0)
      return "bg-green-100 text-green-700 border border-green-200";
    if (balance <= 2800)
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    if (balance <= 5600)
      return "bg-orange-100 text-orange-700 border border-orange-200";
    if (balance <= 8400) return "bg-red-100 text-red-700 border border-red-200";
    return "bg-red-900 text-white border border-red-800";
  }

  // ─── Distribución FIFO simulada ───────────────────────────────
  calcularDistribucionFIFO(monto: number): string {
    const cargos = [
      { concepto: "Mantenimiento Feb 2026", pendiente: 2800 },
      { concepto: "Recargo Mora Feb", pendiente: 140 },
      { concepto: "Mantenimiento Mar 2026", pendiente: 2800 },
    ];
    let restante = monto;
    const lineas: string[] = [];
    for (const cargo of cargos) {
      if (restante <= 0) break;
      const aplicado = Math.min(restante, cargo.pendiente);
      lineas.push(`• ${cargo.concepto}: $${aplicado.toLocaleString("es-MX")}`);
      restante -= aplicado;
    }
    if (restante > 0) {
      lineas.push(`• Saldo a favor: $${restante.toLocaleString("es-MX")}`);
    }
    return lineas.join("\n");
  }

  entrarRol(rol: string) {
    this.rolActual.set(rol);
  }

  volverSelector() {
    this.rolActual.set(null);
  }

  getRolBadgeClass() {
    return (
      {
        admin: "badge-primary",
        cobranza: "badge-info",
        condomino: "badge-success",
      }[this.rolActual() || ""] || ""
    );
  }

  getRolBadgeText() {
    return (
      {
        admin: "🏢 Administrador",
        cobranza: "💼 Cobranza",
        condomino: "🏠 Condómino",
      }[this.rolActual() || ""] || ""
    );
  }

  mostrarToast(
    tipo: "exito" | "info" | "alerta" | "error",
    titulo: string,
    msg: string,
  ) {
    const configs = {
      exito: { bg: "bg-green-100", color: "text-green-600", emoji: "✅" },
      info: { bg: "bg-blue-100", color: "text-blue-600", emoji: "ℹ️" },
      alerta: { bg: "bg-yellow-100", color: "text-yellow-700", emoji: "⚠️" },
      error: { bg: "bg-red-100", color: "text-red-600", emoji: "❌" },
    };
    const c = configs[tipo] || configs.info;
    this.toastIconClass.set(`${c.bg} ${c.color}`);
    this.toastEmoji.set(c.emoji);
    this.toastTitulo.set(titulo);
    this.toastMsg.set(msg);
    this.toastActivo.set(true);
    setTimeout(() => this.toastActivo.set(false), 4000);
  }

  async simularSeedSandbox() {
    this.cargosGeneradosDisabled.set(true);
    this.mostrarToast(
      "info",
      "Preparando Sandbox...",
      "Limpiando base de datos e inyectando datos iniciales.",
    );
    const res = await this.api.onPost<boolean>(
      `cobranza-nativa/demo/seed-sandbox/${this.DEMO_CUSTOMER_ID}`,
      null,
    );
    if (res) {
      this.mostrarToast(
        "exito",
        "Sandbox Inicializado",
        "4 propiedades creadas con perfiles de deuda simulados.",
      );
      await this.cargarShowcase();
    } else {
      this.mostrarToast(
        "error",
        "Error de inyección",
        "No fue posible inicializar el Sandbox.",
      );
    }
    this.cargosGeneradosDisabled.set(false);
  }

  async simularGenerarCargos() {
    this.cargosGeneradosText.set("⏳ Motor Generando...");
    this.cargosGeneradosDisabled.set(true);
    this.cargosGeneradosOpacity.set("opacity-70");

    const res = await this.api.onPost<boolean>(
      `cobranza-nativa/demo/time-travel/generate-charges?customerId=${this.DEMO_CUSTOMER_ID}`,
      null,
    );

    if (res) {
      this.cargosGeneradosText.set("✅ Cargos Emitidos");
      this.cargosGeneradosOpacity.set("");
      this.mostrarToast(
        "exito",
        "Ciclo completado",
        "El orquestador procesó todas las plantillas activas e insertó los nuevos cargos.",
      );
      await this.cargarShowcase();
    } else {
      this.mostrarToast(
        "error",
        "Error del Motor",
        "Falló la generación de cargos.",
      );
    }

    setTimeout(() => {
      this.cargosGeneradosText.set("⚡ Generador de Cargos");
      this.cargosGeneradosDisabled.set(false);
      this.cargosGeneradosOpacity.set("");
    }, 4000);
  }

  async simularAplicarMora() {
    this.cargosGeneradosDisabled.set(true);
    this.mostrarToast(
      "info",
      "Motor Mora Diario",
      "Evaluando todas las propiedades contra sus pólizas...",
    );

    const res = await this.api.onPost<boolean>(
      `cobranza-nativa/demo/time-travel/apply-late-fees?customerId=${this.DEMO_CUSTOMER_ID}`,
      null,
    );

    if (res) {
      this.mostrarToast(
        "exito",
        "Mora Aplicada",
        "Se calcularon recargos a los condóminos con adeudos vencidos fuera del período de gracia.",
      );
      await this.cargarShowcase();
    }
    this.cargosGeneradosDisabled.set(false);
  }

  async simularMotorNotificaciones() {
    this.cargosGeneradosDisabled.set(true);
    this.mostrarToast(
      "info",
      "Orquestador de Avisos",
      "Preparando y enviando Drip Campaigns.",
    );

    const res = await this.api.onPost<boolean>(
      `cobranza-nativa/demo/time-travel/send-notifications?customerId=${this.DEMO_CUSTOMER_ID}`,
      null,
    );

    if (res) {
      this.mostrarToast(
        "exito",
        "Campañas Despachadas",
        "Enviadas docenas de correos y push sobre moras y pre-vencimientos.",
      );
      await this.cargarShowcase();
    }
    this.cargosGeneradosDisabled.set(false);
  }

  simularNuevaPlantilla() {
    this.nuevaPlantillaConcepto.set("");
    this.nuevaPlantillaMonto.set(0);
    this.modalPlantillaAbierto.set(true);
  }

  cerrarModalPlantilla() {
    this.modalPlantillaAbierto.set(false);
  }

  guardarPlantilla() {
    if (!this.nuevaPlantillaConcepto()) {
      this.mostrarToast(
        "error",
        "Campos incompletos",
        "El concepto es requerido.",
      );
      return;
    }
    this.cerrarModalPlantilla();
    const formattedAmt =
      this.decimalPipe.transform(this.nuevaPlantillaMonto(), "1.2-2") ||
      this.nuevaPlantillaMonto().toString();

    this.plantillasActivas.update((p) => [
      ...p,
      {
        id: Date.now(),
        concepto: this.nuevaPlantillaConcepto(),
        detalles:
          "Monto fijo · Activa desde " +
          new Date().toLocaleString("es-MX", {
            month: "long",
            year: "numeric",
          }),
        montoStr: "$" + formattedAmt,
        activaText: "Recién creada",
        activaClass: "badge badge-primary",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        emoji: "✨",
        nueva: true,
      },
    ]);

    this.mostrarToast(
      "exito",
      "Plantilla Creada",
      `"${this.nuevaPlantillaConcepto()}" se incluirá en el próximo ciclo de generación.`,
    );
  }

  abrirModalPago(nombre: string, unidad: string, monto: number) {
    this.modalNombre.set(nombre);
    this.modalUnidad.set(unidad);
    this.modalMonto.set(monto);
    this.montoPagar.set(monto.toString());
    this.metodoPago.set("Transferencia bancaria (SPEI)");
    this.modalPagoAbierto.set(true);
  }

  cerrarModal() {
    this.modalPagoAbierto.set(false);
  }

  confirmarPago() {
    this.pagoManualCargando.set(true);

    setTimeout(() => {
      this.pagoManualCargando.set(false);
      this.cerrarModal();
      const monto = parseFloat(
        this.montoPagar() || this.modalMonto().toString(),
      );
      const now = new Date();
      const hora =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");
      const metodo = this.metodoPago();

      this.historialPagos.update((h) => [
        {
          nombre: `${this.modalNombre()} · ${this.modalUnidad()}`,
          hora: `${hora} · ${metodo}`,
          monto: monto,
          nuevo: true,
        },
        ...h,
      ]);

      // Marcar deudor como inactivo en la lista
      this.deudoresInactivos.update((d) => [...d, this.modalNombre()]);

      const distribucion = this.calcularDistribucionFIFO(monto);
      this.mostrarToast(
        "exito",
        `Pago de $${this.decimalPipe.transform(monto, "1.0-0")} aplicado (FIFO)`,
        `${this.modalNombre()} — Distribución: ${distribucion.split("\n")[0]}${distribucion.split("\n").length > 1 ? " +" + (distribucion.split("\n").length - 1) + " más." : ""} Recibo enviado.`,
      );
    }, 1500);
  }

  // ─── Condonación ─────────────────────────────────────────────
  abrirModalCondonacion() {
    const prop = this.selectedProp();
    this.condonacionUnidad.set(
      prop
        ? `Depto ${prop.department} — ${prop.customerName}`
        : "Depto 301 — Flores Medina",
    );
    this.condonacionMonto.set(
      prop ? Math.round(prop.currentBalance * 0.15) || 400 : 400,
    );
    this.modalCondonacionAbierto.set(true);
  }

  cerrarModalCondonacion() {
    this.modalCondonacionAbierto.set(false);
  }

  procesarCondonacion() {
    this.cerrarModalCondonacion();
    const monto = this.condonacionMonto();
    this.mostrarToast(
      "exito",
      "Condonación aplicada",
      `Se condonaron $${monto} a ${this.condonacionUnidad()} por motivo: ${this.condonacionMotivo()}.`,
    );
    this.historialPagos.update((h) => [
      {
        nombre: this.condonacionUnidad(),
        hora: "Ahora · Condonación de Deuda",
        monto: monto,
        nuevo: true,
      },
      ...h,
    ]);
  }

  // ─── Cancelar Pago ───────────────────────────────────────────
  abrirModalCancelarPago() {
    const ultimo = this.historialPagos()[0];
    this.cancelacionReferencia.set(
      ultimo?.hora?.split("·")[2]?.trim() ?? "SPEI-2026030801",
    );
    this.modalCancelacionAbierto.set(true);
  }

  cerrarModalCancelacion() {
    this.modalCancelacionAbierto.set(false);
  }

  procesarCancelacionPago() {
    this.cerrarModalCancelacion();
    this.mostrarToast(
      "alerta",
      "Pago Revertido",
      `El pago ${this.cancelacionReferencia()} fue cancelado. Los cargos volvieron a estado vencido.`,
    );
  }

  // ─── Acciones cobranza ───────────────────────────────────────
  simularAvisoCobroManual(unidad: string, propertyId: string) {
    this.triggerDemoAction("SEND_PAYMENT_REMINDER", propertyId);
  }

  simularNotaCredito() {
    this.abrirModalCondonacion();
  }

  simularCancelarPago() {
    this.abrirModalCancelarPago();
  }

  simularImport() {
    this.mostrarToast(
      "info",
      "Importar Saldos Iniciales",
      "Sube un archivo CSV. El sistema creará los cargos de tipo SaldoInicial automáticamente.",
    );
  }

  // ─── Pasarela condómino ──────────────────────────────────────
  simularPagarCondomino() {
    this.tarjetaNumero.set("");
    this.tarjetaNombre.set("");
    this.tarjetaFecha.set("");
    this.tarjetaCvv.set("");
    this.pasarelaCargando.set(false);
    this.modalPasarelaAbierto.set(true);
  }

  cerrarPasarelaCondomino() {
    this.modalPasarelaAbierto.set(false);
  }

  async procesarPagoTarjetaCondomino() {
    if (!this.tarjetaNumero() || !this.tarjetaCvv()) {
      this.mostrarToast(
        "error",
        "Datos incompletos",
        "Ingresa los datos de la tarjeta para simular el pago.",
      );
      return;
    }

    this.pasarelaCargando.set(true);

    const prop = this.selectedProp();
    const targetPropertyId =
      prop?.propertyId ?? "00000000-0000-0000-0000-000000000000";
    const monto = prop?.currentBalance ?? 5740;

    const payload = {
      transactionId: "TXN-CKTA" + Math.floor(Math.random() * 10000),
      amount: monto,
      customerReference: this.DEMO_CUSTOMER_ID,
      propertyId: targetPropertyId,
    };

    const res = await this.api.onPost<boolean>(
      `cobranza-nativa/demo/webhook-conekta?customerId=${this.DEMO_CUSTOMER_ID}`,
      payload,
    );

    this.pasarelaCargando.set(false);
    this.cerrarPasarelaCondomino();

    if (res) {
      this.mostrarToast(
        "exito",
        "¡Pago aprobado vía Pasarela!",
        `Cargo de $${this.decimalPipe.transform(monto, "1.2-2")} MXN conciliado automáticamente vía Webhook Conekta.`,
      );
      await this.cargarShowcase();
    } else {
      this.mostrarToast(
        "error",
        "Rechazo de pasarela",
        "El pago no pudo ser conciliado.",
      );
    }
  }

  // ─── PDF ─────────────────────────────────────────────────────
  simularDescargarPDF() {
    this.pdfGenerando.set(true);
    this.modalPdfAbierto.set(true);
    this.mostrarToast(
      "info",
      "Generando documento...",
      "Recopilando movimientos y calculando saldos para formato PDF...",
    );
    setTimeout(() => {
      this.pdfGenerando.set(false);
      this.mostrarToast(
        "exito",
        "PDF Generado",
        "El documento está listo para imprimir.",
      );
    }, 1500);
  }

  cerrarModalPdf() {
    this.modalPdfAbierto.set(false);
  }

  imprimirPdf() {
    window.print();
  }
}
