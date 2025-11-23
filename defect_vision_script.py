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
# from RPLCD.i2c import CharLCD
import socket

# # Setup For I2C Connection
# lcd = CharLCD('PCF8574', 0x27)
# lcd.clear()

# # Function to get the IP Address of the Device
# def get_ip():
#     try:
#         s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
#         s.connect(("8.8.8.8", 80))
#         ip = s.getsockname()[0]
#         s.close()
#         return ip
#     except Exception as e:
#         return "IP Error"

# # Function to display the IP
# def display_ip():
#     lcd.clear()
#     lcd.write_string("IP Address:")
#     lcd.crlf()
#     lcd.write_string(get_ip()[:16])  # Limit to 16 chars

# # Function to help scroll the message in case of overflow
# def scroll_text(line1, line2="", delay=0.3, duration=10):
#     lcd.clear()
#     max_len = max(len(line1), len(line2))
#     window_size = 16
#     steps = max(1, max_len - window_size + 1)
#     start_time = time.time()

#     while time.time() - start_time < duration:
#         for i in range(steps):
#             lcd.clear()
#             lcd.cursor_pos = (0, 0)
#             lcd.write_string(line1[i:i+window_size].ljust(window_size))
#             lcd.cursor_pos = (1, 0)
#             lcd.write_string(line2[i:i+window_size].ljust(window_size))
#             time.sleep(delay)
#             if time.time() - start_time >= duration:
#                 break

# # Function to display the error and then go back to displaying the IP
# def display_error_then_revert(message):
#     def show_then_revert():
#         scroll_text("Error:", message, delay=0.4, duration=10)
#         display_ip()
#     threading.Thread(target=show_then_revert).start()

# # Display successful message
# def display_success(message="Ready"):
#     def show_then_revert():
#         scroll_text("Success:", message, delay=0.4, duration=10)
#         display_ip()
#     threading.Thread(target=show_then_revert).start()

CAMERA_INDEX = 0
IMAGE_RESOLUTION = '1920x1080'

# IMPORTANT: Set your ngrok Authtoken here for a more stable tunnel.
# You can get one from your ngrok dashboard.
# ngrok.set_auth_token("YOUR_NGROK_AUTH_TOKEN")

app = Flask(__name__)

# Your MongoDB Atlas connection string.
# Make sure to replace <username> and <password> with your credentials.
# Also, change the database and collection names as needed.
connection_string = "mongodb+srv://itsjustxtian:christianocon1995@defect-vision.wexfbdl.mongodb.net/?retryWrites=true&w=majority&appName=defect-vision"
client = pymongo.MongoClient(connection_string)

# Connect to your database and a specific collection.
db = client['defect-vision']
collection = db['development']

# Your Roboflow workflow code.
roboflow_client = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key="Hcxhij7firFhDW2L4n4y"
)

# IMPORTANT: This token must match the one in your Next.js app.
AUTH_TOKEN = "v6Rl8fhspdf8QGeQAhBwhgji2x4Kf50r"

try:
    red = LED(19)
    green = LED(26)
    bz = Buzzer(16)
except Exception as e:
    print(f"GPIO initialization failed: {e}. Running in a non-GPIO environment.")
    # Create dummy classes to prevent errors if not on a Pi
    class DummyDevice:
        def on(self): pass
        def off(self): pass
    red = DummyDevice()
    green = DummyDevice()
    bz = DummyDevice()

# --- Threaded GPIO Functions ---
# These functions will run in separate threads to avoid blocking the main app.
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
        
        # Define the file paths and names
        image_name = f"Capture_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        # Use /tmp for temporary files, which is cleared on reboot
        temp_file_path = f"/tmp/{image_name}" 

        # --- STEP 1: CAPTURE IMAGE USING FSWEBCAM ---
        
        try:
            print("Waiting 2 seconds for camera auto-exposure to adjust...")
            # *** ADDED 2-SECOND DELAY HERE ***
            sleep(2);

            print(f"Attempting to capture image via fswebcam to {temp_file_path}...")
            
            # Run fswebcam command to capture and save the image
            subprocess.run([
                'fswebcam', 
                '-r', IMAGE_RESOLUTION, 
                '--no-banner',        # Removes the timestamp banner from the image
                temp_file_path
            ], check=True, capture_output=True, text=True)
            
        except subprocess.CalledProcessError as e:
            # display_error_then_revert(str(e))
            # fswebcam failed (e.g., camera not connected or permission denied)
            threading.Thread(target=gpio_error_sequence).start()
            print(f"fswebcam failed: {e.stderr}")
            # display_error_then_revert(e)
            return jsonify({
                "status": "error", 
                "message": "Failed to capture image via fswebcam. Check camera status.",
                "details": e.stderr.strip()
            }), 500
        
        # 2. Read the image bytes from the temporary file and prepare for upload
        try:
            with open(temp_file_path, 'rb') as f:
                image_bytes = f.read()
        
        finally:
            # 3. CRUCIAL: Clean up the temporary file immediately
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
            
        if not image_bytes:
            threading.Thread(target=gpio_error_sequence).start()
            return jsonify({"status": "error", "message": "Captured image file was empty."}), 500

        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        # --- STEP 2: Run Roboflow workflow using image file object ---
        result = roboflow_client.run_workflow(
            workspace_name="itsjustxtian",
            workflow_id="detect-count-and-visualize",
            
            # CRITICAL FIX: Pass the base64 string directly
            images={"image": image_base64},
            
            use_cache=False
        )


        if isinstance(result, list) and len(result) > 0:
            first_result = result[0]
        else:
            threading.Thread(target=gpio_error_sequence).start()
            return jsonify({"status": "error", "message": "Roboflow API did not return a valid result."}), 500

        # --- STEP 3: Add metadata ---
        first_result['image_name'] = image_name
        first_result['timestamp'] = datetime.now()
        first_result['email'] = email
        
        # --- STEP 4: Insert into MongoDB ---
        insertion_result = collection.insert_one(first_result)

        threading.Thread(target=gpio_success_sequence).start()
        # display_success("Result inserted into MongoDB.")

        return jsonify({
            "status": "success",
            "message": "Result inserted into MongoDB.",
            "inserted_id": str(insertion_result.inserted_id)
        })

    except Exception as e:
        # Catch-all error handling
        threading.Thread(target=gpio_error_sequence).start()
        # display_error_then_revert(e)
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
        # display_success("Ngrok tunnel is active!")
        return jsonify({
            "status": "active",
            "tunnels": [t.public_url for t in tunnels]
        })
    else:
        threading.Thread(target=gpio_error_sequence).start()
        # display_error_then_revert("No ngrok tunnel is currently running.")
        return jsonify({
            "status": "inactive",
            "message": "No ngrok tunnel is currently running."
        })
    
if __name__ == "__main__":
    import time
    # display_ip()

    static_domain = "see-perturbable-hayes.ngrok-free.app"
    MAX_RETRIES = 3

    for attempt in range(MAX_RETRIES):
        try:
            public_url = ngrok.connect(5000, domain=static_domain).public_url
            print(f"Public ngrok URL: {public_url}")
            print("Keep this terminal open. The Flask server is now running.")
            threading.Thread(target=gpio_success_sequence).start()
            app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)
            break
        except Exception as e:
            print(f"Attempt {attempt+1} failed: {e}")
            # display_error_then_revert(str(e))
            time.sleep(5)
    else:
        threading.Thread(target=gpio_error_sequence).start()
        print("All attempts to connect to ngrok failed.")
        exit(1)
