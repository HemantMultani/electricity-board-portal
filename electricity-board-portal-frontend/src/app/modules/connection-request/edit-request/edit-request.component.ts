import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConnectionRequestService } from '../connection-request.service';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.css']
})
export class EditRequestComponent implements OnInit {

  // Input property to receive data for editing
  @Input() rowLevelData: any;
  // Event emitter to notify the parent component about popup closure
  @Output() closePopupEvent = new EventEmitter<boolean>();

  // Boolean flag to control the visibility of the popup
  showPopup:boolean = true;

  constructor(private connectionRequestService: ConnectionRequestService) { }

  ngOnInit(): void {
    console.log("Popup"+this.rowLevelData);
  }

  // Method to handle form submission for updating application data
  onSubmit(){
    const updatedData = {
      // Prepare updated data object with existing properties
      ID: this.rowLevelData.ID,
      Applicant_Name: this.rowLevelData.Applicant_Name,
      Gender: this.rowLevelData.Gender,
      District: this.rowLevelData.District,
      State: this.rowLevelData.State,
      Pincode: this.rowLevelData.Pincode,
      Ownership: this.rowLevelData.Ownership,
      Category: this.rowLevelData.Category,
      Load_Applied: this.rowLevelData.Load_Applied,
      Date_of_Approval: this.rowLevelData.Date_of_Approval,
      Modified_Date: this.rowLevelData.Modified_Date,
      Status: this.rowLevelData.Status,
      Reviewer_ID: this.rowLevelData.Reviewer_ID,
      Reviewer_Name: this.rowLevelData.Reviewer_Name,
      Reviewer_Comments: this.rowLevelData.Reviewer_Comments
    };
    // Send the updated data to the service for updating the application
    this.connectionRequestService.updateApplication(updatedData).subscribe({
      next: (response) => console.log('Update successful', response),
      error: (error) => console.error('There was an error!', error)
    });
    this.closePopup();
  }

  // Method to handle popup closure
  closePopup(): void {
    console.log('value emitted ');
    // Set showPopup flag to false to hide the popup
    this.showPopup=false;
    // Emit an event to notify the parent component about the popup closure
    this.closePopupEvent.emit(this.showPopup);
  }
}
