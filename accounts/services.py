from django.contrib.auth.models import User
from django.db.models import Q
from .models import UserProfile

class UserService:
    @staticmethod
    def get_user_profile(user):
        """ดึงโปรไฟล์ผู้ใช้"""
        profile, created = UserProfile.objects.get_or_create(user=user)
        return profile
    
    @staticmethod
    def update_user_profile(user, data):
        """อัปเดตโปรไฟล์ผู้ใช้"""
        profile = UserService.get_user_profile(user)
        for key, value in data.items():
            if hasattr(profile, key):
                setattr(profile, key, value)
        profile.save()
        return profile
    
    @staticmethod
    def search_users(query):
        """ค้นหาผู้ใช้ตามชื่อหรืออีเมล"""
        return User.objects.filter(
            Q(username__icontains=query) |
            Q(email__icontains=query) |
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query)
        ).distinct()
    
    @staticmethod
    def get_user_stats(user):
        """ดึงสถิติของผู้ใช้"""
        from finance.models import Transaction, Budget
        from django.db.models import Sum, Count
        from datetime import datetime
        
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        # รวมธุรกรรม
        transactions_count = Transaction.objects.filter(user=user).count()
        
        # รายรับ-รายจ่ายเดือนนี้
        monthly_income = Transaction.objects.filter(
            user=user,
            transaction_type='income',
            date__month=current_month,
            date__year=current_year
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        monthly_expense = Transaction.objects.filter(
            user=user,
            transaction_type='expense',
            date__month=current_month,
            date__year=current_year
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # งบประมาณ
        budgets_count = Budget.objects.filter(user=user).count()
        
        return {
            'transactions_count': transactions_count,
            'monthly_income': monthly_income,
            'monthly_expense': monthly_expense,
            'monthly_balance': monthly_income - monthly_expense,
            'budgets_count': budgets_count,
        }
