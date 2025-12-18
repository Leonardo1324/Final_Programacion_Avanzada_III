export interface Expense {
id: number;
concepto: string;
categoria: 'comida' | 'transporte' | 'salud' | 'ocio';
monto: number;
fecha: string;
pagado: boolean;
}

