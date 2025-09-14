from django.db import models
from accounts.models import User

class Category(models.Model):
    """ตาราง Category ตาม Supabase"""
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=255)
    type = models.CharField(max_length=50)  # income หรือ expense
    icon = models.TextField(blank=True, null=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    
    class Meta:
        db_table = 'Category'
    
    def __str__(self):
        return self.category_name

class Transaction(models.Model):
    """ตาราง Transaction ตาม Supabase"""
    transaction_id = models.AutoField(primary_key=True)
    category_id = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, db_column='category_id')
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    type = models.CharField(max_length=50)  # income หรือ expense
    amount = models.FloatField()
    note = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'Transaction'
    
    def __str__(self):
        return f"{self.type} - {self.amount}"

class Budget(models.Model):
    """ตาราง Budget ตาม Supabase"""
    budget_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    category_id = models.ForeignKey(Category, on_delete=models.CASCADE, db_column='category_id')
    budget_amount = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    cycle_month = models.DateField()
    
    class Meta:
        db_table = 'Budget'
    
    def __str__(self):
        return f"Budget {self.budget_amount} for {self.category_id}"
