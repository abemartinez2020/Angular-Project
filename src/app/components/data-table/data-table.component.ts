import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { Product } from 'src/app/types/product';
import { PricePoints } from 'src/app/types/pricePoints';
import { PriceRange } from 'src/app/types/priceRange';
import { ProductService } from 'src/app/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Filters } from 'src/app/types/filters';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements OnInit {
  length: number | undefined = undefined;
  displayedColumns: string[] = ['productName', 'price', 'isAvailable'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource();
  page!: PageEvent;
  pricePoints: PricePoints = {
    min: 0,
    mid: 235,
    max: 470,
  };

  filters: Filters = {};

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const query = new URLSearchParams(location.search);
    this.filters.page = query.get('page') ? Number(query.get('page')) : 0;
    this.filters.size = query.get('size') ? Number(query.get('size')) : 5;

    if (typeof query.get('productName') === 'string') {
      this.filters.productName = query.get('productName') as string;
    }

    query.get('price_gte')
      ? (this.filters.price_gte = Number(query.get('price_gte')))
      : null;

    query.get('price_lte')
      ? (this.filters.price_lte = Number(query.get('price_lte')))
      : null;

    query.get('isAvailable')
      ? (this.filters.isAvailable = query.get('isAvailable') as string)
      : null;
  }

  ngOnInit(): void {
    this.updateTable();
  }

  private updateTable() {
    this.productService.getFilteredData(this.filters).subscribe((response) => {
      this.configureData(response);
    });
  }

  private configureData(response: any) {
    this.length = response.headers.get('x-total-count');
    this.dataSource.data = response.body;
  }

  private updateParams(filters: Filters) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: filters,
      queryParamsHandling: 'merge',
    });
  }

  public getByText(filterValue: string): void {
    if (typeof filterValue === 'string' && filterValue.length > 0) {
      this.filters.productName = filterValue;
    }
    if (typeof filterValue === 'string' && filterValue.length === 0) {
      this.filters.productName = undefined;
    }

    this.updateParams(this.filters);
    this.updateTable();
    this.filters.page = 0;
  }

  public getByPriceRange(filterValue: PriceRange): void {
    this.filters.price_gte = filterValue.minPrice;
    this.filters.price_lte = filterValue.maxPrice;

    this.updateParams(this.filters);
    this.updateTable();
    this.filters.page = 0;
  }

  public getByAvailability(filterValue: string): void {
    if (filterValue === '') {
      this.filters.isAvailable = undefined;
    } else {
      this.filters.isAvailable = filterValue;
    }

    this.updateParams(this.filters);
    this.updateTable();
    this.filters.page = 0;
  }

  public onPaginateChange(event: PageEvent) {
    console.log(event.pageIndex);
    this.filters.page = event.pageIndex;
    this.filters.size = event.pageSize;

    this.updateParams(this.filters);
    this.updateTable();
  }
}
