import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://127.0.0.1:8000/connection-request/dashboard';

  constructor(private http: HttpClient) {}

  // Method to fetch monthly application counts
  // year: the year for which application counts are requested
  // statuses: optional parameter, array of statuses to filter the counts (if provided)
  getMonthlyApplicationCounts(year: number, statuses?: string[]): Observable<any> {

    let params = new HttpParams().set('year', year.toString());

    if(statuses){statuses.forEach((status) => {
      params = params.append('status', status);
    });}

    return this.http.get<any>(this.apiUrl, { params });
  }
}
