import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { filter, Observable } from 'rxjs';
import { Product } from './types/product';
import { Filters } from './types/filters';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  params: new HttpParams(),
};

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private API_URL =
    'https://my-json-server.typicode.com/fernandoAlonsoV/AngularProjectMockedData/products';
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL);
  }
  getFilteredData(filters: Filters): Observable<Product[]> {
    let queryString = '?';
    console.log('hey')

    if (filters.productName) {
      queryString += `productName_like=${filters.productName}`;
    } else {
      queryString;
    }

    if (filters.price_gte && filters.price_lte) {
      queryString += `&price_gte=${filters.price_gte}&price_lte=${filters.price_lte}`;
    }

    if (typeof filters.isAvailable === 'boolean') {
      queryString += `&isAvailable=${filters.isAvailable}`;
    }
    console.log(queryString);

    return this.http.get<Product[]>(this.API_URL + queryString);
  }
}
