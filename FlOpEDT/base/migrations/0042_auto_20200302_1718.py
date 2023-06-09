# Generated by Django 2.1.3 on 2020-03-02 17:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('people', '0016_auto_20200302_1718'),
        ('base', '0041_module_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='coursemodification',
            name='tutor_old',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='impacted_by_course_modif', to='people.Tutor'),
        ),
    ]
