import { Component } from '@angular/core';

const numOfSubjects: number = 5;
const relevantSubjects :{ date:number, storeName:number, amount:number } = { date: 0, storeName: 1, amount: 3 };
const indexRelevantSubjects = [0,1,3];

interface Transaction {
  date: Date;
  stroreName: string;
  amount: number;
  // TODO: Catagorey
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  
}
