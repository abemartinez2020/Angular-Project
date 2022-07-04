import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { filter, Observable } from 'rxjs';
import { Product } from './types/product';
import { Filters } from './types/filters';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json',
//     observe: 'reponse',
//   }),
// };

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private API_URL =
    'https://my-json-server.typicode.com/fernandoAlonsoV/AngularProjectMockedData/products';
  constructor(private http: HttpClient) {}

  getFilteredData(filters: Filters): Observable<any> {
    let queryString = `?_page=${filters.page}&_limit=${filters.size}`;

    if (filters.productName) {
      queryString += `&productName_like=${filters.productName}`;
    }

    if (filters.price_lte) {
      queryString += `&price_gte=${filters.price_gte}&price_lte=${filters.price_lte}`;
    }

    if (typeof filters.isAvailable === 'boolean') {
      queryString += `&isAvailable=${filters.isAvailable}`;
    }
    console.log(queryString);

    return this.http.get<any>(this.API_URL + queryString, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      observe: 'response',
    });
  }
}
