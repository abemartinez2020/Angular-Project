import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-and-filter-bar',
  templateUrl: './search-and-filter-bar.component.html',
  styleUrls: ['./search-and-filter-bar.component.css'],
})
export class SearchAndFilterBarComponent implements OnInit {
  @Output() onKeyed = new EventEmitter();
  @Output() onClicked = new EventEmitter();
  searchFilterForm!: FormGroup;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.searchFilterForm = this.formBuilder.group({
      searchText: '',
      minPrice: '0',
      maxPrice: '400',
      available: '',
    });
  }

  onKeyUp(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.onKeyed.emit(filterValue);
  }
  onClick(value: string[]): void {
    this.onClicked.emit(value);
  }
}
