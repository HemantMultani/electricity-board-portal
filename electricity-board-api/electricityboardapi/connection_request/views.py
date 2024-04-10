from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import ApplicationSerializer, MonthlyRequestsCountSerializer
from .models import Application  
import pandas as pd  #Used to read csv data and Insert it into SQLite DB

from django.db.models import Count
from django.db.models.functions import ExtractMonth
from datetime import datetime


class ConnectionRequests(APIView):
    """
    API view for managing connection requests.

    Methods: GET, PATCH

    - The `get` method supports optional date filtering with 'to_date' and 'from_date' query parameters.
    - The `patch` method validates and updates application data, with specific restrictions on certain fields.
    """
    serializer_class = ApplicationSerializer

    def get(self, request, application_id=None):
        try:
            if application_id is not None:
                # Fetch a single application by ID
                application = Application.objects.get(pk=application_id)
                serializer = self.serializer_class(application)
                return Response(serializer.data, status=status.HTTP_200_OK)

            else:
                # Fetch all applications with optional date filtering
                applications = Application.objects.all()

                to_date = request.query_params.get('to_date')
                from_date = request.query_params.get('from_date')

                if to_date and from_date:
                    # Apply date filtering if both to_date and from_date are provided
                    applications = applications.filter(Date_of_Application__range=[from_date, to_date])

                serializer = self.serializer_class(applications, many=True)

                return Response(serializer.data, status=status.HTTP_200_OK)

        except Application.DoesNotExist:
            return Response({"message": "Application not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"message": f"Error fetching data: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request):
        try:
            application_id = request.data.get('ID')
            if application_id is None:
                return Response({"message": "Application ID required"}, status=status.HTTP_400_BAD_REQUEST)
            application = Application.objects.get(pk=application_id)

            # Deserialize the existing application data
            serializer = self.serializer_class(application, data=request.data, partial=True)

            if serializer.is_valid():
                # Validate data before updating
                if 'Date_of_Application' in request.data or 'GovtID_Type' in request.data or 'ID_Number' in request.data:
                    return Response({"message": "Cannot update Date of Application, Govt ID Type, and ID Number"}, status=status.HTTP_400_BAD_REQUEST)

                if 'Load_Applied' in request.data and int(request.data['Load_Applied']) > 200:
                    return Response({"message": "Load Applied cannot exceed 200 KV"}, status=status.HTTP_400_BAD_REQUEST)

                # Perform the update
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Application.DoesNotExist:
            return Response({"message": "Application not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"message": f"Error updating data: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class MonthlyRequestsCountView(APIView):
    """
    API view for retrieving monthly counts of applications based on specified filters.

    Method: GET

    - This view extracts available years and statuses from the database.
    - Supports optional query parameters for filtering by 'year' and 'status'.
    - If 'year' is not provided, it defaults to the latest available year or the current year.
    - The response includes monthly counts of applications for the specified year and statuses.
    - Monthly connection request counts are formatted with month names and returned as a serialized response.
    """
    def get(self, request):
        try:
            # Extract available years from the database
            available_years = Application.objects.dates('Date_of_Application', 'year')
            available_years = [year.year for year in available_years]

            # Extract available status options from the database
            available_statuses = Application.objects.values_list('Status', flat=True).distinct()

            # Extract year and status from the request
            year = request.query_params.get('year', None)
            status_filters = request.query_params.getlist('status', [])

            # Set a default year if not provided
            if not year:
                latest_application = Application.objects.order_by('-Date_of_Application').first()
                if latest_application:
                    year = latest_application.Date_of_Application.year
                else:
                    year = datetime.now().year

            # Fetch month-wise total number of applications for the specified year and statuses
            queryset = Application.objects.filter(
                Date_of_Application__year=year,
            )

            if status_filters:
                queryset = queryset.filter(Status__in=status_filters)

            monthly_counts = queryset.annotate(
                name=ExtractMonth('Date_of_Application')
            ).values('name').annotate(
                value=Count('ID')
            ).order_by('name')

            # Format the month names
            for entry in monthly_counts:
                entry['name'] = datetime.strptime(str(entry['name']), "%m").strftime("%B")

            # Prepare the response data
            response_data = {
                'years': available_years,
                'statuses': available_statuses,
                'data': monthly_counts,
            }

            serializer = MonthlyRequestsCountSerializer(response_data)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": f"Error fetching data: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# API Used to Insert Data into SQLite DB
class DataInsertion(APIView):
    def get(self, request):
        df = pd.read_csv('D:/Code Repos/practice/BCG X - Case Study/Case Study Set 2/electricity_board_case_study.csv')
        try:
            df = df[1:]
            df['Date_of_Application'] = pd.to_datetime(df['Date_of_Application'], format='%d-%m-%Y').dt.date
            df['Date_of_Approval'] = pd.to_datetime(df['Date_of_Approval'], format='%d-%m-%Y').dt.date
            df['Modified_Date'] = pd.to_datetime(df['Modified_Date'], format='%d-%m-%Y').dt.date
            df.fillna('', inplace=True)

            data = df.to_dict(orient='records')
            
            for item in data:
                try:
                    Application.objects.create(**item)
                except Exception as e:
                    print(item)
                    return Response({"message": f"Error inserting data: {str(e)}----{item}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({"message": "Data inserted successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            
            return Response({"message": f"Error inserting data: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)