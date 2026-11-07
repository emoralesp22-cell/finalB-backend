package com.examen.ferreteria.controller;

import com.examen.ferreteria.dto.FacturaClienteDTO;
import com.examen.ferreteria.dto.FacturaDetalleReporteDTO;
import com.examen.ferreteria.service.ReporteService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @GetMapping(value = {"/clientes/reporteClienteFactura", "/reportes/facturas-cliente", "/clientes/facturas"})
    public ResponseEntity<List<FacturaClienteDTO>> obtenerReporteClienteFactura() {
        List<FacturaClienteDTO> reporte = reporteService.obtenerFacturasPorCliente();
        return ResponseEntity.ok(reporte);
    }

    @GetMapping(value = {"/facturas/reporteFacturaDetalle", "/reportes/facturas-detalle", "/facturas/detalle"})
    public ResponseEntity<List<FacturaDetalleReporteDTO>> obtenerReporteDetalleFacturas() {
        List<FacturaDetalleReporteDTO> reporte = reporteService.obtenerReporteDetalleFacturas();
        return ResponseEntity.ok(reporte);
    }
}
