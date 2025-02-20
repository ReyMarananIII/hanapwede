
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hanapwedeApp', '0005_tag_alter_jobpost_posted_by_user_preferences'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='jobpost',
            name='tags',
        ),
        migrations.AddField(
            model_name='jobpost',
            name='tags',
            field=models.ManyToManyField(blank=True, to='hanapwedeApp.tag'),
        ),
    ]
