package com.examen.ferreteria.service;

import com.examen.ferreteria.dto.ArticuloDTO;
import com.examen.ferreteria.repository.ArticuloRepository;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ArticuloService {

    private final ArticuloRepository articuloRepository;

    public ArticuloService(ArticuloRepository articuloRepository) {
        this.articuloRepository = articuloRepository;
    }

    public List<ArticuloDTO> buscarActivosPorNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return articuloRepository.buscarActivosPorNombre(nombre.trim());
    }
}
