from django.contrib.auth.models import User
from .models import Category, Transaction, Budget

class CategoryService:
    @staticmethod
    def get_all_categories():
        """ดึงหมวดหมู่ทั้งหมด"""
        return Category.objects.all()
    
    @staticmethod
    def get_categories_by_user(user_id):
        """ดึงหมวดหมู่ตาม user_id"""
        return Category.objects.filter(user_id=user_id)
    
    @staticmethod
    def get_categories_by_type(category_type):
        """ดึงหมวดหมู่ตามประเภท (income/expense)"""
        return Category.objects.filter(type=category_type)

class TransactionService:
    @staticmethod
    def get_all_transactions():
        """ดึงธุรกรรมทั้งหมด"""
        return Transaction.objects.all().order_by('-created_at')
    
    @staticmethod
    def get_transactions_by_user(user_id):
        """ดึงธุรกรรมตาม user_id"""
        return Transaction.objects.filter(user_id=user_id).order_by('-created_at')
    
    @staticmethod
    def get_transactions_by_category(category_id):
        """ดึงธุรกรรมตาม category_id"""
        return Transaction.objects.filter(category_id=category_id).order_by('-created_at')
    
    @staticmethod
    def get_transactions_by_type(transaction_type):
        """ดึงธุรกรรมตามประเภท (income/expense)"""
        return Transaction.objects.filter(type=transaction_type).order_by('-created_at')

class BudgetService:
    @staticmethod
    def get_all_budgets():
        """ดึงงบประมาณทั้งหมด"""
        return Budget.objects.all().order_by('-created_at')
    
    @staticmethod
    def get_budgets_by_user(user_id):
        """ดึงงบประมาณตาม user_id"""
        return Budget.objects.filter(user_id=user_id).order_by('-created_at')
    
    @staticmethod
    def get_budgets_by_category(category_id):
        """ดึงงบประมาณตาม category_id"""
        return Budget.objects.filter(category_id=category_id).order_by('-created_at')

class UserService:
    @staticmethod
    def get_all_users():
        """ดึงผู้ใช้ทั้งหมด"""
        return User.objects.all()
    
    @staticmethod
    def get_user_by_username(username):
        """ดึงผู้ใช้ตาม username"""
        return User.objects.filter(username=username).first()
