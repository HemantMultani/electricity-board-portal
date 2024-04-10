from django.db import models


# Connection Request Application Model
class Application(models.Model):
    MALE = 'M'
    FEMALE = 'F'
    OTHERS = 'O'
    GENDER_CHOICES = [
        (MALE, 'Male'),
        (FEMALE, 'Female'),
        (OTHERS, 'Others'),
    ]
    ID = models.IntegerField(primary_key=True)
    Applicant_Name = models.CharField(max_length=100)
    Gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    District = models.CharField(max_length=100)
    State = models.CharField(max_length=100)
    Pincode = models.CharField(max_length=10)
    Ownership = models.CharField(max_length=100)
    GovtID_Type = models.CharField(max_length=100)
    ID_Number = models.CharField(max_length=100)
    Category = models.CharField(max_length=100)
    Load_Applied = models.IntegerField()
    Date_of_Application = models.DateField('%d-%m-%Y')
    Date_of_Approval = models.CharField(max_length=100, blank=True)
    Modified_Date = models.DateField('%d-%m-%Y')
    Status = models.CharField(max_length=100)
    Reviewer_ID = models.IntegerField()
    Reviewer_Name = models.CharField(max_length=100)
    Reviewer_Comments = models.TextField()

    def __str__(self):
        return f"{self.ID}: {self.Applicant_Name}"
