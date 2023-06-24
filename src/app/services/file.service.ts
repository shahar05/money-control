import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction, TransactionsArray } from '../models';
import { NetService } from './net.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  date_loc = 2;
  store_loc = 3;
  price_loc = 5;
  
  constructor(private util: UtilService) {}

  parseFile(file: File): Observable<TransactionsArray[]> {
    return new Observable((o) => {
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event: any) => {
        let t: TransactionsArray[] = this.createTransactions(event.target);
        o.next(t);
        o.unsubscribe();
      };
    });
  }


  initTransArray(): TransactionsArray[]{
    const t: TransactionsArray[] = [];  
    for (let i = 1; i <= 12; i++) {
      t.push({month: i, trans: []});
    }
    return t;
  }  

  createTransactions(target: any): TransactionsArray[] {
    const t: TransactionsArray[] = this.initTransArray();
    let text: string = this.util.sliceByChar(target.result, '\n', 3);
    let titles = this.util.getNextRaw(this.util.sliceByChar(target.result, '\n', 2));
    if (titles) {
      this.setTitlesIndexes(titles.raw);
    }
    let raw = this.util.getNextRaw(text);
    let i = 0;

    while (raw) {
      i++;
      let trans: Transaction = this.createTransaction(raw.raw);
      t[trans.date.getMonth()].trans.push(trans);
      raw = this.util.getNextRaw(raw.text);
    }
    
    return t;
  }
  

  getTransDetails(text: string): TransactionsArray {
    const details: TransactionsArray = {creditCard: 0 ,month:0 , trans:[]};

    return details;
  }

  setTitlesIndexes(titlesRaw: string) {
    const date = 'תאריך העסקה';
    const price = 'סכום החיוב';
    const store = 'שם בית העסק';
    let tabLocation = 1;
    let i = 0, j = 0;
    while (i < titlesRaw.length) {
      if (titlesRaw.charAt(i) === '\t') {
        switch (titlesRaw.slice(j, i)) {
          case date:
            this.date_loc = tabLocation;
            break;
          case price:
            this.price_loc = tabLocation;
            break;
          case store:
            this.store_loc = tabLocation;
            break;
          default:
            break;
        }
        tabLocation++;
        j = i + 1;
      }
      i++;
    }
  }

  swapDate(dateStr: string): string {
    let splitDate = dateStr.split('/');
    let day = splitDate[0],
      month = splitDate[1],
      year = splitDate[2];
    return month + '/' + day + '/' + year;
  }

  getFile(e: any): File | null {
    if (!e?.target?.files) {
      return null;
    }
    if (e?.target?.files.length > 1) {
      return null;
    }
    let file: File = e?.target?.files[0]; // FileList object

    if (!file) {
      return null;
    }
    return file;
  }

  createTransaction(raw: string): Transaction {
    return {
      date: this.getTransDate(raw),
      price: this.getTransPrice(raw),
      store: this.getTransStore(raw),
    };
  }

  getTransStore(raw: string): string {
    return this.util.getNthTab(raw, this.store_loc);
  }

  getTransPrice(raw: string): number {
    const price = this.util.getNthTab(raw, this.price_loc);
    return +price.replace(/[^0-9.]/g, '');
  }

  getTransDate(raw: string): Date {
    let dateStr = this.util.getNthTab(raw, this.date_loc);
    dateStr = this.swapDate(dateStr);
    return new Date(dateStr);
  }
}
