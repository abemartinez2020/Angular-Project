import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from 'src/app/types/product';
import { PricePoints } from 'src/app/types/pricePoints';
import { ProductService } from 'src/app/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Filters } from 'src/app/types/filters';
import { max } from 'rxjs';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements OnInit {
  displayedColumns!: string[];
  dataSource!: any; //need to make sure the type works.
  // dataSourceOriginal!: any;
  pricePoints: PricePoints = {
    min: 0,
    mid: 0,
    max: 0,
  };

  filters: Filters = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
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
      this.productService.getProducts().subscribe((products) => {
        this.dataSource = new MatTableDataSource(products);
        this.getPricePointRanges(products);
        this.dataSource.paginator = this.paginator;
        this.displayedColumns = ['productName', 'price', 'isAvailable'];
      });
    }
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

  public getByFilters(filterValue: any): void {
    if (typeof filterValue === 'string' && filterValue.length > 0) {
      this.filters.productName = filterValue;
    }
    if (typeof filterValue === 'string' && filterValue.length === 0) {
      this.filters.productName = undefined;
    }
    if (
      typeof filterValue === 'boolean' ||
      typeof filterValue === 'undefined'
    ) {
      this.filters.isAvailable = filterValue;
    }
    console.log(this.filters);
    this.updateParams(this.filters);
    this.productService
      .getFilteredData(this.filters)
      .subscribe((products) => (this.dataSource = products));
  }
}
