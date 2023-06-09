# Generated by Django 2.1.13 on 2019-11-06 16:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0036_Refactor_code_to_english'),
    ]

    operations = [
        migrations.RenameField(
            model_name='course',
            old_name='semaine',
            new_name='week',
        ),
        migrations.RenameField(
            model_name='coursemodification',
            old_name='semaine_old',
            new_name='old_week',
        ),
        migrations.RenameField(
            model_name='coursepreference',
            old_name='semaine',
            new_name='week',
        ),
        migrations.RenameField(
            model_name='edtversion',
            old_name='semaine',
            new_name='week',
        ),
        migrations.RenameField(
            model_name='groupcost',
            old_name='semaine',
            new_name='week',
        ),
        migrations.RenameField(
            model_name='groupfreehalfday',
            old_name='semaine',
            new_name='week',
        ),
        migrations.RenameField(
            model_name='planningmodification',
            old_name='semaine_old',
            new_name='old_week',
        ),
        migrations.RenameField(
            model_name='regen',
            old_name='semaine',
            new_name='week',
        ),
        migrations.RenameField(
            model_name='roompreference',
            old_name='semaine',
            new_name='week',
        ),
        migrations.RenameField(
            model_name='tutorcost',
            old_name='semaine',
            new_name='week',
        ),
        migrations.RenameField(
            model_name='userpreference',
            old_name='semaine',
            new_name='week',
        ),
        migrations.AlterUniqueTogether(
            name='edtversion',
            unique_together={('department', 'week', 'an')},
        ),
    ]
