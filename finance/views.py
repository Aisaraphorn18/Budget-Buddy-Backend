# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import AllowAny
# from rest_framework.response import Response
# from accounts.models import User
# from .models import Category, Transaction, Budget
# from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer, UserSerializer

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def all_categories(request):
#     """GET ALL Categories"""
#     categories = Category.objects.all()
#     serializer = CategorySerializer(categories, many=True)
#     return Response(serializer.data)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def all_transactions(request):
#     """GET ALL Transactions"""
#     transactions = Transaction.objects.all().order_by('-created_at')
#     serializer = TransactionSerializer(transactions, many=True)
#     return Response(serializer.data)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def all_budgets(request):
#     """GET ALL Budgets"""
#     budgets = Budget.objects.all().order_by('-created_at')
#     serializer = BudgetSerializer(budgets, many=True)
#     return Response(serializer.data)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import Transaction, Budget
from .serializers import (
    TransactionCreateSerializer,
    TransactionSerializer,
    BudgetCreateSerializer,
    BudgetSerializer,
    CategoryChoiceSerializer,
)

# Category dropdown (global 10 อันเหมือนกัน)
@api_view(["GET"])
@permission_classes([AllowAny])
def category_choices(request):
    return Response(CategoryChoiceSerializer.get_list())

# Transactions ของ user ที่ล็อกอิน
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_transactions(request):
    qs = Transaction.objects.filter(user=request.user)
    return Response(TransactionSerializer(qs, many=True).data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_transaction(request):
    ser = TransactionCreateSerializer(data=request.data, context={"request": request})
    if ser.is_valid():
        obj = ser.save()  # จะผูก user อัตโนมัติใน serializer.create()
        return Response(TransactionSerializer(obj).data, status=status.HTTP_201_CREATED)
    return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

# Budgets ของ user ที่ล็อกอิน
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_budgets(request):
    qs = Budget.objects.filter(user=request.user)
    return Response(BudgetSerializer(qs, many=True).data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_budget(request):
    ser = BudgetCreateSerializer(data=request.data, context={"request": request})
    if ser.is_valid():
        obj = ser.save()  # จะผูก user อัตโนมัติใน serializer.create()
        return Response(BudgetSerializer(obj).data, status=status.HTTP_201_CREATED)
    return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
