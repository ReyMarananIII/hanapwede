# Generated by Django 5.1.6 on 2025-02-17 01:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hanapwedeApp', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='application',
            old_name='skills_req',
            new_name='applicant_skills',
        ),
        migrations.AddField(
            model_name='jobpost',
            name='tags',
            field=models.TextField(blank=True, null=True),
        ),
    ]
