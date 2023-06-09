##Gestion de l'infaisabilité des contraintes

Lorsqu'on lance le solveur, celui-ci prend toutes les contraintes et essaie de générer l'emploi du temps optimal.
Il peut y avoir deux cas :
 - Soit le solveur arrive à résoudre l'ensemble de contraintes
 - Soit le solveur n'arrive pas à le résoudre et renvoie un fichier donnant des informations sur les contraintes 
 qui n'ont pas été respectées

Ce dossier permet de gérer le deuxième cas.

#Exécution
Pour exécuter des commandes python dans un interpréteur : \
Allez dans le path FlOpEDT/ et lancez dans un terminal :
```shell script
source venv/bin/activate
cd FlOpEDT
python manage.py shell
```

L'interpréteur Python va alors s'ouvrir.

Faites ensuite les commandes suivantes pour créer le TTModel : base servant à produire l'ensemble des contraintes
```python
from TTapp.TTModel import WeeksDatabase, TTModel
import base.models as models  
from MyFlOp.MyTTModel import MyTTModel
tp1 = models.TrainingProgramme.objects.get(abbrev=<mon departement>)
tt = MyTTModel(tp1.department.abbrev, [{"week":<ma semaine>, "year":<mon année>}], train_prog=tp1)
```
et veuillez à remplacer les informations entre chevrons (<>) par celles qui vous intéressent.

Pour lancer le solveur, faites :
```python
tt.solve(time_limit=300, solver='GUROBI')
```
Cela permettra d'écrire le fichier IIS et les fichiers d'analyse de l'infaisabilité

**Si vous ne voulez pas écrire le fichier IIS (et qu'il est déjà écrit)**, faites plutôt :
```python
tt.write_infaisability(write_iis=False)
```
Ils écrira les même fichiers à l'exception du fichier IIS.

#Scénario d'exécution
Pour suivre cet exemple, merci d'utilise le dump fourni dans le dossier
Prenons le cas où je veux lancer la semaine 5 de l'année 2020 pour le département INFO1.
Le lancement des commandes permettant de créer le TTModel (voir ci-dessus), vont permettre de créer les contraintes.

Ces contraintes sont sous deux formes : 
 - mathématiques (pour le solveur)
 - intelligibles (pour les fichier d'analyse de l'infaisabilité)
A chaque appel de add_constraint(), je passe en paramètre le couple (expression, relation, valeur) ainsi qu'un object 
Constraint, correspondant respectivement à la contrainte mathématique et intelligible.
Les contraintes intelligibles vont ainsi être stockée au fur et à mesure dans un objet appelé ConstraintManager (auquel 
le TTModel a accès).

Après avoir lancé le solveur (voir ci-dessus), TTModel va m'annoncer un échec du solveur et va donc écrire un fichier 
IIS contenant l'ensemble des contraintes mathématiques qui provoquent cette infaisabilité.
TTModel va alors aussi appelé la fonction handle_reduced_result() du ConstraintManager pour faire une analyse de cet 
échec.

Grâce au fichier IIS, le ConstraintManager va récupérer les id de toutes les contraintes qui provoquent l'infaisabilité 
de la solution, et ainsi récupéré leurs instances.
Il va pouvoir créer la structure occurs (dictionnaire) qui va lui permettre d'analyser les résultats.
En donnant cette structure à la méthode print_all du fichier print_infaisability, plusieurs fichiers vont être créés :
 - constraints_all : va contenir l'ensemble des contraintes qui n'ont pas fonctionné avec leurs dimensions (professeurs, 
cours, groupes etc.)
 - constraints_factorised : va donner le nombre de contraintes qui ont un certain type, professeurs etc.
 - constraints_sumarry : va donner une analyse de la raison de l'infaisabilité grâce aux types de contraintes les plus 
 récurrents

Il est possible d'augmenter la taille de l'analyse en augmentant les variables threshold_type et threshold_attr qui 
mesurent respectivement le pourcentage de types et de dimensions des contraintes à mettre en valeur dans cette analyse.

Pour chacun des fichiers (notamment IIS), un suffixe est ajouté au nom du fichier selon la semaine (et d'autres éléments
éventuellement) pour ne pas l'écrire sur un fichier différent déjà existant.

#Scénario développement - ajout d'un nouveau type de contrainte
L'analyse (fourni par le fichier constraints_summary) se nourrit des SpecificConstraint (classes dans le dossier 
specific_constraints héritant de Constraint). Pour pouvoir ajouter un nouveau type de contrainte, il faut tout d'abord
la créer dans le dossier specific_constraint, la faire hériter de Constraint, et lui définir la fonction 
get_summary_format() qui renvoie une chaine de caractère spécifique et une indication des dimensions devant être rempli 
par le ConstraintManager pour produire cette analyse.

Après cela, il suffit de modifier l'appel de add_constraint() du TTModel en remplaçant l'attribut Constraint par la 
contrainte créée.

Par exemple, si je veux créer la contrainte CourseConstraint :
 - je crée cette classe dans specific_constraint en tant que fille de Constraint
 - je crée son constructeur qui initialise la classe mère avec seulement l'attribut course
 - je crée la fonction get_summary_format() avec l'affichage adéquat :
    - output = "Le cours %s doit être placé"
 - et je précise dans cette même fonction, la dimension à remplir pour l'analyse :
    - dimensions = ["courses"]
 - enfin, je change dans TTModel l'appel à add_constraint() :
    - self.add_constraint(expr, '==', 1, Constraint(courses=c))
    - devient
    - self.add_constraint(expr, '==', 1, CourseConstraint(c))
