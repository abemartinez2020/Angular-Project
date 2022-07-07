import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Filters } from 'src/app/types/filters';
import { PricePoints } from 'src/app/types/pricePoints';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';

@Component({
  selector: 'app-search-and-filter-bar',
  templateUrl: './search-and-filter-bar.component.html',
  styleUrls: ['./search-and-filter-bar.component.css'],
})
export class SearchAndFilterBarComponent implements OnInit, OnChanges {
  @Input() pricePoints!: PricePoints;
  @Output() onFiltersChange = new EventEmitter();
  @Input() params: Filters = {};

  private _activeValue = '';

  searchFilterForm = new FormGroup({
    productName: new FormControl(''),
    price_gte: new FormControl(0),
    price_lte: new FormControl(500),
    isAvailable: new FormControl(''),
  });
  constructor() {}

  ngOnInit(): void {
    this.searchFilterForm.valueChanges
      .pipe(debounceTime(200))
      .subscribe(this.onFiltersChange); //more according to rxjs ********
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let param in changes['params'].currentValue) {
      if (param !== 'page' && param !== 'size') {
        if (
          this.searchFilterForm.get(param) !==
          changes['params'].currentValue[param]
        ) {
          this.searchFilterForm.patchValue({
            [param]: changes['params'].currentValue[param],
          });
        }
      }
    }
  }

  onChange(group: any) {
    if (this._activeValue === group.value) {
      // make unchecked
      group.value = '';
      this._activeValue = '';
    } else {
      this._activeValue = group.value;
    }
  }

  onClick(group: MatButtonToggleGroup): void {
    this.onChange(group);
    this.searchFilterForm.controls['isAvailable'].setValue(this._activeValue);
  }
}
