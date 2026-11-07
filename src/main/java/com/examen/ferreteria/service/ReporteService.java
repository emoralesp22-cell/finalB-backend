package com.examen.ferreteria.service;

import com.examen.ferreteria.dto.ArticuloCategoriaDTO;
import com.examen.ferreteria.dto.FacturaClienteDTO;
import com.examen.ferreteria.dto.FacturaDetalleReporteDTO;
import com.examen.ferreteria.repository.ArticuloRepository;
import com.examen.ferreteria.repository.FacturaDetalleRepository;
import com.examen.ferreteria.repository.FacturaRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ReporteService {

    private final ArticuloRepository articuloRepository;
    private final FacturaRepository facturaRepository;
    private final FacturaDetalleRepository facturaDetalleRepository;

    public ReporteService(ArticuloRepository articuloRepository,
                          FacturaRepository facturaRepository,
                          FacturaDetalleRepository facturaDetalleRepository) {
        this.articuloRepository = articuloRepository;
        this.facturaRepository = facturaRepository;
        this.facturaDetalleRepository = facturaDetalleRepository;
    }

    public List<ArticuloCategoriaDTO> obtenerArticulosConCategoria() {
        return articuloRepository.obtenerArticulosConCategoria();
    }

    public List<FacturaClienteDTO> obtenerFacturasPorCliente() {
        return facturaRepository.obtenerFacturasPorCliente();
    }

    public List<FacturaDetalleReporteDTO> obtenerReporteDetalleFacturas() {
        return facturaDetalleRepository.obtenerReporteDetalleFacturas();
    }
}
