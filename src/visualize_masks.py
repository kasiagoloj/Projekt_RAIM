import json
import io
import base64
from pycocotools import mask
import numpy as np
from PIL import Image
from flask import Flask, jsonify
from flask_cors import CORS
from skimage.draw import polygon

app = Flask(__name__)
CORS(app)

with open("annotations.json") as f:
    data = json.load(f)

category_colors = {
    1: (1.0, 0.6, 0.6),  # pastelowy czerwony
    2: (0.6, 1.0, 0.6),  # pastelowy zielony
    3: (0.6, 0.6, 1.0),  # pastelowy niebieski
    4: (1.0, 1.0, 0.6),  # pastelowy żółty
    5: (1.0, 0.6, 1.0),  # pastelowy różowy
    6: (0.6, 1.0, 1.0),  # pastelowy cyjan
}

def brighten(color, factor=0.5):
    return tuple(min(1.0, c + factor) for c in color)

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

def create_colored_mask(height, width, annotations):
    rgba_mask = np.zeros((height, width, 4), dtype=np.uint8)  # RGBA

    for annotation in annotations:
        segmentation = annotation['segmentation']
        category_id = annotation.get('category_id', 0)
        base_color = category_colors.get(category_id, (1.0, 1.0, 1.0))  # domyślnie biały
        color = brighten(base_color, 0.5)

        if isinstance(segmentation, list):
            decoded_mask = create_mask_from_contours(segmentation, width, height)
        else:
            decoded_mask = decode_mask(segmentation, width, height)

        for i in range(3):
           rgba_mask[:, :, i] = np.maximum(
               rgba_mask[:,:,i],
               (decoded_mask.astype(np.uint8)*int(color[i]*255))
           )
        rgba_mask[:, :, 3] = np.maximum(rgba_mask[:, :, 3], decoded_mask.astype(np.uint8) * 255)

    return Image.fromarray(rgba_mask, mode='RGBA')

@app.route('/masks')
def get_all_masks():
    result = {}
    for img in data['images']:
        image_id = img['id']
        file_name = img['file_name']
        width, height = img['width'], img['height']
        annotations_for_image = [ann for ann in data['annotations'] if ann['image_id'] == image_id]

        #print(f"Obraz: {file_name} (ID: {image_id})")
        #print(f"Liczba adnotacji (masek): {len(annotations_for_image)}")
        #print(f"Przykładowa adnotacja: {annotations_for_image[0] if annotations_for_image else 'brak'}\n")

        mask_img = create_colored_mask(height, width, annotations_for_image)

        buffered = io.BytesIO()
        mask_img.save(buffered, format="PNG")
        mask_b64 = base64.b64encode(buffered.getvalue()).decode()

        #print("mask_b64:", mask_b64)


        result[file_name] = mask_b64

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)