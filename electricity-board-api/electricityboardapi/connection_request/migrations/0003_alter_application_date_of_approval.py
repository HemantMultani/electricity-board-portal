# Generated by Django 5.0.3 on 2024-03-09 08:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('connection_request', '0002_alter_application_date_of_application_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='Date_of_Approval',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]