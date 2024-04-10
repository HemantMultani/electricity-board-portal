import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConnectionRequestService } from './connection-request.service';

@Component({
  selector: 'app-connection-request',
  templateUrl: './connection-request.component.html',
  styleUrls: ['./connection-request.component.css']
})
export class ConnectionRequestComponent implements OnInit {

  showPopup: boolean = false;
  selectedRowData: any;
  paginationPageSize = 10;
  defaultColDef:any;
  searchQuery: any;
  fromDate: string = "";
  toDate: string = "";
  rowData: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private connectionRequestService: ConnectionRequestService
    ) {
    // Define default column definitions
    this.defaultColDef = {
      flex: 1,
      minWidth: 100,
      filter: true,
      sortable: true
    };
  }

  ngOnInit(): void {
    // Load data on component initialization
    this.loadData();
  }

  // Method to fetch data from the server
  loadData(): void {
    this.connectionRequestService.getApplications().subscribe((data: any) => {
      this.rowData = data;
      console.log(this.rowData);
    });
  }

  // Method to bind selected row data
  bindSelectedRowColData(rowData:any){
    this.selectedRowData = rowData;
  }

  // Method to handle popup close event
  onClosePopup(showPopup: any): void {
    this.showPopup = showPopup;

    console.log('emitted value caught in parent');
    console.log(this.showPopup);
    this.cdr.detectChanges();
  }

  // Method to handle search operation
  search(): void {
    console.log('Search Query:', this.searchQuery);
    if (this.searchQuery === null || this.searchQuery === '') {
      this.loadData();
    } else {
        this.connectionRequestService.getApplicationById(this.searchQuery).subscribe((data: any) => {
            console.log('Search Result: ', data);
            this.rowData = [data];
            console.log(this.rowData);
        });
    }
  }

  // Method to apply filters and fetch data accordingly
  apply(): void {
    console.log('From Date:', this.fromDate);
    console.log('To Date:', this.toDate);
    this.connectionRequestService.getApplications(this.fromDate, this.toDate).subscribe((data: any) => {
      this.rowData = data;
      console.log(this.rowData);
    });
  }

  // Define column definitions for ag-grid
  columnDefs : any[] =  [
    {
      // Actions column
      headerName: 'Actions',
      cellRenderer: (params:any) => {
        let that=this;
        const button = document.createElement('button');
        button.innerHTML = 'Edit';
        button.onclick = function() {
          const rowData = params.data;
          console.log("RowLevelData"+rowData);
          console.log(rowData);
          that.bindSelectedRowColData(rowData);
          that.showPopup = true;
          console.log('Delete button clicked');
          console.log(that.showPopup);
          that.cdr.detectChanges();
        };
        return button;
    },
      width: 100,
      sortable: false,
      filter: false,
      pinned:'left'
    },
    // Define column definitions
    { headerName: 'ID', field: 'ID' },
    { headerName: 'Applicant Name', field: 'Applicant_Name' },
    { headerName: 'Gender', field: 'Gender' },
    { headerName: 'City', field: 'District' },
    { headerName: 'State', field: 'State' },
    { headerName: 'Pincode', field: 'Pincode' },
    { headerName: 'Ownership', field: 'Ownership' },
    { headerName: 'GovtID Type', field: 'GovtID_Type' },
    { headerName: 'ID Number', field: 'ID_Number' },
    { headerName: 'Category', field: 'Category' },
    { headerName: 'Load Applied', field: 'Load_Applied' },
    { headerName: 'Date of Application', field: 'Date_of_Application' },
    { headerName: 'Date of Approval', field: 'Date_of_Approval' },
    { headerName: 'Modified Date', field: 'Modified_Date' },
    { headerName: 'Status', field: 'Status' },
    { headerName: 'Reviewer ID', field: 'Reviewer_ID' },
    { headerName: 'Reviewer Name', field: 'Reviewer_Name' },
    { headerName: 'Reviewer Comments', field: 'Reviewer_Comments' },
  ];

  reset() {
    this.loadData();
    this.searchQuery = null;
    this.fromDate = "";
    this.toDate = "";
  }
}
