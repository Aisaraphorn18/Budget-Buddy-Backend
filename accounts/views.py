# account/views.py
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView
from django.contrib.auth.hashers import check_password
from .models import User
from .serializers import UserSerializer, UserCreateSerializer
from rest_framework.views import APIView


class AllUsersView(ListAPIView):
    """GET ALL Users - แสดงรายการผู้ใช้ทั้งหมด"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  


class CreateUserView(CreateAPIView):
    """POST Create User - สร้างผู้ใช้ใหม่"""
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user_data = UserSerializer(user).data
        return Response({
            'success': True,
            'message': 'สร้างผู้ใช้สำเร็จ',
            'data': user_data
        }, status=status.HTTP_201_CREATED)


class RetrieveUserView(RetrieveAPIView):
    """GET User by ID - ดึงข้อมูลผู้ใช้แต่ละคน"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny] 
    lookup_field = "user_id"  # ใช้ field user_id เป็นตัวค้นหา

class LoginView(APIView):
    """POST Login - ตรวจสอบ username/password"""
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"success": False, "message": "กรุณากรอก username และ password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"success": False, "message": "ไม่พบผู้ใช้"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if check_password(password, user.password):
            return Response(
                {
                    "success": True,
                    "message": "เข้าสู่ระบบสำเร็จ",
                    "data": {
                        "user_id": user.user_id,
                        "username": user.username,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                    },
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"success": False, "message": "รหัสผ่านไม่ถูกต้อง"},
                status=status.HTTP_400_BAD_REQUEST,
            )

class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response(
            {"success": True, "message": "ออกจากระบบสำเร็จ"},
            status=status.HTTP_200_OK
        )