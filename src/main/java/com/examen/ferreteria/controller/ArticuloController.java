package com.examen.ferreteria.controller;

import com.examen.ferreteria.dto.ArticuloCategoriaDTO;
import com.examen.ferreteria.dto.ArticuloDTO;
import com.examen.ferreteria.dto.MessageResponse;
import com.examen.ferreteria.service.ArticuloService;
import com.examen.ferreteria.service.ReporteService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/articulos")
@CrossOrigin(origins = "*")
public class ArticuloController {

    private final ArticuloService articuloService;
    private final ReporteService reporteService;

    public ArticuloController(ArticuloService articuloService, ReporteService reporteService) {
        this.articuloService = articuloService;
        this.reporteService = reporteService;
    }

    @GetMapping(value = {"/mostrarActivosFiltro", "/activos/buscar"})
    public ResponseEntity<?> mostrarActivosFiltro(
            @RequestParam(name = "nombre", required = false) String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("El parámetro de búsqueda 'nombre' no puede estar vacío."));
        }
        List<ArticuloDTO> articulos = articuloService.buscarActivosPorNombre(nombre);
        return ResponseEntity.ok(articulos);
    }

    @GetMapping(value = {"/reporteArticuloCategoria", "/articulos-categoria"})
    public ResponseEntity<List<ArticuloCategoriaDTO>> obtenerReporteArticuloCategoria() {
        List<ArticuloCategoriaDTO> reporte = reporteService.obtenerArticulosConCategoria();
        return ResponseEntity.ok(reporte);
    }
}
