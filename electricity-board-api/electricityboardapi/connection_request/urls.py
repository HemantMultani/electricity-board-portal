from django.urls import path

from . import views

urlpatterns = [
    # path("DataInsertion", views.DataInsertion.as_view(), name="datainsertion"), #Endpoint Used to Insert Data into SQLite DB
    path('', views.ConnectionRequests.as_view(), name='ConnectionRequests'),
    path('<int:application_id>', views.ConnectionRequests.as_view(), name='ConnectionRequest'),
    path('dashboard', views.MonthlyRequestsCountView.as_view(), name='DashBoard'),
]