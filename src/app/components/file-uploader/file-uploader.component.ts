import { Component } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ChartOptions } from 'chart.js';
import { Category, CategoryMap, Transaction, TransactionsArray } from 'src/app/models';
import { FileService } from 'src/app/services/file.service';

const CAT_MAP_KEY = 'catmap';
const CREDIT_CHARGE_DATE = 10; // *TODO: FILL FROM DOC

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent {

  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]
  categories = Object.values(Category).slice(0 , Object.values(Category).length / 2);
  currTrans: Transaction | null = null;
  displayTrans: Transaction[] = [];
  trans: Transaction[] = [];
  storeCatMap: any = {};
  showPieChart = false;
  displayKeys = false;
  currentIndex = 0;
  transArray: TransactionsArray[] = [];
  selectedMonth = 0;
  // Pie
  public pieChartOptions: ChartOptions<'pie'> = { responsive: false };
  public pieChartLabels = Object.keys(CategoryMap);
  public pieChartDatasets = [ { data: [0] } ];
  public pieChartLegend = true;
  public pieChartPlugins = [];
    
  constructor(private fileService: FileService){ }

  public chartClicked(e: any): void {
    if (e.active.length > 0) {
      const index = e.active[0].index;
      console.log(index);
    }
  }

  handleFileSelect(e: any){
    let file = this.fileService.getFile(e);
    if(!file){ // TODO: get and post to user relevant error message
      return;
    }

    //Load storeCatMap
    const catMapStr = localStorage.getItem(CAT_MAP_KEY);
    if(catMapStr){
      this.storeCatMap = JSON.parse(catMapStr);
    }

    this.fileService.parseFile(file).subscribe((trans : TransactionsArray[]) => {
      this.transArray = trans;
      this.trans = this.transArray[0]?.trans ?? [];
      this.buildDisplayTrans(this.trans);
      if(this.displayTrans.length > 0){
        this.currTrans = this.displayTrans[0];
        return;
      }
      this.buildPie();
    });
  }

  buildDisplayTrans(trans: Transaction[]) {
    this.displayTrans = [];
    for (const t of trans) {
      if(!this.displayTrans.find( dt => dt.store === t.store ) && this.storeCatMap[t.store] === undefined ){
        this.displayTrans.push(t);
      }
    }
    this.displayKeys = true;
  }

  buildPie() {
    // Build dataset
    this.pieChartDatasets[0].data.length = 0;
    for (let i = 0; i < Object.keys(CategoryMap).length - 1; i++) {
      this.pieChartDatasets[0].data.push(0);
    }

    for (const t of this.trans) {
      const catIndex: number = this.findCatIndex(this.storeCatMap[t.store] || t.category); 
      this.pieChartDatasets[0].data[catIndex] += t.price;
    }

    this.showPieChart = false;
    this.showPieChart = true;
  }

  findCatIndex(category: Category | undefined): number {
    if(!category){
      return 0;
    }

    let i = 0;
    for (const key in CategoryMap) {
        for (let j = 0; j < CategoryMap[key].length; j++) {
          if(CategoryMap[key][j] === category){
            return i;
          }
        }
        i++;
    }

    return i;
  }

  joinTrans(category: number) {
    if(this.currTrans){
      this.currTrans.category = category;
      this.storeCatMap[this.currTrans.store] =  category;
    }
    this.currTrans = this.displayTrans[++this.currentIndex];
    
    // Finish all matches build the PIE now :)
    if(this.currentIndex === this.displayTrans.length){
      localStorage.setItem( CAT_MAP_KEY ,JSON.stringify(this.storeCatMap));
      this.fillMissingCategory();
      this.buildPie();
    }
  }

  fillMissingCategory() {
    for (const t of this.trans) {
        if(!t.category){
          t.category = this.storeCatMap[t.store];
        }
    }
  }

  monthSelected(e: MatButtonToggleChange) {
    this.selectedMonth = e.value;
    this.trans = this.transArray[e.value].trans;
    this.buildPie()
  }

}
