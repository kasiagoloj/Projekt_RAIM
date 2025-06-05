import json
import matplotlib.pyplot as plt
from pycocotools import mask
import numpy as np
from PIL import Image
from skimage.draw import polygon
import os
from flask import Flask, jsonify, send_from_directory

app = Flask(__name__)
INPUT_FOLDER = 'static/input'
MASKS_FOLDER = "static/masks"
os.makedirs(MASKS_FOLDER, exist_ok=True)

with open("annotations.json") as f:
    data = json.load(f)

category_colors = {
    1: (0.40, 0.89, 0.40),      # zielony
    2: (0.38, 0.54, 0.98),      # błękitny
    3: (0.98, 0.94, 0.40),      # żółty
    4: (1.00, 0.70, 0.43),      # pomarańczowy
    5: (0.95, 0.45, 0.98),      # różowy
    6: (0.45, 0.38, 0.98),      # fioletowy
    7: (1.00, 0.32, 0.32),      # czerwony
    8: (0.07, 0.00, 1.00),      # granatowy
    9: (0.40, 0.70, 0.70),      # turkusowy
    10:(0.90, 0.60, 0.30),      # pomarańczowy inny
    11:(1.00, 0.00, 1.00),      # różowy intensywny
}

def brighten(color, factor=0.5):
    return tuple(min(1.0, c * (1 + factor)) for c in color)

def decode_mask(encoded_mask, width, height):
    if isinstance(encoded_mask['counts'], list):
        # Nieskompresowany RLE
        rle_mask = mask.frPyObjects(encoded_mask, height, width)
    else:
        # Skompresowany RLE (string), nie trzeba konwertować
        rle_mask = encoded_mask

    return mask.decode(rle_mask)

def create_mask_from_contours(contours, width, height):
    mask_image = np.zeros((height, width), dtype=np.uint8)
    for contour in contours:
        polygon_points = np.array(contour).reshape((-1, 2))
        rr, cc = polygon(polygon_points[:, 1], polygon_points[:, 0], mask_image.shape)
        mask_image[rr, cc] = 1
    return mask_image

images = data['images']
annotations = data['annotations']

for img_info in images:
    img_id = img_info['id']
    file_name = img_info['file_name']
    width = img_info['width']
    height = img_info['height']

    img = Image.open(f'images/{file_name}')

    # jedna wspólna maska dla wszystkich anotacji z tego obrazka
    combined_mask = np.zeros((height, width, 3), dtype=np.uint8)

    for annotation in annotations:
        if annotation['image_id'] == img_id:
            segmentation = annotation['segmentation']
            category_id = annotation.get('category_id', 0)

            base_color = category_colors.get(category_id, (1.0, 1.0, 1.0))  # domyślnie biały
            color = brighten(base_color, 0.5)

            if isinstance(segmentation, list):
                decoded_mask = create_mask_from_contours(segmentation, width, height)
            else:
                decoded_mask = decode_mask(segmentation, width, height)

            for i in range(3):
                combined_mask[:, :, i][decoded_mask == 1] = int(color[i] * 255)

            #plt.imshow(colored_mask, alpha=0.5)
            mask_filename = os.path.splitext(file_name)[0] + f".png"
            mask_path = os.path.join(MASKS_FOLDER, mask_filename)

            # Konwertujemy macierz numpy do obrazu i zapisujemy jako PNG
            mask_image = Image.fromarray(combined_mask)

            mask_image.save(mask_path)

@app.route('/frames')
def get_frames():
    frames = []
    for filename in os.listdir(INPUT_FOLDER):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            name, _ = os.path.splitext(filename)
            mask_filename = f"{name}.png"
            mask_path = os.path.join(MASKS_FOLDER, mask_filename)
            if os.path.exists(mask_path):
                frames.append({
                    "file_name": filename,
                    "preview": f"/input/{filename}",
                    "mask": f"/masks/{mask_filename}"
                })
    return jsonify(frames)

# Do serwowania obrazów
@app.route('/input/<filename>')
def input_image(filename):
    return send_from_directory(INPUT_FOLDER, filename)

@app.route('/masks/<filename>')
def mask_image(filename):
    return send_from_directory(MASKS_FOLDER, filename)