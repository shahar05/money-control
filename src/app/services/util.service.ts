import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() {}

  // Slice string from selected char and occurrence
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

  // Getting next raw (until \n) and return also rest the of text
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

  // Getting the details (string) between s Tab & the next one 
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

}
