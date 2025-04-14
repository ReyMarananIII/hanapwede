from django.core.management.base import BaseCommand
from django.utils import timezone
from hanapwedeApp.models import JobFair  # import from your main models file

class Command(BaseCommand):
    help = 'Deletes JobFair records scheduled for today'

    def handle(self, *args, **kwargs):
        today = timezone.now().date()
        jobfairs_to_delete = JobFair.objects.filter(date__lte=today) 
        count = jobfairs_to_delete.count()
        jobfairs_to_delete.delete()
        self.stdout.write(self.style.SUCCESS(
            f"Deleted {count} JobFair record(s) with date = today ({today})"
        ))