# from django.db import models
# from accounts.models import User

# class Category(models.Model):
#     """ตาราง Category ตาม Supabase"""
#     category_id = models.AutoField(primary_key=True)
#     category_name = models.CharField(max_length=255)
#     type = models.CharField(max_length=50)  # income หรือ expense
#     icon = models.TextField(blank=True, null=True)
#     user_id = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    
#     class Meta:
#         db_table = 'Category'
    
#     def __str__(self):
#         return self.category_name

# class Transaction(models.Model):
#     """ตาราง Transaction ตาม Supabase"""
#     transaction_id = models.AutoField(primary_key=True)
#     category_id = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, db_column='category_id')
#     user_id = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
#     type = models.CharField(max_length=50)  # income หรือ expense
#     amount = models.FloatField()
#     note = models.CharField(max_length=255, blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     class Meta:
#         db_table = 'Transaction'
    
#     def __str__(self):
#         return f"{self.type} - {self.amount}"

# class Budget(models.Model):
#     """ตาราง Budget ตาม Supabase"""
#     budget_id = models.AutoField(primary_key=True)
#     user_id = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
#     category_id = models.ForeignKey(Category, on_delete=models.CASCADE, db_column='category_id')
#     budget_amount = models.FloatField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     cycle_month = models.DateField()
    
#     class Meta:
#         db_table = 'Budget'
    
#     def __str__(self):
#         return f"Budget {self.budget_amount} for {self.category_id}"

from django.db import models
from accounts.models import User

class Transaction(models.Model):
    CATEGORY_CHOICES = [
        ("food", "อาหาร"),
        ("transport", "เดินทาง"),
        ("shopping", "ช้อปปิ้ง"),
        ("health", "สุขภาพ"),
        ("education", "การศึกษา"),
        ("bills", "ค่าน้ำค่าไฟ"),
        ("entertainment", "บันเทิง"),
        ("savings", "ออมเงิน"),
        ("salary", "เงินเดือน"),
        ("others", "อื่นๆ"),
    ]
    TYPE_CHOICES = [("income", "รายรับ"), ("expense", "รายจ่าย")]

    transaction_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column="user_id")
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES)
    type = models.CharField(max_length=7, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    note = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "Transaction"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.get_category_display()} {self.type} {self.amount}"


class Budget(models.Model):
    CATEGORY_CHOICES = Transaction.CATEGORY_CHOICES

    budget_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column="user_id")
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES)
    budget_amount = models.DecimalField(max_digits=12, decimal_places=2)
    cycle_month = models.DateField(help_text="กำหนดเดือน (เช่น 2025-09-01 = ก.ย. 2025)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "Budget"
        unique_together = ("user", "category", "cycle_month")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.get_category_display()} {self.budget_amount} ({self.cycle_month})"
