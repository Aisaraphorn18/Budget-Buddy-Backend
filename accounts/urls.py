# account/urls.py
from django.urls import path
from .views import AllUsersView, CreateUserView, RetrieveUserView, LoginView, LogoutView

urlpatterns = [
    path('users/', AllUsersView.as_view(), name='all_users'),          # GET /api/users/
    path('users/create/', CreateUserView.as_view(), name='create_user'), # POST /api/users/create/
    path('users/<int:user_id>/', RetrieveUserView.as_view(), name='retrieve_user'), # GET /api/users/1/
    path('login/', LoginView.as_view(), name='login'),
    path("logout/", LogoutView.as_view(), name="logout"),
]
