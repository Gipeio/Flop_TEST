# Generated by Django 3.0.5 on 2020-05-20 15:00

import django.contrib.postgres.fields
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0056_moduletutorrepartition'),
        ('TTapp', '0024_amphibreak'),
    ]

    operations = [
        migrations.CreateModel(
            name='BreakAroundCourseType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('week', models.PositiveSmallIntegerField(blank=True, default=None, null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(52)])),
                ('year', models.PositiveSmallIntegerField(blank=True, default=None, null=True)),
                ('weight', models.PositiveSmallIntegerField(blank=True, default=None, null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(8)])),
                ('comment', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('is_active', models.BooleanField(default=True, verbose_name='Contrainte active?')),
                ('weekdays', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(choices=[('m', 'monday'), ('tu', 'tuesday'), ('w', 'wednesday'), ('th', 'thursday'), ('f', 'friday'), ('sa', 'saturday'), ('su', 'sunday')], max_length=2), blank=True, null=True, size=None)),
                ('course_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='amphi_break_constraint', to='base.CourseType')),
                ('department', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='base.Department')),
                ('groups', models.ManyToManyField(blank=True, related_name='amphi_break_constraint', to='base.Group')),
                ('train_progs', models.ManyToManyField(blank=True, to='base.TrainingProgramme')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.DeleteModel(
            name='AmphiBreak',
        ),
    ]
