# Generated by Django 5.1.2 on 2025-02-22 03:37

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hanapwedeApp', '0008_alter_jobpost_salary_range'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='job_post',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='hanapwedeApp.jobpost'),
        ),
    ]
