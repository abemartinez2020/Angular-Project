import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-and-filter-bar',
  templateUrl: './search-and-filter-bar.component.html',
  styleUrls: ['./search-and-filter-bar.component.css'],
})
export class SearchAndFilterBarComponent implements OnInit {
  @Output() onKeyed = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onKeyUp(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.onKeyed.emit(filterValue);
  }
}
