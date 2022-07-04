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
  length = 29;
  displayedColumns!: string[];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource();
  pricePoints: PricePoints = {
    min: 0,
    mid: 0,
    max: 0,
  };

  filters: Filters = {
    page: 1,
    size: 5,
  };

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.keys.length > 0) {
      console.log(this.route.snapshot.paramMap.keys);
    } else {
      console.log(this.route.snapshot.paramMap.keys);
      this.updateParams(this.filters);
      this.productService
        .getFilteredData(this.filters)
        .subscribe((response) => {
          this.configureData(response);

          // this.dataSource.paginator = this.paginator;
          console.log(this.dataSource);
          this.displayedColumns = ['productName', 'price', 'isAvailable'];
        });
    }
  }
  private configureData(response: any) {
    this.length = response.headers.get('x-total-count');
    console.log(response);
    this.dataSource.data = response.body;

    this.getPricePointRanges(response.body);
  }

  private getPricePointRanges(data: Product[]) {
    const prices = data.map((product) => product.price);
    this.pricePoints.min = 0;
    this.pricePoints.max = Math.max(...prices);
    this.pricePoints.mid = Math.round(this.pricePoints.max / 2);
    console.log(this.pricePoints);
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
  }

  public getByPriceRange(filterValue: PriceRange): void {
    this.filters.price_gte = filterValue.minPrice;
    this.filters.price_lte = filterValue.maxPrice;

    this.updateParams(this.filters);
    this.productService
      .getFilteredData(this.filters)
      .subscribe((response) => this.configureData(response));
  }

  public getByAvailability(filterValue: boolean | undefined): void {
    this.filters.isAvailable = filterValue;

    console.log(this.filters);
    this.updateParams(this.filters);
    this.productService
      .getFilteredData(this.filters)
      .subscribe((response) => this.configureData(response));
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
}
