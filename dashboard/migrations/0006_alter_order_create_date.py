# Generated by Django 3.2.7 on 2021-10-15 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0005_alter_order_order_amount'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='create_date',
            field=models.DateField(),
        ),
    ]