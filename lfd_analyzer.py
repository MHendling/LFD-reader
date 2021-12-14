import base64
from PIL import Image
from io import BytesIO
import cv2
import numpy as np
import matplotlib.pyplot as plt, mpld3
import argparse

parser = argparse.ArgumentParser()
requiredNamed = parser.add_argument_group('required named arguments')
requiredNamed.add_argument('-f', action='store', dest='lfd_image',
                    help='lfd image', required=True)
requiredNamed.add_argument('-s', action='store', dest='settings',
                    help='settings', required=True)
requiredNamed.add_argument('--version', action='version', version='%(prog)s 1.0')

results = parser.parse_args()
# we should have results.settings now
print(results.settings.a)

def stringToRGB(base64_string):
    imgdata = base64.b64decode(str(base64_string))
    image = Image.open(BytesIO(imgdata))
    return cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)

#im = Image.open(BytesIO(base64.b64decode(results.lfd_image)))
#im.save('image.png', 'PNG')

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

#img = cv2.imread(r'R:\100_HMD\Team_Stuff\Hendling_Michaela\MobileReadOut\2130-2133-35min.jpg')
img = stringToRGB(results.lfd_image)
img = white_balance(img)
img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
cv2.imwrite("test.jpg",img)
img = cv2.bitwise_not(img)
rows,cols = img.shape
x = range(0,rows,1)
# for j in range(cols):
#     y = img[:,j]
#     plt.plot(x, y)
# plt.show()

y = []
for i in range(rows):
    y.append(my_mean(img[i,:]))
fig = plt.figure()
plt.plot(x,y)
html = mpld3.fig_to_html(fig)
with open("test.html","a") as testfile:
    testfile.write(html)
print(html)
#print("<p>hello</p>")
