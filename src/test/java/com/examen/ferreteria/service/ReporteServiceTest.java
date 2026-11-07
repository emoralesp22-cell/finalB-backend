package com.examen.ferreteria.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.examen.ferreteria.dto.ArticuloCategoriaDTO;
import com.examen.ferreteria.dto.ArticuloDTO;
import com.examen.ferreteria.dto.FacturaClienteDTO;
import com.examen.ferreteria.dto.FacturaDetalleReporteDTO;
import com.examen.ferreteria.entity.Articulo;
import com.examen.ferreteria.entity.Factura;
import com.examen.ferreteria.entity.FacturaDetalle;
import com.examen.ferreteria.repository.ArticuloRepository;
import com.examen.ferreteria.repository.FacturaDetalleRepository;
import com.examen.ferreteria.repository.FacturaRepository;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.Date;
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

public class ReporteServiceTest {

    private ReporteService reporteService;

    public static class StubArticuloRepository implements ArticuloRepository {
        @Override public List<ArticuloDTO> buscarActivosPorNombre(String nombre) { return Collections.emptyList(); }
        @Override
        public List<ArticuloCategoriaDTO> obtenerArticulosConCategoria() {
            return List.of(new ArticuloCategoriaDTO("Martillo", "Truper", "Herramientas Manuales", new BigDecimal("65.00"), 40));
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

    public static class StubFacturaRepository implements FacturaRepository {
        @Override
        public List<FacturaClienteDTO> obtenerFacturasPorCliente() {
            return List.of(new FacturaClienteDTO("Diego", "Girón", "5567812-4", new Date(), new BigDecimal("168.00")));
        }
        @Override public void flush() {}
        @Override public <S extends Factura> S saveAndFlush(S entity) { return entity; }
        @Override public <S extends Factura> List<S> saveAllAndFlush(Iterable<S> entities) { return Collections.emptyList(); }
        @Override public void deleteAllInBatch(Iterable<Factura> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<Integer> integers) {}
        @Override public void deleteAllInBatch() {}
        @Override public Factura getOne(Integer integer) { return null; }
        @Override public Factura getById(Integer integer) { return null; }
        @Override public Factura getReferenceById(Integer integer) { return null; }
        @Override public <S extends Factura> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends Factura> List<S> findAll(Example<S> example) { return Collections.emptyList(); }
        @Override public <S extends Factura> List<S> findAll(Example<S> example, Sort sort) { return Collections.emptyList(); }
        @Override public <S extends Factura> Page<S> findAll(Example<S> example, Pageable pageable) { return Page.empty(); }
        @Override public <S extends Factura> long count(Example<S> example) { return 0; }
        @Override public <S extends Factura> boolean exists(Example<S> example) { return false; }
        @Override public <S extends Factura, R> R findBy(Example<S> example, Function<FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends Factura> S save(S entity) { return entity; }
        @Override public <S extends Factura> List<S> saveAll(Iterable<S> entities) { return Collections.emptyList(); }
        @Override public Optional<Factura> findById(Integer integer) { return Optional.empty(); }
        @Override public boolean existsById(Integer integer) { return false; }
        @Override public List<Factura> findAll() { return Collections.emptyList(); }
        @Override public List<Factura> findAllById(Iterable<Integer> integers) { return Collections.emptyList(); }
        @Override public long count() { return 0; }
        @Override public void deleteById(Integer integer) {}
        @Override public void delete(Factura entity) {}
        @Override public void deleteAllById(Iterable<? extends Integer> integers) {}
        @Override public void deleteAll(Iterable<? extends Factura> entities) {}
        @Override public void deleteAll() {}
        @Override public List<Factura> findAll(Sort sort) { return Collections.emptyList(); }
        @Override public Page<Factura> findAll(Pageable pageable) { return Page.empty(); }
    }

    public static class StubFacturaDetalleRepository implements FacturaDetalleRepository {
        @Override
        public List<FacturaDetalleReporteDTO> obtenerReporteDetalleFacturas() {
            return List.of(new FacturaDetalleReporteDTO(
                    new Date(), "Diego", "Girón", "Guantes de Cuero", 4, new BigDecimal("42.00"), new BigDecimal("168.00")
            ));
        }
        @Override public void flush() {}
        @Override public <S extends FacturaDetalle> S saveAndFlush(S entity) { return entity; }
        @Override public <S extends FacturaDetalle> List<S> saveAllAndFlush(Iterable<S> entities) { return Collections.emptyList(); }
        @Override public void deleteAllInBatch(Iterable<FacturaDetalle> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<Integer> integers) {}
        @Override public void deleteAllInBatch() {}
        @Override public FacturaDetalle getOne(Integer integer) { return null; }
        @Override public FacturaDetalle getById(Integer integer) { return null; }
        @Override public FacturaDetalle getReferenceById(Integer integer) { return null; }
        @Override public <S extends FacturaDetalle> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends FacturaDetalle> List<S> findAll(Example<S> example) { return Collections.emptyList(); }
        @Override public <S extends FacturaDetalle> List<S> findAll(Example<S> example, Sort sort) { return Collections.emptyList(); }
        @Override public <S extends FacturaDetalle> Page<S> findAll(Example<S> example, Pageable pageable) { return Page.empty(); }
        @Override public <S extends FacturaDetalle> long count(Example<S> example) { return 0; }
        @Override public <S extends FacturaDetalle> boolean exists(Example<S> example) { return false; }
        @Override public <S extends FacturaDetalle, R> R findBy(Example<S> example, Function<FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends FacturaDetalle> S save(S entity) { return entity; }
        @Override public <S extends FacturaDetalle> List<S> saveAll(Iterable<S> entities) { return Collections.emptyList(); }
        @Override public Optional<FacturaDetalle> findById(Integer integer) { return Optional.empty(); }
        @Override public boolean existsById(Integer integer) { return false; }
        @Override public List<FacturaDetalle> findAll() { return Collections.emptyList(); }
        @Override public List<FacturaDetalle> findAllById(Iterable<Integer> integers) { return Collections.emptyList(); }
        @Override public long count() { return 0; }
        @Override public void deleteById(Integer integer) {}
        @Override public void delete(FacturaDetalle entity) {}
        @Override public void deleteAllById(Iterable<? extends Integer> integers) {}
        @Override public void deleteAll(Iterable<? extends FacturaDetalle> entities) {}
        @Override public void deleteAll() {}
        @Override public List<FacturaDetalle> findAll(Sort sort) { return Collections.emptyList(); }
        @Override public Page<FacturaDetalle> findAll(Pageable pageable) { return Page.empty(); }
    }

    @BeforeEach
    void setUp() {
        reporteService = new ReporteService(new StubArticuloRepository(), new StubFacturaRepository(), new StubFacturaDetalleRepository());
    }

    @Test
    void testObtenerArticulosConCategoria() {
        List<ArticuloCategoriaDTO> lista = reporteService.obtenerArticulosConCategoria();
        assertNotNull(lista);
        assertEquals(1, lista.size());
        assertEquals("Herramientas Manuales", lista.get(0).getNombreCategoria());
    }

    @Test
    void testObtenerFacturasPorCliente() {
        List<FacturaClienteDTO> lista = reporteService.obtenerFacturasPorCliente();
        assertNotNull(lista);
        assertEquals(1, lista.size());
        assertEquals("Diego", lista.get(0).getNombreCliente());
    }

    @Test
    void testObtenerReporteDetalleFacturas() {
        List<FacturaDetalleReporteDTO> lista = reporteService.obtenerReporteDetalleFacturas();
        assertNotNull(lista);
        assertEquals(1, lista.size());
        assertEquals("Guantes de Cuero", lista.get(0).getNombreArticulo());
    }
}
