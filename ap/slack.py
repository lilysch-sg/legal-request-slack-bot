from flask import Flask, request
import json
import os

app = Flask(__name__)

def handler(request):
    if request.method == "POST":
        try:
            data = request.get_json()
            if data and 'challenge' in data:
                return data['challenge'], 200, {'Content-Type': 'text/plain'}
            return 'OK', 200
        except:
            return 'Error', 500
    return 'Bot running!', 200
