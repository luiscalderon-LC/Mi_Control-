
import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  // Datos temporales para diseñar la interfaz
  dineroRecibido = 350;
  totalPasajes = 125;

  get saldoDisponible(): number {
    return this.dineroRecibido - this.totalPasajes;
  }

  movimientos = [
    {
      fecha: new Date(2026, 10, 18),
      destino: 'Instituto',
      motivo: 'Ir a estudiar',
      monto: 3.50
    },
    {
      fecha: new Date(2026, 10, 18),
      destino: 'Almorzar',
      motivo: 'Salida a almorzar',
      monto: 2.00
    },
    {
      fecha: new Date(2026, 10, 18),
      destino: 'Casa',
      motivo: 'Regreso a casa',
      monto: 3.00
    }
  ];
}
