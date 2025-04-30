import json
import matplotlib.pyplot as plt
from pycocotools import mask
import numpy as np
from PIL import Image
from skimage.draw import polygon

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


"""def decode_mask(encoded_mask, width, height):
    rle_mask = mask.frPyObjects(encoded_mask, height, width)
    decoded_mask = mask.decode(rle_mask)
    return decoded_mask
"""

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

    plt.figure(figsize=(8, 8))
    plt.imshow(img)
    plt.axis('off')

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

            colored_mask = np.zeros((height, width, 3), dtype=np.uint8)
            for i in range(3):
                colored_mask[:, :, i] = decoded_mask.astype(np.uint8) * int(color[i] * 255)

            plt.imshow(colored_mask, alpha=0.5)

    plt.show()