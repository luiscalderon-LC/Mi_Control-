
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';

interface DineroMensual {
  id: number;
  mes: number;
  anio: number;
  monto: number;
  fechaRegistro: string;
  observacion: string;
}

@Component({
  selector: 'app-dinero',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './dinero.html',
  styleUrl: './dinero.scss'
})
export class Dinero implements OnInit {
  meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  registros: DineroMensual[] = [];

  mes = new Date().getMonth() + 1;
  anio = new Date().getFullYear();
  monto: number | null = null;
  observacion = '';

  editandoId: number | null = null;
  mensaje = '';
  error = '';

  ngOnInit(): void {
    this.cargarRegistros();
  }

  cargarRegistros(): void {
    try {
      const datos = localStorage.getItem('micontrol_dinero');
      this.registros = datos ? JSON.parse(datos) : [];
    } catch {
      this.registros = [];
      this.error = 'No se pudieron cargar los registros guardados.';
    }
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';

    if (!Number.isFinite(this.monto) || this.monto === null || this.monto <= 0) {
      this.error = 'Ingresa un monto válido mayor a cero.';
      return;
    }

    if (!Number.isInteger(this.anio) || this.anio < 2000 || this.anio > 2100) {
      this.error = 'Ingresa un año válido.';
      return;
    }

    const existe = this.registros.some(r =>
      r.mes === Number(this.mes) &&
      r.anio === Number(this.anio) &&
      r.id !== this.editandoId
    );

    if (existe) {
      this.error = 'Ya existe un registro para este mes y año.';
      return;
    }

    const registro: DineroMensual = {
      id: this.editandoId ?? Date.now(),
      mes: Number(this.mes),
      anio: Number(this.anio),
      monto: Number(this.monto),
      observacion: this.observacion.trim(),
      fechaRegistro: new Date().toISOString()
    };

    if (this.editandoId !== null) {
      this.registros = this.registros.map(r =>
        r.id === this.editandoId ? registro : r
      );
      this.mensaje = 'Registro actualizado correctamente.';
    } else {
      this.registros = [...this.registros, registro];
      this.mensaje = 'Dinero mensual registrado correctamente.';
    }

    this.guardarLocal();
    this.limpiarFormulario();
  }

  editar(registro: DineroMensual): void {
    this.editandoId = registro.id;
    this.mes = registro.mes;
    this.anio = registro.anio;
    this.monto = registro.monto;
    this.observacion = registro.observacion;
    this.mensaje = '';
    this.error = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: number): void {
    if (!confirm('¿Deseas eliminar este registro?')) {
      return;
    }

    this.registros = this.registros.filter(r => r.id !== id);
    this.guardarLocal();
    this.mensaje = 'Registro eliminado correctamente.';

    if (this.editandoId === id) {
      this.limpiarFormulario();
    }
  }

  guardarLocal(): void {
    try {
      localStorage.setItem(
        'micontrol_dinero',
        JSON.stringify(this.registros)
      );
    } catch {
      this.error = 'No se pudieron guardar los cambios en el navegador.';
    }
  }

  limpiarFormulario(): void {
    this.editandoId = null;
    this.mes = new Date().getMonth() + 1;
    this.anio = new Date().getFullYear();
    this.monto = null;
    this.observacion = '';
  }

  get totalRecibido(): number {
    return this.registros.reduce((total, r) => total + r.monto, 0);
  }

  nombreMes(mes: number): string {
    return this.meses[mes - 1] ?? '';
  }
}
