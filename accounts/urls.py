from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # Class-based views (DRF UI)
    path('AllUser/', views.AllUsersView.as_view(), name='all_users_cbv'),
    path('CreateUser/', views.CreateUserView.as_view(), name='create_user_cbv'),
    
    # Legacy function-based views
    path('AllUserFBV/', views.all_users, name='all_users'),
    path('CreateUserFBV/', views.create_user, name='create_user'),
]
