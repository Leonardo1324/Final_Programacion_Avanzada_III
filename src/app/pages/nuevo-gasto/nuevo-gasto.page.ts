import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, IonButtons, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonDatetime } from '@ionic/angular/standalone';
import { ExpenseService } from '../../services/expense-service';
import { Router } from '@angular/router';
import { Expense } from '../../models/Expense';

@Component({
  selector: 'app-nuevo-gasto',
  templateUrl: './nuevo-gasto.page.html',
  styleUrls: ['./nuevo-gasto.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonMenuButton, IonButtons, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonDatetime]
})
export class NuevoGastoPage implements OnInit {

  form: FormGroup;
  submitting = false;

  categorias: Expense['categoria'][] = ['comida', 'transporte', 'salud', 'ocio'];

  constructor(private fb: FormBuilder, private expenseService: ExpenseService, private router: Router) {
    this.form = this.fb.group({
      concepto: ['', [Validators.required, Validators.minLength(1)]],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      fecha: ['', [Validators.required]],
      categoria: ['comida']
    });
  }

  ngOnInit() {}

  get f() { return this.form.controls; }

  async submit() {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;

    const value = this.form.value;
    const newExpense = {
      concepto: value.concepto,
      categoria: value.categoria,
      monto: Number(value.monto),
      fecha: value.fecha,
      pagado: false
    } as Expense;

    newExpense.id = await this.expenseService.getNextId() as number;

    this.expenseService.createExpense(newExpense).subscribe({
      next: () => this.router.navigate(['/home']),
      error: () => {
        this.submitting = false;
      }
    });
  }

}
