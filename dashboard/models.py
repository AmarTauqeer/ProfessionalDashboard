from django.db import models


# Create your models here.

class User(models.Model):
    user_name = models.CharField(max_length=150, blank=False)
    user_email = models.CharField(max_length=50, blank=False)
    user_address = models.CharField(max_length=250, blank=False)
    user_country = models.CharField(max_length=100, blank=False)
    user_state = models.CharField(max_length=50, blank=True)
    user_city = models.CharField(max_length=50, blank=True)
    user_phone = models.CharField(max_length=50, blank=True)
    user_password = models.CharField(max_length=150, blank=False)
    user_status = models.CharField(max_length=20, default="Active")
    create_date = models.DateField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)


class Category(models.Model):
    category_name = models.CharField(max_length=150, blank=False)
    category_description = models.CharField(max_length=150)

    def __str__(self):
        return self.category_name


class Product(models.Model):
    product_name = models.CharField(max_length=150, blank=False)
    product_description = models.CharField(max_length=150)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    sale_price = models.IntegerField()
    purchase_price = models.IntegerField()
    image = models.ImageField(upload_to='uploads/images/', blank=True, null=True)


class Customer(models.Model):
    customer_name = models.CharField(max_length=150, blank=False)
    customer_address = models.CharField(max_length=250, blank=False)
    customer_country = models.CharField(max_length=100, blank=False)
    customer_state = models.CharField(max_length=50, blank=True)
    customer_city = models.CharField(max_length=50, blank=True)
    customer_phone = models.CharField(max_length=50, blank=True)
    customer_email = models.CharField(max_length=50, blank=False)


class Order(models.Model):
    create_date = models.DateField(auto_now_add=True)
    order_status = models.CharField(max_length=10, default="Pending")
    order_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)


class OrderDetail(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    amount_per_product = models.DecimalField(max_digits=10, decimal_places=2)
