from django.db import models

class User(models.Model):
    """ตาราง User ตาม Supabase"""
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    password = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'User'
    
    def __str__(self):
        return self.username
