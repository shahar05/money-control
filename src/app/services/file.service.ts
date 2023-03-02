import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction, TransactionsArray } from '../models';
import { NetService } from './net.service';

// const DATE_TAB = 2;
// const STORE_TAB = 3;
// const PRICE_TAB = 5;

@Injectable({
  providedIn: 'root',
})
export class FileService {
  date_loc = 2;
  store_loc = 3;
  price_loc = 5;
  
  constructor(private net: NetService) {}

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

  // parseFile(file: File): Observable<Transaction[]> {
  //   return new Observable((o) => {
  //     let reader = new FileReader();
  //     reader.readAsText(file);
  //     reader.onload = (event: any) => {
  //       let t: Transaction[] = this.createTransactions(event.target);
  //       o.next(t);
  //       o.unsubscribe();
  //     };
  //   });
  // }

  sliceByChar(str: string, char: string, occurrence: number) {
    let i = 0,
      j = 0;

    while (i < str.length) {
      if (char === str.charAt(i)) {
        j++;
      }
      if (j === occurrence) {
        return str.slice(i + 1);
      }
      i++;
    }
    return str;
  }

  createTransactions(target: any): TransactionsArray[] {
    const t: TransactionsArray[] = [];  
    let text: string = this.sliceByChar(target.result, '\n', 3);
    let titles = this.getNextRaw(this.sliceByChar(target.result, '\n', 2));
    if (titles) {
      this.setTitlesIndexes(titles.raw);
    }
    

    return t;
  }

  // createTransactions(target: any): Transaction[] {
  //   const t: Transaction[] = [];
  //   // erase all text before the table
  //   let text: string = this.sliceByChar(target.result, '\n', 3);
  //   let titles = this.getNextRaw(this.sliceByChar(target.result, '\n', 2));

  //   let details: TransactionsArray = this.getTransDetails(text);

  //   if (titles) {
  //     this.setTitlesIndexes(titles.raw);
  //   }

  //   let raw = this.getNextRaw(text);
  //   let i = 0;

  //   // create Trans from current raw (until \n)
  //   while (raw) {
  //     i++;
  //     let trans: Transaction = this.createTransaction(raw.raw);
  //     t.push(trans);
  //     raw = this.getNextRaw(raw.text);
  //   }
  //   return t;
  // }

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

  createTransaction(raw: string): Transaction {
    return {
      date: this.getTransDate(raw),
      price: this.getTransPrice(raw),
      store: this.getTransStore(raw),
    };
  }

  getNthTab(raw: string, tabNum: number): string {
    let i = 0,
      j = 0,
      lastTabIndex = 0,
      currTabIndex = 0;
    while (i < raw.length) {
      if (raw.charAt(i) === '\t') {
        lastTabIndex = currTabIndex;
        currTabIndex = i;
        j++;
      }
      if (j === tabNum) {
        break;
      }
      i++;
    }

    return raw.slice(lastTabIndex, currTabIndex).replaceAll('\t', '');
  }

  getTransStore(raw: string): string {
    return this.getNthTab(raw, this.store_loc);
  }

  getTransPrice(raw: string): number {
    const price = this.getNthTab(raw, this.price_loc);
    return +price.replace(/[^0-9.]/g, '');
  }

  getTransDate(raw: string): Date {
    console.log(raw);
    let dateStr = this.getNthTab(raw, this.date_loc);
    dateStr = this.swapDate(dateStr);
    return new Date(dateStr);
  }

  swapDate(dateStr: string): string {
    let splitDate = dateStr.split('/');
    let day = splitDate[0],
      month = splitDate[1],
      year = splitDate[2];
    return month + '/' + day + '/' + year;
  }

  getNextRaw(text: string): { raw: string; text: string } | null {
    let i = 0;
    while (text.charAt(i) !== '\n') {
      i++;
      if (i === text.length) {
        return null;
      }
    }

    let raw = text.slice(0, i);
    text = text.slice(i + 1);
    return { raw, text };
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
}
