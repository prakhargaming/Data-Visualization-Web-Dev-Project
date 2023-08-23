from flask import Flask, request,jsonify
from flask_socketio import SocketIO,emit
import numpy as np
from PIL import Image
from typing import Iterable
from flask_cors import CORS
import base64
import cv2
from io import BytesIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app,resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app,cors_allowed_origins="*")


imagePathsStr = "./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0009_34.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0074_59.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0014_89.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0031_100.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0010_796097.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0023_796059.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0040_796066.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0089_796069.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0067_170.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0060_796076.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0056_796078.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0080_796096.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0017_796098.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0019_796104.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0057_796106.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0041_796108.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0071_796113.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0077_796114.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0032_796115.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0038_212.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0079_796122.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0036_796127.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0039_796132.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0068_796135.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0069_796139.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0063_796141.jpg,./data/waterbirds_v1.0/001.Black_footed_Albatross/Black_Footed_Albatross_0081_426.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0003_1033.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0044_784.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0071_792.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0065_809.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0061_563.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0085_564.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0005_565.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0025_571.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0092_834.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0013_910.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0047_619.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0088_883.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0076_671.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0096_673.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0056_500.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0006_702.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0073_927.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0040_472.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0100_735.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0029_482.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0018_492.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0083_756.jpg,./data/waterbirds_v1.0/002.Laysan_Albatross/Laysan_Albatross_0094_1013.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0038_1065.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0031_1066.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0043_1076.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0063_1101.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0070_796346.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0032_1149.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0045_1162.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0073_1171.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0074_1221.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0021_796339.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0064_796343.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0017_796349.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0075_796352.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0025_796361.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0072_796371.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0014_796373.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0040_796375.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0019_796391.jpg,./data/waterbirds_v1.0/003.Sooty_Albatross/Sooty_Albatross_0022_796398.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0071_1559.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0105_1562.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0090_1567.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0019_1585.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0036_1604.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0007_1615.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0051_1650.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0015_1653.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0076_1661.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0002_1670.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0047_1706.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0077_1724.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0023_1485.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0004_1528.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0056_1493.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0058_1751.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0027_1754.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0055_1501.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0065_1502.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0006_1763.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0061_1510.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0032_1776.jpg,./data/waterbirds_v1.0/004.Groove_billed_Ani/Groove_Billed_Ani_0012_1784.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0061_794904.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0010_794907.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0029_1824.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0013_794914.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0047_794918.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0005_794922.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0032_794931.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0045_794940.jpg,./data/waterbirds_v1.0/005.Crested_Auklet/Crested_Auklet_0001_794941.jpg"
imagePaths = imagePathsStr.split(',');

# def createBase64ImageGrid(images):
#     grid_rows = 3
#     grid_cols = 3
#     image_height, image_width = images[0].shape
    
#     grid_image = np.zeros((image_height * grid_rows, image_width * grid_cols), dtype=np.uint8)
#     print(grid_image.shape)
#     for i in range(len(images)):
#         grid_image[i * image_width:(i + 1) * image_width][i * image_height:(i + 1) * image_height] = images[i]
    
#     return grid_image

def combine_images(columns, space, images):
    rows = len(images) // columns
    if len(images) % columns:
        rows += 1
    width_max = max([image.width for image in images])
    height_max = max([image.height for image in images])
    background_width = width_max*columns + (space*columns)-space
    background_height = height_max*rows + (space*rows)-space
    background = Image.new('RGBA', (background_width, background_height), (255, 255, 255, 255))
    x = 0
    y = 0
    for i, image in enumerate(images):
        img = image
        x_offset = int((width_max-img.width)/2)
        y_offset = int((height_max-img.height)/2)
        background.paste(img, (x+x_offset, y+y_offset))
        x += width_max + space
        if (i+1) % columns == 0:
            y += height_max + space
            x = 0
    background.save('image.png')
    return background

def ImagetoBase64(image):       
    if isinstance(image, np.ndarray):
        pil_img = Image.fromarray(image)
        buff = BytesIO()
        pil_img.save(buff, format="JPEG")
        new_image_string = base64.b64encode(buff.getvalue()).decode("utf-8")
        return new_image_string
    else:
        image_byte_array = BytesIO()
        image = image.convert("RGB")
        image.save(image_byte_array, format="JPEG")
        encodedString = base64.b64encode(image_byte_array.getvalue()).decode('utf-8')
        return encodedString


@app.route("/http-call")
def http_call():
    """return JSON with string data as the value"""
    data = {'data':'This text was fetched using an HTTP call to server on render'}
    return jsonify(data)

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print(request.sid)
    print("client has connected")
    emit("connect",{"data":f"id: {request.sid} is connected"})

@socketio.on('data')
def handle_message(data):
    """event listener when client types a message"""
    with open("./feFeet.png", "rb") as img_file:
        data = "data:image/png;base64," + str(base64.b64encode(img_file.read()))[2:]
    print("data from the front end: ",data)
    emit("data",{'data':data,'id':request.sid},broadcast=True)

@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected")
    emit("disconnect",f"user {request.sid} disconnected",broadcast=True)

@socketio.on("points")
def pointsFromClient(pointsList):
    """Event listener when points are received from the client"""
    print(pointsList["index"])
    if not pointsList["index"] or len(pointsList["index"]) > 9:
        print("#########")
        if not len(pointsList["index"]) > 9:
            print("POINTS: No points have been received")
        else:
            print("POINTS: Too many points")
        print("--------")
        return
    else:
        print("POINTS: ", pointsList)
        print("#########")

        tempImagePaths = []
        for indicies in pointsList["index"]:
            tempImagePaths.append(imagePaths[indicies])
        
        images = []
        dim = (224, 224) 
        for paths in tempImagePaths:
            imageOriginal = Image.open(paths)
            imageCopy = imageOriginal.copy()
            images.append(imageCopy.resize(dim))

        if len(pointsList["index"]) == 1:
            img_grid = ImagetoBase64(images[0])    
        else:
            img_grid = combine_images(3, 3, images=images)
            img_grid = ImagetoBase64(img_grid)
        print("--------")

        f = open("demofile3.txt", "w")
        f.write(img_grid)
        f.close()
        emit("image_data", img_grid, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True,port=5001)
