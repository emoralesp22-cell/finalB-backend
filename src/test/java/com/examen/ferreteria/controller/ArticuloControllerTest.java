package com.examen.ferreteria.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.examen.ferreteria.dto.ArticuloCategoriaDTO;
import com.examen.ferreteria.dto.ArticuloDTO;
import com.examen.ferreteria.dto.MessageResponse;
import com.examen.ferreteria.service.ArticuloService;
import com.examen.ferreteria.service.ArticuloServiceTest.StubArticuloRepository;
import com.examen.ferreteria.service.ReporteService;
import com.examen.ferreteria.service.ReporteServiceTest.StubFacturaDetalleRepository;
import com.examen.ferreteria.service.ReporteServiceTest.StubFacturaRepository;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ArticuloControllerTest {

    private ArticuloController articuloController;

    @BeforeEach
    void setUp() {
        StubArticuloRepository articuloRepo = new StubArticuloRepository();
        ArticuloService articuloService = new ArticuloService(articuloRepo);
        ReporteService reporteService = new ReporteService(articuloRepo, new StubFacturaRepository(), new StubFacturaDetalleRepository());
        articuloController = new ArticuloController(articuloService, reporteService);
    }

    @Test
    void mostrarActivosFiltro_parametroValido_retorna200YLista() {
        ResponseEntity<?> response = articuloController.mostrarActivosFiltro("martillo");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof List<?>);
        List<?> lista = (List<?>) response.getBody();
        assertEquals(1, lista.size());
    }

    @Test
    void mostrarActivosFiltro_parametroVacio_retorna400BadRequest() {
        ResponseEntity<?> responseVacio = articuloController.mostrarActivosFiltro("");
        ResponseEntity<?> responseNull = articuloController.mostrarActivosFiltro(null);
        ResponseEntity<?> responseEspacios = articuloController.mostrarActivosFiltro("   ");

        assertEquals(HttpStatus.BAD_REQUEST, responseVacio.getStatusCode());
        assertTrue(responseVacio.getBody() instanceof MessageResponse);
        MessageResponse msg = (MessageResponse) responseVacio.getBody();
        assertEquals("El parámetro de búsqueda 'nombre' no puede estar vacío.", msg.getMensaje());

        assertEquals(HttpStatus.BAD_REQUEST, responseNull.getStatusCode());
        assertEquals(HttpStatus.BAD_REQUEST, responseEspacios.getStatusCode());
    }

    @Test
    void reporteArticuloCategoria_retorna200YLista() {
        ResponseEntity<List<ArticuloCategoriaDTO>> response = articuloController.obtenerReporteArticuloCategoria();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Herramientas Manuales", response.getBody().get(0).getNombreCategoria());
    }
}
