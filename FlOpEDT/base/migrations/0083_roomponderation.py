# Generated by Django 3.0.14 on 2022-02-14 22:31

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0082_auto_20211206_1200'),
    ]

    operations = [
        migrations.CreateModel(
            name='RoomPonderation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('room_types', django.contrib.postgres.fields.ArrayField(base_field=models.PositiveSmallIntegerField(), size=None)),
                ('ponderations', django.contrib.postgres.fields.ArrayField(base_field=models.PositiveSmallIntegerField(), null=True, size=None)),
                ('department', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.Department')),
            ],
        ),
    ]