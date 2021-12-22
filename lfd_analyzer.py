import json
import scipy.stats
import cv2
import numpy as np
from scipy.signal import find_peaks
import pandas as pd
import plotly.graph_objects as go
import plotly
import base64
import argparse
from PIL import Image
from io import BytesIO


parser = argparse.ArgumentParser()
requiredNamed = parser.add_argument_group('required named arguments')
requiredNamed.add_argument('-f', action='store', dest='lfd_image',
                    help='lfd image', required=True)
requiredNamed.add_argument('-s', action='store', dest='settings',
                    help='settings', required=True)
requiredNamed.add_argument('--version', action='version', version='%(prog)s 1.0')

results = parser.parse_args()
# we should have results.settings now
#print(results.settings)

def stringToRGB(base64_string):
    imgdata = base64.b64decode(str(base64_string))
    #image_result = open('test.jpg', 'wb') # create a writable image and write the decoding result
    #image_result.write(imgdata)
    image = Image.open(BytesIO(imgdata))
    return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

def calibrate(y,a,b,c,d):
    x = c*((((a-d)/(y-d))-1)**(1/b))
    return x

def white_balance(img):
    result = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    avg_a = np.average(result[:, :, 1])
    avg_b = np.average(result[:, :, 2])
    result[:, :, 1] = result[:, :, 1] - ((avg_a - 128) * (result[:, :, 0] / 255.0) * 1.1)
    result[:, :, 2] = result[:, :, 2] - ((avg_b - 128) * (result[:, :, 0] / 255.0) * 1.1)
    result = cv2.cvtColor(result, cv2.COLOR_LAB2BGR)
    return result

def my_mean(sample):
    return sum(sample)/len(sample)

# img=cv2.imread("2456.jpg")
img = stringToRGB(results.lfd_image)
#img = white_balance(img)

img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# remove noise
se=cv2.getStructuringElement(cv2.MORPH_RECT , (5,5))
bg=cv2.morphologyEx(img, cv2.MORPH_DILATE, se)
out_gray=cv2.divide(img, bg, scale=255)
#out_binary=cv2.threshold(out_gray, 0, 255, cv2.THRESH_OTSU )[1]
#cv2.imwrite('binary.png',out_binary)
#cv2.imwrite('gray.png',out_gray)
#blur = cv2.blur(img,(2,2))
#blur = cv2.blur(out_gray,(2,2))
img = out_gray
#img = blur
#img = img.astype(np.uint8)
img2 = img
img = cv2.bitwise_not(img)
rows,cols = img.shape
x = range(0,rows,1)

y = []
for i in range(rows):
    y.append(my_mean(img[i,:]))

y_offset = []
for y_pos in y:
   y_offset.append(y_pos-min(y))
#y_offset = y


data_matrix = list(zip(x,y_offset))
data_matrix = pd.DataFrame(data_matrix,columns=["position","intensity"])
intensities = data_matrix["intensity"]
indices = find_peaks(intensities, prominence=5, distance=20)[0]
prominences = scipy.signal.peak_prominences(intensities, indices, wlen=None)
tMin = scipy.signal.argrelmin(intensities.values)[0]
aucs = []

# get two highest peaks
if len(intensities) >= 2:
    new_intensity_order = sorted([intensities[i] for i in indices], reverse=True)[0:2]
else:
    new_intensity_order = intensities
new_indices = [x for x in indices if intensities[x] in new_intensity_order]
minima = []
minima_pairs = []
for i in new_indices:
    left_min = intensities[(i-5):i].idxmin()
    right_min = intensities[i:(i+5)].idxmin()
    #left_min = [x for x in tMin if x < i][-1]
    #right_min = [x for x in tMin if x > i][0]
    y = intensities[left_min:right_min]
    minima.append(left_min)
    minima.append(right_min)
    minima_pairs.append((left_min,right_min))
    integral = sum(intensities[left_min:right_min])
    aucs.append(integral)

sum_integral = sum(aucs)
percentages = []
for a in aucs:
    percentage = (a / sum_integral) * 100
    percentages.append(percentage)


fig = go.Figure()
fig.add_trace(go.Scatter(
    y=intensities,
    mode='lines+markers',
    name='Original Plot'
))

fig.add_trace(go.Scatter(
    x=indices,
    y=[intensities[j] for j in indices],
    mode='markers',
    marker=dict(
        size=8,
        color='red',
        symbol='cross'
    ),
    name='Detected Peaks'
))
fig.add_trace(go.Scatter(
    x=minima,
    y=[intensities[j] for j in minima],
    mode='markers',
    marker=dict(
        size=8,
        color='green',
        symbol='cross'
    ),
    name='Detected Minima'
))

for minima_pair in minima_pairs:
    fig.add_shape(type='line',
                    x0=minima_pair[0],
                    y0=intensities[minima_pair[0]],
                    x1=minima_pair[1],
                    y1=intensities[minima_pair[1]],
                    line=dict(color='Red',),
                    xref='x',
                    yref='y'
    )
    fig.add_trace(go.Scatter(
        x0=minima_pair[0],
        y=intensities[minima_pair[0]:(minima_pair[1]+1)],
        fill='toself'
    ))

#fig.write_html("new_test.html")
# convert graph to PNG and encode it
png = plotly.io.to_image(fig)
png_base64 = base64.b64encode(png).decode('ascii')

results = {
    "AUCs": aucs,
    "Percentages": percentages,
    "c/t": aucs[1] / aucs[0],
    "t/c": aucs[0] / aucs[1],
    "Plot": png_base64

}


# convert into JSON:
json_results = json.dumps(results)
print(json_results)