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
import { Filters } from 'src/app/types/filters';
import { PricePoints } from 'src/app/types/pricePoints';

@Component({
  selector: 'app-search-and-filter-bar',
  templateUrl: './search-and-filter-bar.component.html',
  styleUrls: ['./search-and-filter-bar.component.css'],
})
export class SearchAndFilterBarComponent implements OnInit, OnChanges {
  @Input() pricePoints!: PricePoints;
  @Output() onKeyed = new EventEmitter();
  @Output() onClicked = new EventEmitter();
  @Output() onChangedSlider = new EventEmitter();
  @Input() params: Filters = {};

  //check true or false status on isAvailable toggle-buttons
  private _activeValue = '';

  searchFilterForm = new FormGroup({
    productName: new FormControl(''),
    price_gte: new FormControl(0),
    price_lte: new FormControl(0),
    isAvailable: new FormControl(''),
  });
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['params']);
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

  onKeyUp(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;

    this.onKeyed.emit(filterValue);
  }
  onClick(group: any): void {
    this.onChange(group);
    // const isAvailable =
    //   this._activeValue === 'true'
    //     ? true
    //     : this._activeValue === 'false'
    //     ? false
    //     : undefined;

    this.onClicked.emit(this._activeValue);
  }

  onChangeSlider(
    minPrice: number | null | undefined,
    maxPrice: number | null | undefined
  ) {
    if (!maxPrice) {
      maxPrice = this.pricePoints.mid;
    }
    const priceRange = { minPrice, maxPrice };
    this.onChangedSlider.emit(priceRange);
  }
}
