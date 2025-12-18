import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonDatetime } from '@ionic/angular/standalone';
import { ExpenseService } from '../../services/expense-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Expense } from '../../models/Expense';

@Component({
  selector: 'app-editar-gasto',
  templateUrl: './editar-gasto.page.html',
  styleUrls: ['./editar-gasto.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonButtons, IonMenuButton, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonDatetime]
})
export class EditarGastoPage implements OnInit {

  form: FormGroup;
  submitting = false;
  expenseId: number | null = null;

  categorias: Expense['categoria'][] = ['comida', 'transporte', 'salud', 'ocio'];

  constructor(private fb: FormBuilder, private expenseService: ExpenseService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      concepto: ['', [Validators.required]],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      fecha: ['', [Validators.required]],
      categoria: ['comida']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.expenseId = Number(id);
      this.expenseService.getExpense(id).subscribe(exp => {
        this.form.patchValue({
          concepto: exp.concepto,
          monto: exp.monto,
          fecha: exp.fecha,
          categoria: exp.categoria
        });
      });
    }
  }

  get f() { return this.form.controls; }

  submit() {
    if (this.form.invalid || this.submitting || this.expenseId === null) return;
    this.submitting = true;

    const value = this.form.value;
    const updated: Expense = {
      id: this.expenseId,
      concepto: value.concepto,
      categoria: value.categoria,
      monto: Number(value.monto),
      fecha: value.fecha,
      pagado: false
    };

    this.expenseService.updateExpense(updated).subscribe({
      next: () => this.router.navigate(['/home']),
      error: () => {
        this.submitting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }

}
