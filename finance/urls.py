from django.urls import path
from . import views

app_name = 'finance'

urlpatterns = [
    # Simple API endpoints
    path('AllCategory/', views.all_categories, name='all_categories'),
    path('AllTransaction/', views.all_transactions, name='all_transactions'),
    path('AllBudget/', views.all_budgets, name='all_budgets'),
]
