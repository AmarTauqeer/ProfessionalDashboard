# Generated by Django 3.2.7 on 2021-10-10 07:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0002_rename_user_region_user_user_city'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customer',
            old_name='customer_region',
            new_name='customer_city',
        ),
    ]
