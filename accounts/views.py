from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, CreateAPIView
from .models import User
from .serializers import UserSerializer, UserCreateSerializer

class AllUsersView(ListAPIView):
    """GET ALL Users - แสดงรายการผู้ใช้ทั้งหมด"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CreateUserView(CreateAPIView):
    """POST Create User - สร้างผู้ใช้ใหม่"""
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user_data = UserSerializer(user).data
            return Response({
                'success': True,
                'message': 'สร้างผู้ใช้สำเร็จ',
                'data': user_data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'ข้อมูลไม่ถูกต้อง',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

# Legacy function-based views (สำหรับ backward compatibility)
@api_view(['GET'])
@permission_classes([AllowAny])
def all_users(request):
    """GET ALL Users"""
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_user(request):
    """POST Create User"""
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user_data = UserSerializer(user).data
        return Response({
            'success': True,
            'message': 'สร้างผู้ใช้สำเร็จ',
            'data': user_data
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'message': 'ข้อมูลไม่ถูกต้อง',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)
