from django.db import models

class Supermarket(models.Model):
    name = models.CharField(max_length=255)
    image = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()

    class Meta:
        db_table = 'supermarkets'  # Đảm bảo dùng đúng tên bảng

    def __str__(self):
        return self.name
