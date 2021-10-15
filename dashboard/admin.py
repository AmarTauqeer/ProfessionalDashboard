from django.contrib import admin
from .models import User, Category, Product, Customer, Order, OrderDetail


class AdminProduct(admin.ModelAdmin):
    list_display = ['product_name', 'product_description', 'category', 'sale_price', 'purchase_price', 'image']


class AdminCategory(admin.ModelAdmin):
    list_display = ['category_name', 'category_description']


class AdminOrder(admin.ModelAdmin):
    list_display = ['create_date', 'order_status', 'order_amount', 'customer']


class AdminOrderDetail(admin.ModelAdmin):
    list_display = ['order', 'product', 'qty', 'price', 'amount_per_product']


# Register your models here.
admin.site.register(User)
admin.site.register(Category, AdminCategory)
admin.site.register(Product, AdminProduct)
admin.site.register(Customer)
admin.site.register(Order, AdminOrder)
admin.site.register(OrderDetail, AdminOrderDetail)
