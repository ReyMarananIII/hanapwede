# Generated by Django 5.1.6 on 2025-04-10 12:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hanapwedeApp', '0027_pwdcard'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_email_verified',
            field=models.BooleanField(default=False),
        ),
    ]
