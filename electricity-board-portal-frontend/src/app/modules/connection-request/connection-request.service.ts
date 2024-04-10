import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionRequestService {
  private apiUrl = 'http://127.0.0.1:8000/connection-request/';

  // Define HTTP headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Method to retrieve applications with optional date filters
  getApplications(fromDate?: string, toDate?: string): Observable<any> {
    let params = new HttpParams()

    if (fromDate && toDate) {
        params = params.append('from_date', fromDate);
        params = params.append('to_date', toDate);
    }
    // Construct the full URL with query parameters
    const fullUrl = `${this.apiUrl}?${params.toString()}`;
    // console.log(`Full URL: ${fullUrl}`);

    return this.http.get(`${this.apiUrl}`, { params });
  }
  
  // Method to retrieve an application by ID
  getApplicationById(applicationId: number|null): Observable<any> {
    return this.http.get(`${this.apiUrl}${applicationId}`);
  }

  // Method to update an application
  updateApplication(updateData: any): Observable<any> {
    return this.http.patch(this.apiUrl, updateData, this.httpOptions);
  }
}
