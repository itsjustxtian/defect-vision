#This script is stored in the Raspberry Pi and is configured to run on startup

import base64
import json
import os
import subprocess
import pymongo
from inference_sdk import InferenceHTTPClient
from datetime import datetime
from flask import Flask, request, jsonify
from pyngrok import ngrok
from gpiozero import LED
from gpiozero import Buzzer
from time import sleep
import threading
import socket
import cv2
import io

CAMERA_INDEX = 0
IMAGE_RESOLUTION = '1920x1080'


app = Flask(__name__)

#Parts of this script were purposely removed for security purposes
connection_string = ""
client = pymongo.MongoClient(connection_string)

db = client['']
collection = db['']

roboflow_client = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key=""
)

AUTH_TOKEN = ""

try:
    red = LED(19)
    green = LED(26)
    bz = Buzzer(16)
except Exception as e:
    print(f"GPIO initialization failed: {e}. Running in a non-GPIO environment.")
  
    class DummyDevice:
        def on(self): pass
        def off(self): pass
    red = DummyDevice()
    green = DummyDevice()
    bz = DummyDevice()

def gpio_success_sequence():
    """Sequence for a successful API call: green LED on and buzzer beeps."""
    print("Running GPIO success sequence...")
    bz.on()
    green.on()
    sleep(0.2)
    green.off()
    bz.off()
    sleep(0.2)
    green.on()
    bz.on()
    sleep(0.2)
    bz.off()
    print("GPIO success sequence complete.")

def gpio_error_sequence():
    """Sequence for an error: red LED on and buzzer beeps."""
    print("Running GPIO error sequence...")
    green.off()
    red.on()
    bz.on()
    sleep(0.2)
    bz.off()
    sleep(0.2)
    bz.on()
    sleep(0.2)
    bz.on()
    sleep(0.2)
    bz.off()
    red.off()
    green.on()
    print("GPIO error sequence complete.")

@app.route('/run-python-script', methods=['POST'])
def run_script():
    auth_header = request.headers.get('Authorization')
    token = auth_header.split(" ")[1] if auth_header and " " in auth_header else auth_header
    
    if token != AUTH_TOKEN:
        threading.Thread(target=gpio_error_sequence).start()
        return jsonify({"status": "error", "message": "Unauthorized"}), 401

    try:
        data = request.get_json()
        email = data.get("email", "unknown@example.com")
        
        image_name = f"Capture_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"

        temp_file_path = f"/tmp/{image_name}" 
        
        try:
            print(f"Attempting to capture image via fswebcam to {temp_file_path}...")
            
            subprocess.run([
                'fswebcam', 
                '-r', IMAGE_RESOLUTION, 
                '--no-banner',
                temp_file_path
            ], check=True, capture_output=True, text=True)
            
        except subprocess.CalledProcessError as e:
            threading.Thread(target=gpio_error_sequence).start()
            print(f"fswebcam failed: {e.stderr}")
            return jsonify({
                "status": "error", 
                "message": "Failed to capture image via fswebcam. Check camera status.",
                "details": e.stderr.strip()
            }), 500
        
        try:
            with open(temp_file_path, 'rb') as f:
                image_bytes = f.read()
        
        finally:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
            
        if not image_bytes:
            threading.Thread(target=gpio_error_sequence).start()
            return jsonify({"status": "error", "message": "Captured image file was empty."}), 500

        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        result = roboflow_client.run_workflow(
            workspace_name="itsjustxtian",
            workflow_id="detect-count-and-visualize",
            
            images={"image": image_base64},
            
            use_cache=False
        )


        if isinstance(result, list) and len(result) > 0:
            first_result = result[0]
        else:
            threading.Thread(target=gpio_error_sequence).start()
            return jsonify({"status": "error", "message": "Roboflow API did not return a valid result."}), 500

        first_result['image_name'] = image_name
        first_result['timestamp'] = datetime.now()
        first_result['email'] = email
        
        insertion_result = collection.insert_one(first_result)

        threading.Thread(target=gpio_success_sequence).start()

        return jsonify({
            "status": "success",
            "message": "Result inserted into MongoDB.",
            "inserted_id": str(insertion_result.inserted_id)
        })

    except Exception as e:
        threading.Thread(target=gpio_error_sequence).start()
        return jsonify({
            "status": "error",
            "message": "An error occurred during script execution.",
            "error": str(e)
        }), 500

@app.route('/ngrok-status', methods=['GET'])
def ngrok_status():
    tunnels = ngrok.get_tunnels()
    if tunnels:
        threading.Thread(target=gpio_success_sequence).start()
        return jsonify({
            "status": "active",
            "tunnels": [t.public_url for t in tunnels]
        })
    else:
        threading.Thread(target=gpio_error_sequence).start()
        return jsonify({
            "status": "inactive",
            "message": "No ngrok tunnel is currently running."
        })


if __name__ == "__main__":
    static_domain = "see-perturbable-hayes.ngrok-free.app"
    try:
        public_url = ngrok.connect(5000, domain=static_domain).public_url
        print(f"Public ngrok URL: {public_url}")
        print("Keep this terminal open. The Flask server is now running.")
        threading.Thread(target=gpio_success_sequence).start()
        app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)
    except Exception as e:
        threading.Thread(target=gpio_error_sequence).start()
        print(f"Failed to start ngrok tunnel with static domain: {e}")
