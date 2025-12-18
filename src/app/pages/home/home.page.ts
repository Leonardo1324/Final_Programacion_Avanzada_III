import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonBadge, IonButton, IonIcon, IonRefresherContent, IonRefresher } from '@ionic/angular/standalone';
import { ExpenseService } from '../../services/expense-service';
import { Expense } from '../../models/Expense';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonBadge, IonButton, IonRefresherContent, IonRefresher]
})
export class HomePage implements OnInit {

  expenses: Expense[] = [];

  constructor(private expenseService: ExpenseService, private alertCtrl: AlertController, private router: Router) { }

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe(data => {
      // ordenar por fecha (más reciente primero)
      this.expenses = (data || []).slice().sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    });
  }

  categoryClass(cat: Expense['categoria']) {
    return 'cat-' + cat;
  }

  editExpense(e: Expense) {
    this.router.navigate(['/editar-gasto'], { queryParams: { id: e.id } });
  }

  async confirmDelete(e: Expense) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Eliminar "${e.concepto}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: () => this.deleteExpense(e.id) }
      ]
    });

    await alert.present();
  }

  deleteExpense(id: number) {
    this.expenseService.deleteExpense(String(id)).subscribe({
      next: () => {
        this.expenses = this.expenses.filter(x => x.id !== id);
      },
      error: () => {
      }
    });
  }

  //logica agregar un boton para recargar pagina deslizando 
  doRefresh(event: any) {
    this.loadExpenses();  
    event.target.complete();
  }

}
