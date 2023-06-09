# Generated by Django 3.1.7 on 2021-07-09 10:03

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0077_auto_20210511_1707'),
    ]

    operations = [
        migrations.RenameField(
            model_name='mode',
            old_name='cosmo',
            new_name='ex_cosmo',
        ),
        migrations.AddField(
            model_name='mode',
            name='new_cosmo',
            field=models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MaxValueValidator(2)]),
        ),
        migrations.AlterField(
            model_name='mode',
            name='visio',
            field=models.BooleanField(default=False),
        ),
    ]
