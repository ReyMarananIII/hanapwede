# Generated by Django 5.1.6 on 2025-03-24 10:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hanapwedeApp', '0021_employeeprofile_employee_resume_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='resume',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
