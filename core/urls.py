from django.contrib import admin
from django.urls import path
from dashboard import views

from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from django.conf.urls.static import static
from django.conf import settings

schema_view = get_schema_view(
    openapi.Info(
        title="EShop Dashboard API",
        default_version='v1',
        description="API documentation",
        contact=openapi.Contact(email="amar.tauqeer@gmail.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('add_category/', views.add_category),
    path('all_category/', views.all_category),
    path('delete_category/<int:id>', views.delete_category),
    path('update_category/<int:id>', views.update_category),

    path('add_customer/', views.add_customer),
    path('all_customer/', views.all_customer),
    path('delete_customer/<int:id>', views.delete_customer),
    path('update_customer/<int:id>', views.update_customer),

    path('all_product/', views.all_product),
    path('add_product/', views.add_product),
    path('update_product/<int:id>', views.update_product),
    path('delete_product/<int:id>', views.delete_product),

    path('all_order/', views.all_order),
    path('all_order_detail/', views.all_order_detail),
    path('add_order/', views.add_order),
    path('add_order_detail/', views.add_order_detail),


    path('all_user/', views.all_user),
    path('add_user/', views.add_user),
    path('get_user/<int:id>', views.get_user),
    path('check_user/', views.check_user),
    path('change_password/', views.change_password),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    # path('all_user/', views.all_user),
    # path('add_department/', views.add_department),
    # path('update_user/<int:id>', views.update_user),
    # path('delete_user/<int:id>', views.delete_user),
    # path('update_department/<int:id>', views.update_department),
    # path('delete_department/<int:id>', views.delete_department),
    # path('get_department_by_id/<int:id>', views.get_department_by_id),
    # path('get_employee_by_id/<int:id>', views.get_employee_by_id),
    # path('get_user_by_id/<int:id>', views.get_user_by_id),
    # path('all_department/', views.all_department),
    # path('add_employee/', views.add_employee),
    # path('update_employee/<int:id>', views.update_employee),
    # path('delete_employee/<int:id>', views.delete_employee),
    # path('all_employee/', views.all_employee),
]

urlpatterns += static(settings.UPLOAD_URL, document_root=settings.UPLOAD_ROOT)
