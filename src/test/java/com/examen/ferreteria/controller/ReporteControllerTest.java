package com.examen.ferreteria.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.examen.ferreteria.dto.FacturaClienteDTO;
import com.examen.ferreteria.dto.FacturaDetalleReporteDTO;
import com.examen.ferreteria.service.ReporteService;
import com.examen.ferreteria.service.ReporteServiceTest.StubArticuloRepository;
import com.examen.ferreteria.service.ReporteServiceTest.StubFacturaDetalleRepository;
import com.examen.ferreteria.service.ReporteServiceTest.StubFacturaRepository;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ReporteControllerTest {

    private ReporteController reporteController;

    @BeforeEach
    void setUp() {
        ReporteService reporteService = new ReporteService(
                new StubArticuloRepository(),
                new StubFacturaRepository(),
                new StubFacturaDetalleRepository()
        );
        reporteController = new ReporteController(reporteService);
    }

    @Test
    void testObtenerReporteClienteFactura() {
        ResponseEntity<List<FacturaClienteDTO>> response = reporteController.obtenerReporteClienteFactura();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Diego", response.getBody().get(0).getNombreCliente());
    }

    @Test
    void testObtenerReporteDetalleFacturas() {
        ResponseEntity<List<FacturaDetalleReporteDTO>> response = reporteController.obtenerReporteDetalleFacturas();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Guantes de Cuero", response.getBody().get(0).getNombreArticulo());
    }
}
