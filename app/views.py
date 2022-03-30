import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.http import JsonResponse
from django.http import HttpResponse, HttpResponseRedirect
from django.core.paginator import Paginator
from django.shortcuts import render
from django.urls import reverse

from .models import User, Task

@login_required(login_url='/login', redirect_field_name=None)
def index(request):
    return render(request, 'app/index.html')


def login_view(request):
    if request.method == 'POST':

        # Attempt to sign user in
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        # Check if authentication was successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('index'))
        else:
            return render(request, 'app/login.html', {
                'message': 'Invalid username and/or password'
            })
    else:
        return render(request, 'app/login.html')


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))


def register(request):
    if request.method == 'POST':
        username = request.POST['username']

        # Ensure password matches confirmation and that all fields were entered
        password = request.POST['password']
        confirmation = request.POST['confirmation']
        if not username or not password or not confirmation:
            return render(request, 'app/register.html', {
                'message': 'Must fill in all fields to register'
            })
        if password != confirmation:
            return render(request, 'app/register.html', {
                'message': 'Passwords must match'
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, password)
            user.save()
        except IntegrityError:
            return render(request, 'app/register.html', {
                'message': 'Username is already taken'
            })
        login(request, user)
        return HttpResponseRedirect(reverse('index'))
    else:
        return render(request, 'app/register.html')


# API Routes
@login_required
def load_tasks(request):

    # Filter for tasks associated with current user
    # Query for requested task
    try:
        tasks = Task.objects.filter(task_user=request.user)
    except Task.DoesNotExist:
        tasks = []
        return JsonResponse(tasks, safe=False, status=204)

    # Return tasks in chronological order
    return JsonResponse([task.serialize() for task in tasks], safe=False)


@csrf_exempt
@login_required
def add_task(request):

    # Must be via POST
    if request.method != 'POST':
        return JsonResponse({'error': 'POST or PUT request required'}, status=400)

    # Store task obj passed from JS file as data
    data = json.loads(request.body)
    user = request.user

    # Get contents of task obj
    name = data.get('name', '')
    status = data.get('status', '')
    type  = data.get('type', '')

    # Save task
    task = Task(task_user=user, name=name, status=status, type=type)
    task.save()

    return JsonResponse({'message': 'Task saved successfully'}, status=201)


@csrf_exempt
@login_required
def save_task(request, task_id):

    # Updating a task must be done via PUT
    if request.method != 'PUT':
        return JsonResponse({'error': 'PUT request is required'}, status=400)

    # Query for requested task
    try:
        task = Task.objects.get(task_user=request.user, pk=task_id)
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task not found'}, status=404)

    # Update the task
    data = json.loads(request.body)
    task.name = data.get('name', '')
    task.status = data.get('status', '')
    task.type  = data.get('type', '')
    task.save()

    return HttpResponse(status=204)


@csrf_exempt
@login_required
def delete_task(request, task_id):

    # Updating a task must be done via PUT
    if request.method != 'DELETE':
        return JsonResponse({'error': 'DELETE request is required'}, status=400)

    # Query for requested task
    try:
        task = Task.objects.get(task_user=request.user, pk=task_id)
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task not found'}, status=404)

    # Delete the task
    task.delete()

    return HttpResponse(status=204)