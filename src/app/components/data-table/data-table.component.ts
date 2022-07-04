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
    page: 0,
    size: 5,
  };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['page']) {
        console.log('page');
        this.filters.page = Number(params['page']);
        this.filters.size = Number(params['size']);
        if (params['price_gte'] && params['price_lte']) {
          this.filters.price_gte = Number(params['price_gte']);
          this.filters.price_lte = Number(params['price_lte']);
          console.log('here');
        }
        if (params['productName']) {
          this.filters.productName = params['productName'];
        }
        if (params['isAvailable']) {
          this.filters.isAvailable = params['isAvailable'] === 'true';
          console.log(this.filters.isAvailable);
        }
        this.updateDashboard();
      }
    });
    this.updateDashboard();
  }

  private updateDashboard() {
    this.productService.getFilteredData(this.filters).subscribe((response) => {
      this.configureData(response);
      console.log('called', this.filters);
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
    this.productService
      .getFilteredData(this.filters)
      .subscribe((response) => this.configureData(response));
    this.filters.page = 0;
  }

  public getByPriceRange(filterValue: PriceRange): void {
    this.filters.price_gte = filterValue.minPrice;
    this.filters.price_lte = filterValue.maxPrice;

    this.updateParams(this.filters);
    this.productService
      .getFilteredData(this.filters)
      .subscribe((response) => this.configureData(response));
    this.filters.page = 0;
  }

  public getByAvailability(filterValue: boolean | undefined): void {
    this.filters.isAvailable = filterValue;

    this.updateParams(this.filters);
    this.productService
      .getFilteredData(this.filters)
      .subscribe((response) => this.configureData(response));
    this.filters.page = 0;
  }

  public onPaginateChange(event: PageEvent) {
    console.log('page change');
    this.filters.page = event.pageIndex + 1;
    this.filters.size = event.pageSize;
    this.updateParams(this.filters);
    this.productService
      .getFilteredData(this.filters)
      .subscribe((response) => this.configureData(response));
  }

  updatePages() {
    this.productService
      .getFilteredData(this.filters)
      .subscribe((response) => this.configureData(response));
  }
}
