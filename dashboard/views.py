import os

from django.contrib.auth.hashers import make_password, check_password
from django.http.response import JsonResponse, HttpResponse
from rest_framework.parsers import JSONParser
from rest_framework import status
from django.db.models import Q

from dashboard.models import Category, Product, User, Customer, Order, OrderDetail
from dashboard.serializers import CategorySerializer, ProductSerializer, UserSerializer, CustomerSerializer, \
    OrderSerializer, OrderDetailSerializer
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema

"""
    endpoints
"""


@api_view(['GET'])
def all_category(request):
    if request.method == 'GET':
        categories = Category.objects.all()

        category_name = request.GET.get('category_name', None)
        if category_name is not None:
            categories = categories.filter(
                category_name__icontains=category_name)

        serializer = CategorySerializer(categories, many=True)
        return JsonResponse(serializer.data, safe=False)


@swagger_auto_schema(methods=['post'], request_body=CategorySerializer)
@api_view(['POST'])
def add_category(request):
    print(request.data)
    if request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_category(request, id):
    if request.method == 'DELETE':
        category = Category.objects.get(pk=id)
        category.delete()
        return JsonResponse({'message': 'User was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(methods=['put'], request_body=CategorySerializer)
@api_view(['PUT'])
def update_category(request, id):
    if request.method == 'PUT':
        category = Category.objects.get(pk=id)
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(methods=['post'], request_body=UserSerializer)
@api_view(['POST'])
def add_user(request):
    if request.method == 'POST':
        pass_encrypt = make_password(request.data['user_password'])
        user_data = {
            "user_name": request.data['user_name'],
            "user_email": request.data['user_email'],
            "user_address": request.data['user_address'],
            "user_country": request.data['user_country'],
            "user_state": request.data['user_state'],
            "user_city": request.data['user_city'],
            "user_phone": request.data['user_phone'],
            "user_password": pass_encrypt,
        }
        serializer = UserSerializer(data=user_data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def all_user(request):
    if request.method == 'GET':
        users = User.objects.all()

        user_name = request.GET.get('user_name', None)
        if user_name is not None:
            users = users.filter(
                user_name__icontains=user_name)

        serializer = UserSerializer(users, many=True)
        return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
def get_user(request, id):
    if request.method == 'GET':
        user = User.objects.get(pk=id)
        user_data = {
            'user_name': user.user_name,
            'user_password': user.user_password,
            'is_admin': user.is_admin,
            'id': user.id,
        }
        serializer = UserSerializer(user, data=user_data)
        if serializer.is_valid():
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(methods=['post'], request_body=UserSerializer)
@api_view(['POST'])
def check_user(request):
    if request.method == 'POST':
        try:
            user = User.objects.get(user_name=request.data['user_name'])
            # print(user.user_name)
            # print(user.user_password)
            # print(request.data['user_password'])
            # print(user.is_admin)
            # print(request.data['is_admin'])
            user_data = {
                'user_name': user.user_name,
                'user_password': user.user_password,
                'is_admin': user.is_admin,
                'id': user.id,
                "user_email": user.user_email,
                "user_address": user.user_address,
                "user_country": user.user_country,
                "user_state": user.user_state,
                "user_city": user.user_city,
                "user_phone": user.user_phone,
                "user_status": user.user_status,
                "create_date": user.create_date,

            }
            # print(user_data)
            serializer = UserSerializer(user, data=user_data)
            if user:
                match_password = check_password(
                    request.data['user_password'], user.user_password)
                print(match_password)
                if match_password and user.is_admin == request.data['is_admin']:
                    print(serializer.is_valid())
                    if serializer.is_valid():
                        return JsonResponse(serializer.data, safe=False)
                    else:
                        return JsonResponse("You are not authorized to access dashboad", safe=False)
                else:
                    return JsonResponse("Email or password incorrect", safe=False)
            else:
                return JsonResponse("Email or password incorrect", safe=False)
        except:
            return JsonResponse("Account doesn't exist", safe=False)


@api_view(['PUT'])
def change_password(request):
    if request.method == 'PUT':
        user = User.objects.get(user_name=request.data['user_name'])
        print(user.user_name)
        print(user.user_password)
        print(request.data['user_password'])
        print(request.data['old_password'])
        if user:
            match_password = check_password(
                request.data['old_password'], user.user_password)
            pass_encrypt = make_password(request.data['user_password'])
            print(match_password)
            if match_password:
                new_data = {
                    'user_name': user.user_name,
                    'user_password': pass_encrypt,
                    'is_admin': user.is_admin,
                    'id': user.id,
                    "user_email": user.user_email,
                    "user_address": user.user_address,
                    "user_country": user.user_country,
                    "user_state": user.user_state,
                    "user_city": user.user_city,
                    "user_phone": user.user_phone,
                    "user_status": user.user_status,
                    "create_date": user.create_date,
                }
                serializer = UserSerializer(user, data=new_data)
                if serializer.is_valid():
                    serializer.save()
                    return JsonResponse(serializer.data)
                return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return JsonResponse("Email or password incorrect", safe=False)
        else:
            return JsonResponse("Email or password incorrect", safe=False)


@api_view(['GET'])
def all_product(request):
    if request.method == 'GET':
        products = Product.objects.all()
        print(products[0].image)

        product_name = request.GET.get('product_name', None)
        if product_name is not None:
            products = products.filter(
                product_name__icontains=product_name)

        serializer = ProductSerializer(products, many=True)
        return JsonResponse(serializer.data, safe=False)


@swagger_auto_schema(methods=['post'], request_body=ProductSerializer)
@api_view(['POST'])
def add_product(request):
    if request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(methods=['put'], request_body=ProductSerializer)
@api_view(['PUT'])
def update_product(request, id):
    if request.method == 'PUT':
        print(id)
        product = Product.objects.get(pk=id)
        print(product.product_name)
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            if len(request.FILES) != 0:
                if len(product.image) > 0:
                    print(product.image)
                    os.remove(product.image.path)
                else:
                    product.image = request.data[0].image
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_product(request, id):
    if request.method == 'DELETE':
        product = Product.objects.get(pk=id)
        if product.image != "":
            os.remove(product.image.path)
        product.delete()
        return JsonResponse({'message': 'User was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def all_customer(request):
    if request.method == 'GET':
        customers = Customer.objects.all()

        customer_name = request.GET.get('customer_name', None)
        if customer_name is not None:
            customers = customers.filter(
                customer_name__icontains=customer_name)

        serializer = CustomerSerializer(customers, many=True)
        return JsonResponse(serializer.data, safe=False)


@swagger_auto_schema(methods=['post'], request_body=CustomerSerializer)
@api_view(['POST'])
def add_customer(request):
    if request.method == 'POST':
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_customer(request, id):
    if request.method == 'DELETE':
        customer = Customer.objects.get(pk=id)
        customer.delete()
        return JsonResponse({'message': 'Customer was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(methods=['put'], request_body=CustomerSerializer)
@api_view(['PUT'])
def update_customer(request, id):
    if request.method == 'PUT':
        customer = Customer.objects.get(pk=id)
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(methods=['post'], request_body=OrderSerializer)
@api_view(['POST'])
def add_order(request):
    if request.method == 'POST':
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(methods=['post'], request_body=OrderDetailSerializer)
@api_view(['POST'])
def add_order_detail(request):
    if request.method == 'POST':
        print(request.data)
        serializer = OrderDetailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def all_order(request):
    if request.method == 'GET':
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
def get_last_ordId(request):
    if request.method == 'GET':
        orderId = Order.objects.latest('pk')
        print(orderId.id)
        # serializer = OrderSerializer(orderId, many=True)
        return HttpResponse(orderId.id)


@api_view(['GET'])
def all_order_detail(request):
    if request.method == 'GET':
        orders = OrderDetail.objects.all()
        serializer = OrderDetailSerializer(orders, many=True)
        return JsonResponse(serializer.data, safe=False)


@api_view(['DELETE'])
def delete_order_detail(request, id):
    if request.method == 'DELETE':
        ord_detail = OrderDetail.objects.get(pk=id)
        ord_detail.delete()
        return JsonResponse({'message': 'Order Detail was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
def delete_order(request, id):
    if request.method == 'DELETE':
        order = Order.objects.get(pk=id)
        order.delete()
        return JsonResponse({'message': 'Order was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(methods=['put'], request_body=OrderSerializer)
@api_view(['PUT'])
def update_order(request, id):
    if request.method == 'PUT':
        order = Order.objects.get(pk=id)
        serializer = OrderSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def update_order_detail(request):
    if request.method == 'POST':
        id=request.data['order']
        orders = OrderDetail.objects.all()
        order = orders.filter(order=id)
        olddata = order
        olddata.delete()
        serializer = OrderDetailSerializer(data=request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data,safe=False)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST,safe=False)
