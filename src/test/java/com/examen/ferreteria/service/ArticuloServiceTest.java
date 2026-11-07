package com.examen.ferreteria.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.examen.ferreteria.dto.ArticuloCategoriaDTO;
import com.examen.ferreteria.dto.ArticuloDTO;
import com.examen.ferreteria.entity.Articulo;
import com.examen.ferreteria.repository.ArticuloRepository;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery.FetchableFluentQuery;

public class ArticuloServiceTest {

    private ArticuloService articuloService;

    public static class StubArticuloRepository implements ArticuloRepository {
        @Override
        public List<ArticuloDTO> buscarActivosPorNombre(String nombre) {
            if ("martillo".equalsIgnoreCase(nombre)) {
                return List.of(new ArticuloDTO(1, "Martillo de Uña 16 oz", "Truper", new BigDecimal("65.00"), 40, true, "Herramientas Manuales"));
            }
            return Collections.emptyList();
        }

        @Override
        public List<ArticuloCategoriaDTO> obtenerArticulosConCategoria() {
            return List.of(new ArticuloCategoriaDTO("Martillo de Uña 16 oz", "Truper", "Herramientas Manuales", new BigDecimal("65.00"), 40));
        }

        @Override public void flush() {}
        @Override public <S extends Articulo> S saveAndFlush(S entity) { return entity; }
        @Override public <S extends Articulo> List<S> saveAllAndFlush(Iterable<S> entities) { return Collections.emptyList(); }
        @Override public void deleteAllInBatch(Iterable<Articulo> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<Integer> integers) {}
        @Override public void deleteAllInBatch() {}
        @Override public Articulo getOne(Integer integer) { return null; }
        @Override public Articulo getById(Integer integer) { return null; }
        @Override public Articulo getReferenceById(Integer integer) { return null; }
        @Override public <S extends Articulo> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends Articulo> List<S> findAll(Example<S> example) { return Collections.emptyList(); }
        @Override public <S extends Articulo> List<S> findAll(Example<S> example, Sort sort) { return Collections.emptyList(); }
        @Override public <S extends Articulo> Page<S> findAll(Example<S> example, Pageable pageable) { return Page.empty(); }
        @Override public <S extends Articulo> long count(Example<S> example) { return 0; }
        @Override public <S extends Articulo> boolean exists(Example<S> example) { return false; }
        @Override public <S extends Articulo, R> R findBy(Example<S> example, Function<FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends Articulo> S save(S entity) { return entity; }
        @Override public <S extends Articulo> List<S> saveAll(Iterable<S> entities) { return Collections.emptyList(); }
        @Override public Optional<Articulo> findById(Integer integer) { return Optional.empty(); }
        @Override public boolean existsById(Integer integer) { return false; }
        @Override public List<Articulo> findAll() { return Collections.emptyList(); }
        @Override public List<Articulo> findAllById(Iterable<Integer> integers) { return Collections.emptyList(); }
        @Override public long count() { return 0; }
        @Override public void deleteById(Integer integer) {}
        @Override public void delete(Articulo entity) {}
        @Override public void deleteAllById(Iterable<? extends Integer> integers) {}
        @Override public void deleteAll(Iterable<? extends Articulo> entities) {}
        @Override public void deleteAll() {}
        @Override public List<Articulo> findAll(Sort sort) { return Collections.emptyList(); }
        @Override public Page<Articulo> findAll(Pageable pageable) { return Page.empty(); }
    }

    @BeforeEach
    void setUp() {
        articuloService = new ArticuloService(new StubArticuloRepository());
    }

    @Test
    void buscarActivosPorNombre_parametroValido_retornaLista() {
        List<ArticuloDTO> resultado = articuloService.buscarActivosPorNombre("martillo");

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Martillo de Uña 16 oz", resultado.get(0).getNombre());
    }

    @Test
    void buscarActivosPorNombre_parametroVacioONull_retornaListaVacia() {
        List<ArticuloDTO> resultadoNull = articuloService.buscarActivosPorNombre(null);
        List<ArticuloDTO> resultadoVacio = articuloService.buscarActivosPorNombre("");
        List<ArticuloDTO> resultadoBlanco = articuloService.buscarActivosPorNombre("   ");

        assertNotNull(resultadoNull);
        assertTrue(resultadoNull.isEmpty());
        assertNotNull(resultadoVacio);
        assertTrue(resultadoVacio.isEmpty());
        assertNotNull(resultadoBlanco);
        assertTrue(resultadoBlanco.isEmpty());
    }
}
