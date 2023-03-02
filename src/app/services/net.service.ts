import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Transaction } from '../models';

const BaseURL = environment.serverURL;
@Injectable({
  providedIn: 'root'
})
export class NetService {
  constructor(private http: HttpClient) { }

  parseFile(file: File): Observable<Transaction[]> {
    console.log(file);
    
    return this.http.post<Transaction[]>( `${BaseURL}/parse-file` ,file)
  }
}
