package com.examen.ferreteria.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

public class FacturaClienteDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String nombreCliente;
    private String apellidoCliente;
    private String nit;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "America/Guatemala")
    private Date fechaFactura;

    private BigDecimal total;

    public FacturaClienteDTO() {
    }

    public FacturaClienteDTO(String nombreCliente, String apellidoCliente, String nit, Date fechaFactura, BigDecimal total) {
        this.nombreCliente = nombreCliente;
        this.apellidoCliente = apellidoCliente;
        this.nit = nit;
        this.fechaFactura = fechaFactura;
        this.total = total;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public String getApellidoCliente() {
        return apellidoCliente;
    }

    public void setApellidoCliente(String apellidoCliente) {
        this.apellidoCliente = apellidoCliente;
    }

    public String getNit() {
        return nit;
    }

    public void setNit(String nit) {
        this.nit = nit;
    }

    public Date getFechaFactura() {
        return fechaFactura;
    }

    public void setFechaFactura(Date fechaFactura) {
        this.fechaFactura = fechaFactura;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
