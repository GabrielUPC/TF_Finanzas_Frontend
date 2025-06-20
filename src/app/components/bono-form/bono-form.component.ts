import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';

import { BonoService } from '../../services/bono.service';
import { LoginService } from '../../services/login.service';
import { Resultado } from '../../models/Resultado';
import { Flujo } from '../../models/Flujo';

@Component({
  selector: 'app-bono-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './bono-form.component.html',
  styleUrl: './bono-form.component.css'
})
export class BonoFormComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  resultado?: Resultado;
  flujos: Flujo[] = [];

  monedas = ['PEN', 'USD'];
  frecuencias = ['Mensual', 'Bimestral', 'Trimestral', 'Semestral', 'Anual'];
  gracias = ['Ninguna', 'Parcial', 'Total'];
  displayedColumns: string[] = ['periodo', 'fecha_pago', 'interes', 'amortizacion', 'cuotatotal', 'saldo'];

  constructor(
    private fb: FormBuilder,
    private bonoService: BonoService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      montonominal: [null, [Validators.required, Validators.min(1)]],
      moneda: ['', Validators.required],
      tasainteres: [null, [Validators.required, Validators.min(0)]],
      frecuenciapago: ['', Validators.required],
      plazomeses: [null, Validators.required],
      pgracia: ['', Validators.required],
      fechaemision: [null, Validators.required],
      idUsuario: [this.loginService.getUsuarioId()]
    });
  }

  calcular(): void {
    if (this.form.valid) {
      const id = this.loginService.getUsuarioId();
      if (!id || id === 0) {
        console.error('❌ ID de usuario inválido. Sesión expirada o token mal formado.');
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        return;
      }

      this.form.patchValue({ idUsuario: id });
      console.log('📨 Enviando para cálculo con ID usuario:', id);

      this.bonoService.previsualizar(this.form.value).subscribe(
        resp => {
          this.flujos = resp.flujos || [];
          this.resultado = resp.resultado || undefined;
          console.log('✅ Resultado recibido:', resp);
        },
        err => {
          console.error('❌ Error al calcular:', err);
          alert('Ocurrió un error al calcular el bono.');
        }
      );
    }
  }

  guardar(): void {
    if (this.form.valid && this.resultado) {
      const id = this.loginService.getUsuarioId();
      if (!id || id === 0) {
        console.error('❌ ID de usuario inválido al guardar.');
        alert('Sesión inválida. Inicia sesión nuevamente.');
        return;
      }

      this.form.patchValue({ idUsuario: id });
      console.log('💾 Guardando bono con ID usuario:', id);

      this.bonoService.registrar(this.form.value).subscribe(
        () => {
          alert('¡Bono guardado exitosamente!');
          this.form.reset();
          this.flujos = [];
          this.resultado = undefined;

          // Vuelve a setear idUsuario después del reset
          this.form.patchValue({ idUsuario: id });
        },
        err => {
          console.error('❌ Error al guardar bono:', err);
          alert('No se pudo guardar el bono. Intenta nuevamente.');
        }
      );
    } else {
      alert('Primero debes calcular y revisar los resultados antes de guardar.');
    }
  }
}
