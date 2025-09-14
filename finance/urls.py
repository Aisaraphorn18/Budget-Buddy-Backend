# from django.urls import path
# from . import views

# app_name = 'finance'

# urlpatterns = [
#     # Simple API endpoints
#     path('AllCategory/', views.all_categories, name='all_categories'),
#     path('AllTransaction/', views.all_transactions, name='all_transactions'),
#     path('AllBudget/', views.all_budgets, name='all_budgets'),
# ]
from django.urls import path
from . import views

app_name = "finance"

urlpatterns = [
    path("categories/", views.category_choices, name="category_choices"),

    # transaction
    path("transactions/", views.my_transactions, name="my_transactions"),
    path("transactions/create/", views.create_transaction, name="create_transaction"),

    # budget
    path("budgets/", views.my_budgets, name="my_budgets"),
    path("budgets/create/", views.create_budget, name="create_budget"),
]
