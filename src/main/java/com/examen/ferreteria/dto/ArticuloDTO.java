package com.examen.ferreteria.dto;

import java.io.Serializable;
import java.math.BigDecimal;

public class ArticuloDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer idArticulo;
    private String nombre;
    private String marca;
    private BigDecimal precio;
    private Integer stock;
    private Boolean estado;
    private String categoriaNombre;

    public ArticuloDTO() {
    }

    public ArticuloDTO(Integer idArticulo, String nombre, String marca, BigDecimal precio, Integer stock, Boolean estado, String categoriaNombre) {
        this.idArticulo = idArticulo;
        this.nombre = nombre;
        this.marca = marca;
        this.precio = precio;
        this.stock = stock;
        this.estado = estado;
        this.categoriaNombre = categoriaNombre;
    }

    public Integer getIdArticulo() {
        return idArticulo;
    }

    public void setIdArticulo(Integer idArticulo) {
        this.idArticulo = idArticulo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public String getCategoriaNombre() {
        return categoriaNombre;
    }

    public void setCategoriaNombre(String categoriaNombre) {
        this.categoriaNombre = categoriaNombre;
    }
}
