import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  // Dropdown settings for ng-multiselect-dropdown
  dropdownSettings: IDropdownSettings = {};

  // View dimensions for ngx-charts-bar-vertical
  view: [number, number] = [700, 400];

  // Boolean flags for showing/hiding axis, gradient, and legend
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;

  // Axis labels for the chart
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Connection Requests';

  // Array to store chart data
  chartData: any[] = [];

  // Arrays for dropdown list and selected items
  dropdownList: string[] = [];
  selectedItems: string[] = [];

  // Arrays for years list and selected year
  yearsList: number[] = [];
  selectedYear: number = 2021;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    // Initialization logic executed when component is loaded

    // Fetch monthly application counts
    this.fetchMonthlyApplicationCounts();

    // Dropdown settings configuration
    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
  }

  // Fetch monthly application counts from the service
  fetchMonthlyApplicationCounts(): void {
    this.dashboardService.getMonthlyApplicationCounts(this.selectedYear, this.selectedItems).subscribe(
        (response: any) => {
          // Success callback
          console.log(response);

          // Update chart data, dropdown list, and years list
          this.chartData = response.data;
          this.dropdownList = response.statuses;
          this.yearsList = response.years;
        },
        (error: any) => {
          // Error callback
          console.error(error);
        }
    );
  }
  
  // Event handler for selecting all items in the dropdown
  onSelectAll(items: any) {
    this.fetchMonthlyApplicationCounts();
  }

  // Event handler for selecting/deselecting an item in the dropdown
  onItemSelect(item: any) {
    this.fetchMonthlyApplicationCounts();
  }
  
  // Event handler for selecting a year
  onYearSelect(event: any) {
    this.fetchMonthlyApplicationCounts();
  }
}
