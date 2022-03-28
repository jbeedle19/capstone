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

from .models import User

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