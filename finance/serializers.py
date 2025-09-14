# from rest_framework import serializers
# from accounts.models import User
# from .models import Category, Transaction, Budget

# class CategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Category
#         fields = ['category_id', 'category_name', 'type', 'icon', 'user_id']

# class TransactionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Transaction
#         fields = ['transaction_id', 'category_id', 'user_id', 'type', 'amount', 'note', 'created_at']

# class BudgetSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Budget
#         fields = ['budget_id', 'user_id', 'category_id', 'budget_amount', 'created_at', 'updated_at', 'cycle_month']

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']

from rest_framework import serializers
from .models import Transaction, Budget

class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ["category", "type", "amount", "note", "date"]

    def create(self, validated_data):
        user = self.context["request"].user
        return Transaction.objects.create(user=user, **validated_data)


class TransactionSerializer(serializers.ModelSerializer):
    category_label = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "transaction_id",
            "category",
            "category_label",
            "type",
            "amount",
            "note",
            "date",
            "created_at",
        ]


class BudgetCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ["category", "budget_amount", "cycle_month"]

    def create(self, validated_data):
        user = self.context["request"].user
        return Budget.objects.create(user=user, **validated_data)


class BudgetSerializer(serializers.ModelSerializer):
    category_label = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = Budget
        fields = [
            "budget_id",
            "category",
            "category_label",
            "budget_amount",
            "cycle_month",
            "created_at",
            "updated_at",
        ]


class CategoryChoiceSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()

    @staticmethod
    def get_list():
        return [{"value": k, "label": v} for k, v in Transaction.CATEGORY_CHOICES]
