from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from accounts.models import User
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer, UserSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def all_categories(request):
    """GET ALL Categories"""
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def all_transactions(request):
    """GET ALL Transactions"""
    transactions = Transaction.objects.all().order_by('-created_at')
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def all_budgets(request):
    """GET ALL Budgets"""
    budgets = Budget.objects.all().order_by('-created_at')
    serializer = BudgetSerializer(budgets, many=True)
    return Response(serializer.data)
