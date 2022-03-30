from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('register', views.register, name='register'),

    # API Routes
    path('tasks', views.load_tasks, name='load'),
    path('tasks/add', views.add_task, name='add'),
    path('tasks/save/<int:task_id>', views.save_task, name='save'),
    path('tasks/delete/<int:task_id>', views.delete_task, name='delete'),
]