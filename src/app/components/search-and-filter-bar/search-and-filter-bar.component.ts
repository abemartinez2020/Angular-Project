import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PricePoints } from 'src/app/types/pricePoints';

@Component({
  selector: 'app-search-and-filter-bar',
  templateUrl: './search-and-filter-bar.component.html',
  styleUrls: ['./search-and-filter-bar.component.css'],
})
export class SearchAndFilterBarComponent implements OnInit {
  @Input() pricePoints!: PricePoints;
  @Output() onKeyed = new EventEmitter();
  @Output() onClicked = new EventEmitter();
  searchFilterForm!: FormGroup;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.searchFilterForm = this.formBuilder.group({
      productName: '',
      minPrice: '0',
      maxPrice: '0',
      available: '',
    });
  }
  private _activeValue = '';

  onChange(group: any) {
    if (this._activeValue === group.value) {
      // make unchecked
      group.value = '';
      this._activeValue = '';
    } else {
      this._activeValue = group.value;
    }
  }

  onKeyUp(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.onKeyed.emit(filterValue);
  }
  onClick(group: any): void {
    this.onChange(group);
    const isAvailable =
      this._activeValue === 'true'
        ? true
        : this._activeValue === 'false'
        ? false
        : undefined;

    this.onClicked.emit(isAvailable);
  }
}
