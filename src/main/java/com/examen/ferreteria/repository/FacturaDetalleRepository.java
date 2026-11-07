package com.examen.ferreteria.repository;

import com.examen.ferreteria.dto.FacturaDetalleReporteDTO;
import com.examen.ferreteria.entity.FacturaDetalle;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FacturaDetalleRepository extends JpaRepository<FacturaDetalle, Integer> {

    @Query("SELECT new com.examen.ferreteria.dto.FacturaDetalleReporteDTO(" +
           "f.fechaFactura, c.nombre, c.apellido, a.nombre, fd.cantidad, fd.precioUnitario, fd.subtotal) " +
           "FROM FacturaDetalle fd " +
           "JOIN fd.idFactura f " +
           "JOIN f.idCliente c " +
           "JOIN fd.idArticulo a " +
           "WHERE f.estado = true " +
           "ORDER BY f.fechaFactura ASC, fd.idFacturaDetalle ASC")
    List<FacturaDetalleReporteDTO> obtenerReporteDetalleFacturas();
}
