
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';

interface Pasaje {
  id: number;
  fecha: string;
  destino: string;
  motivo: string;
  monto: number;
}

interface DineroMensual {
  id: number;
  mes: number;
  anio: number;
  monto: number;
}

@Component({
  selector: 'app-pasajes',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './pasajes.html',
  styleUrl: './pasajes.scss'
})
export class Pasajes implements OnInit {

  pasajes: Pasaje[] = [];
  ingresos: DineroMensual[] = [];

  fecha = this.fechaActual();
  destino = 'Instituto';
  motivo = '';
  monto: number | null = null;

  mesFiltro = new Date().getMonth() + 1;
  anioFiltro = new Date().getFullYear();

  editandoId: number | null = null;
  mensaje = '';
  error = '';

  destinos = [
    'Instituto',
    'Almorzar',
    'Casa',
    'Otro'
  ];

  meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  ngOnInit(): void {
    this.cargarDatos();
  }

  fechaActual(): string {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  cargarDatos(): void {
    try {
      this.pasajes = JSON.parse(
        localStorage.getItem('micontrol_pasajes') || '[]'
      );

      this.ingresos = JSON.parse(
        localStorage.getItem('micontrol_dinero') || '[]'
      );
    } catch {
      this.pasajes = [];
      this.ingresos = [];
      this.error = 'No se pudieron cargar los datos.';
    }
  }

  get pasajesFiltrados(): Pasaje[] {
    return this.pasajes
      .filter(p => {
        const [anio, mes] = p.fecha.split('-').map(Number);

        return mes === Number(this.mesFiltro)
          && anio === Number(this.anioFiltro);
      })
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  get dineroRecibido(): number {
    return this.ingresos
      .filter(i =>
        Number(i.mes) === Number(this.mesFiltro) &&
        Number(i.anio) === Number(this.anioFiltro)
      )
      .reduce((total, i) => total + Number(i.monto), 0);
  }

  get totalGastado(): number {
    return this.pasajesFiltrados.reduce(
      (total, p) => total + Number(p.monto), 0
    );
  }

  get saldoDisponible(): number {
    return this.dineroRecibido - this.totalGastado;
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.fecha || !this.destino) {
      this.error = 'Completa la fecha y el destino.';
      return;
    }

    if (!Number.isFinite(this.monto) ||
        this.monto === null ||
        this.monto <= 0) {
      this.error = 'Ingresa un monto válido mayor a cero.';
      return;
    }

    const [anio, mes, dia] = this.fecha.split('-').map(Number);
    const fechaValidada = new Date(anio, mes - 1, dia);

    if (
      fechaValidada.getFullYear() !== anio ||
      fechaValidada.getMonth() + 1 !== mes ||
      fechaValidada.getDate() !== dia
    ) {
      this.error = 'La fecha ingresada no es válida.';
      return;
    }

    const registro: Pasaje = {
      id: this.editandoId ?? Date.now(),
      fecha: this.fecha,
      destino: this.destino,
      motivo: this.motivo.trim(),
      monto: Number(this.monto)
    };

    const nuevosPasajes = this.editandoId !== null
      ? this.pasajes.map(p =>
          p.id === this.editandoId ? registro : p
        )
      : [...this.pasajes, registro];

    try {
      localStorage.setItem(
        'micontrol_pasajes',
        JSON.stringify(nuevosPasajes)
      );

      this.pasajes = nuevosPasajes;
      this.mesFiltro = mes;
      this.anioFiltro = anio;

      this.mensaje = this.editandoId !== null
        ? 'Pasaje actualizado correctamente.'
        : 'Pasaje registrado correctamente.';

      this.limpiarFormulario();
    } catch {
      this.error = 'No se pudo guardar el pasaje.';
    }
  }

  editar(pasaje: Pasaje): void {
    this.editandoId = pasaje.id;
    this.fecha = pasaje.fecha;
    this.destino = pasaje.destino;
    this.motivo = pasaje.motivo;
    this.monto = pasaje.monto;

    this.mensaje = '';
    this.error = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: number): void {
    if (!confirm('¿Deseas eliminar este pasaje?')) {
      return;
    }

    const nuevosPasajes = this.pasajes.filter(p => p.id !== id);

    try {
      localStorage.setItem(
        'micontrol_pasajes',
        JSON.stringify(nuevosPasajes)
      );

      this.pasajes = nuevosPasajes;
      this.mensaje = 'Pasaje eliminado correctamente.';
      this.error = '';

      if (this.editandoId === id) {
        this.limpiarFormulario();
      }
    } catch {
      this.error = 'No se pudo eliminar el pasaje.';
    }
  }

  limpiarFormulario(): void {
    this.editandoId = null;
    this.fecha = this.fechaActual();
    this.destino = 'Instituto';
    this.motivo = '';
    this.monto = null;
  }

  get cantidadViajes(): number {
    return this.pasajesFiltrados.length;
  }
}
