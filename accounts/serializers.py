from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'username', 'first_name', 'last_name', 'created_date']
        read_only_fields = ['user_id', 'created_date']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        min_length=6,
        help_text="รหัสผ่านอย่างน้อย 6 ตัวอักษร",
        style={'input_type': 'password', 'placeholder': 'กรอกรหัสผ่าน'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        help_text="ยืนยันรหัสผ่าน ต้องตรงกับรหัสผ่าน",
        style={'input_type': 'password', 'placeholder': 'ยืนยันรหัสผ่าน'}
    )
    
    class Meta:
        model = User
        fields = ['username', 'password', 'password_confirm', 'first_name', 'last_name']
        extra_kwargs = {
            'username': {
                'help_text': 'ชื่อผู้ใช้ (ต้องไม่ซ้ำ)',
                'style': {'placeholder': 'กรอกชื่อผู้ใช้'}
            },
            'first_name': {
                'help_text': 'ชื่อจริง (ไม่บังคับ)',
                'required': False,
                'style': {'placeholder': 'กรอกชื่อจริง'}
            },
            'last_name': {
                'help_text': 'นามสกุล (ไม่บังคับ)',
                'required': False,
                'style': {'placeholder': 'กรอกนามสกุล'}
            }
        }
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("ชื่อผู้ใช้นี้มีอยู่แล้ว")
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("รหัสผ่านไม่ตรงกัน")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        validated_data['password'] = make_password(validated_data['password'])
        user = User.objects.create(**validated_data)
        return user
