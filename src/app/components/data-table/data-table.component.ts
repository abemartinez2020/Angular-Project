import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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

  pricePoints: PricePoints = {
    min: 0,
    mid: 235,
    max: 470,
  };

  filters: Filters = {
    // page: 0,
    // size: 5,
    // productName: 'car',
    // price_gte: 77,
    // price_lte: 250,
    // isAvailable: 'false',
  };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params) => {
        console.log('executing in queryParam');

        this.filters.page = params['page'] ? Number(params['page']) : 0;
        this.filters.size = params['size'] ? Number(params['size']) : 5;

        params['price_gte']
          ? (this.filters.price_gte = Number(params['price_gte']))
          : null;

        params['price_lte']
          ? (this.filters.price_lte = Number(params['price_lte']))
          : null;

        params['productName']
          ? (this.filters.productName = params['productName'])
          : null;

        params['isAvailable']
          ? (this.filters.isAvailable = params['isAvailable'])
          : null;

        this.updateDashboard();
      },
      (error) => console.log('something went wrong', error)
    );
  }

  private updateDashboard() {
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
    // this.productService
    //   .getFilteredData(this.filters)
    //   .subscribe((response) => this.configureData(response));
    this.filters.page = 0;
  }

  public getByPriceRange(filterValue: PriceRange): void {
    this.filters.price_gte = filterValue.minPrice;
    this.filters.price_lte = filterValue.maxPrice;

    this.updateParams(this.filters);
    // this.productService
    //   .getFilteredData(this.filters)
    //   .subscribe((response) => this.configureData(response));
    this.filters.page = 0;
  }

  public getByAvailability(filterValue: string | undefined): void {
    this.filters.isAvailable = filterValue;

    this.updateParams(this.filters);
    // this.productService
    //   .getFilteredData(this.filters)
    //   .subscribe((response) => this.configureData(response));
    this.filters.page = 0;
  }

  public onPaginateChange(event: PageEvent) {
    this.filters.page = event.pageIndex + 1;
    this.filters.size = event.pageSize;
    this.updateParams(this.filters);
    // this.productService
    //   .getFilteredData(this.filters)
    //   .subscribe((response) => this.configureData(response));
  }
}
