import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/types/product';
import { ProductService } from 'src/app/product.service';

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
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      console.log(products);
      this.dataSource = new MatTableDataSource(products);
      this.displayedColumns = ['productName', 'price', 'isAvailable'];
      console.log(this.dataSource);
    });
  }

  searchFilter(value: string): void {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
    console.dir(this.dataSource.filter);
  }

  availabilityFilter(value: string[]) {
    console.log('hello');
  }
}
