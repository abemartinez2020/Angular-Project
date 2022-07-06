import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from './types/product';
import { Filters } from './types/filters';
import { ProductData } from './types/productData';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private API_URL =
    'https://my-json-server.typicode.com/fernandoAlonsoV/AngularProjectMockedData/products';
  constructor(private http: HttpClient) {}

  getFilteredData(filters: Filters): Observable<ProductData> {
    let queryString = `?_page=${filters.page}&_limit=${filters.size}`;

    if (filters.productName) {
      queryString += `&productName_like=^${filters.productName}`;
    }

    if (filters.price_lte) {
      queryString += `&price_gte=${filters.price_gte}&price_lte=${filters.price_lte}`;
    }

    if (filters.isAvailable === 'true' || filters.isAvailable == 'false') {
      queryString += `&isAvailable=${filters.isAvailable}`;
    }

    return this.http
      .get<Product[]>(this.API_URL + queryString, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        observe: 'response',
      })
      .pipe(
        map((response) => ({
          products: response.body,
          productCount: Number(response.headers.get('x-total-count')),
        }))
      );
  }
}
