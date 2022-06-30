import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from 'src/app/types/product';
import { ProductService } from 'src/app/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Filters } from 'src/app/types/filters';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements OnInit {
  displayedColumns!: string[];
  dataSource!: any; //need to make sure the type works.
  // dataSourceOriginal!: any;

  filters: Filters = {
    productName: '',
  };

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
        this.dataSource.paginator = this.paginator;
        this.displayedColumns = ['productName', 'price', 'isAvailable'];
      });
    }
  }

  updateParams(filters: Filters) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: filters,
      queryParamsHandling: 'merge',
    });
  }

  getByFilters(filterValue: any): void {
    if (typeof filterValue === 'string') {
      console.log('hello name');
      this.filters.productName = filterValue;
    }
    if (typeof filterValue === 'boolean') {
      console.log('hello boolean', filterValue);
      this.filters.isAvailable = filterValue;
    }
    this.updateParams(this.filters);
    this.productService
      .getFilteredData(this.filters)
      .subscribe((products) => (this.dataSource = products));
  }
}
