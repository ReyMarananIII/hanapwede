# Generated by Django 5.1.6 on 2025-04-06 04:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hanapwedeApp', '0023_jobfair_jobfairregistration'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='jobfair',
            name='time',
        ),
    ]
