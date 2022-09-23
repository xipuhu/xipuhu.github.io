---
title: Practical Python and OpenCV
categories: [计算机视觉]
tags: [图像处理,Opencv]
mathjax: true
toc: true
---

### Chapter 3 – loading,displaying, and saving

1、参数解析库argparse的使用:

<!--more-->

```python
ap = argparse.ArgumentParser() 
ap.add_argument("-i", "--image", required = True,help = "Path to the image") 
args = vars(ap.parse_args())
```

2、loading :

```python
image = cv2.imread(args["image"])
```

3、displaying:

```python
cv2.imshow("Image", image)  
cv2.waitkey(0)   　　# 必须加上，不然图像显示会闪
```

4、saving:

```python
cv2.imwrite("newimage.jpg", image)
```

5、一种打印格式:

```python
print("height: {} pixels".format(image.shape[0]))
```

### Chapter 4 – Image Basics

#### 关于图像坐标的两个问题

1、图像的原点(0, 0)是从图像的左上角开始，随着我们向右和向下移动，图像会增加：

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/01.png"></div>
2、当我们使用**(x, y)**来指定像素的时候，在代码中，x表示numpy矩阵中列数(col)，y表示numpy矩阵中的行数(row)，<span class="blockFont">即图像的width和height分别对应于矩阵的第二维shape[1]和第一维shape[0]</span>。

### Chapter 5 – Drawing

1、line:

```python
canvas = np.zeros((300, 300, 3), dtype = "uint8")
green = (0, 255, 0)
cv2.line(canvas, (0, 0), (300, 300), green)
```

2、rectangle：

```python
cv2.rectangle(canvas, (50, 200), (200, 225), red, 5)　　  # 最后一个参数5表示画矩形的线的粗细
cv2.rectangle(canvas, (200, 50), (225, 125), blue, -1)　　 # -1表示以填充方式画矩形
```

3、circle：

```python
cv2.circle(canvas, (centerX, centerY), r, white)
```

4、枚举类型**enumerate**的使用：

```python
for (row, y) in enumerate(range(0, 10, 2)) 
print(row,y)　　# (0, 0) (1, 2) (2, 4) (3, 6) (4, 8)
```

最后的效果图如下：

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/02.png"></div>

### Chapter 6 – Image Processing

#### Transformations

1、Translation：

```python
M = np.float32([[1, 0, 25], [0, 1, 50]]) 　# 第一个参数表示左右移动(正值为右)，第二个参数表示上下移动(正值为下)
shifted = cv2.warpAffine(image, M, (image.shape[1], image.shape[0])) # shape[1]表示图像长度，shape[0]表示图像高度
cv2.imshow("Shifted Down and Right", shifted)
```

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/03.png"></div>
2、Roation：

```python
(h, w) = image.shape[:2] 　　# w = shape[1] 　h=shape[0]
center = (w // 2, h // 2)
M = cv2.getRotationMatrix2D(center, 45, 1.0) 　　# 45表示度数，正值表示逆时针旋转，负值表示顺时针旋转
rotated = cv2.warpAffine(image, M, (w, h))
cv2.imshow("Rotated by 45 Degrees", rotated)
```

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/04.png" width=50% height=50%></div>
3、Resizing：

```python
r = 50.0 / image.shape[0]
dim = (int(image.shape[1] * r), 50)   # 使改变后的长宽比例和原来保持一致

resized = cv2.resize(image, dim, interpolation = cv2.INTER_AREA)
cv2.imshow("Resized (Height)", resized)
```

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/05.png"></div>
4、Flipping：

```python
flipped = cv2.flip(image, 1)  　　# 水平翻转(左右方向上)
cv2.imshow("Flipped Horizontally", flipped)　　
flipped = cv2.flip(image, 0)　　　# 垂直翻转(上下方向上)
cv2.imshow("Flipped Vertically", flipped)
flipped = cv2.flip(image, -1)
cv2.imshow("Flipped Horizontally & Vertically", flipped)
```

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/06.png"></div>
5、Cropping：

```python
cropped = image[30:120 , 240:335] 　　# [y_start : y_end, x_start : x_end]
cv2.imshow("T-Rex Face", cropped)
```

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/07.png"></div>


#### Image Arithmetic　　

　　我们都知道基本的算术运算，比如加法和减法。但是在处理图像时，我们需要记住我们的<span class="blockFont">颜色空间</span>和<span class="blockFont">数据类型</span>的限制。一般表示RGB图像的数据类型为：<span class="blockFont">uint8</span>，所能表示的范围为[0, 255]。

　　Opencv和numpy在进行uint8类型数据加减的时候是有区别的：

1. numpy：对于不在[0, 255]的结果将采取**取余**的方式来限制结果值的范围。
2. Opencv：对于不在[0, 255]的结果值采取**裁剪**的方式，即小于0时就取值为0，大于255时就取值为255，这种方式在视觉表现上更可行。

#### Bitwise operations

　　位运算在图像处理中是非常基础，也是非常重要的一个内容，尤其是在<span class="blockFont">mask掩码操作</span>的过程中，位运算主要以下四种：

```python
bitwiseAnd = cv2.bitwise_and(rectangle,circle)  　# 与
bitwiseOr = cv2.bitwise_or(rectangle, circle)　   # 或
bitwiseXor = cv2.bitwise_xor(rectangle, circle)　 # 异或
bitwiseNot = cv2.bitwise_not(circle)　            # 非
```

　　其处理的结果如下：

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/08.png"></div>


<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/09.png"></div>


#### Masking

　　通过使用masking，我们从可以图像中<span class="blockFont">只提取出我们感兴趣的部分内容</span>。

```python
mask = np.zeros(image.shape[:2], dtype = "uint8")
(cX, cY) = (image.shape[1] // 2, image.shape[0] // 2)
cv2.rectangle(mask, (cX - 75, cY - 75), (cX + 75 , cY + 75), 255,-1)
cv2.imshow("Mask", mask)

masked = cv2.bitwise_and(image, image, mask = mask)
cv2.imshow("Mask Applied to Image", masked)
```

　　其结果如下：

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/10.png"></div>


####  Color Spaces

　　计算机视觉中主要会用到的色彩模型有三种：<span class="blockFont">RGB</span>、<span class="blockFont">HSV</span>以及<span class="blockFont">lab</span>。由于篇幅原因，这里不方便详细阐述，可以参考下一篇内容。

```python
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
cv2.imshow("Gray", gray)

hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
cv2.imshow("HSV", hsv)

lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
cv2.imshow("L\*a\*b\*", lab)
```

　　其结果如下：

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/11.png"></div>


#### Splitting and Merging Channels

　　<span class="blockFont">在图像中，像素值越大显示得越亮，像素值越小显示得越暗。</span>

```python
(B, G, R) = cv2.split(image)
cv2.imshow("Red", R)
cv2.imshow("Green", G)
cv2.imshow("Blue", B)

merged = cv2.merge([B, G, R])
cv2.imshow("Merged", merged)
```

　　其结果如下：

<div class="blockImg" style="height:120px; width:600px" ><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/12.png"></div>






### Chapter 7 – Histograms

1、先通过cv2.calcHist函数来**构建直方图数据**：

```python
cv2.calcHist(images,channels,mask,histSize,ranges)
```

2、然后通过plt.plot()函数来**显示直方图**：

```
plt.plot(hist)
```

#### 直方图类型

##### 一维直方图（只考虑图像的一个特征）

1、统计灰度图像中每个颜色强度（0~255）的**像素数量**：

```python
image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
cv2.imshow("Original", image)
hist = cv2.calcHist([image], [0], None, [256], [0, 256])

plt.figure()
plt.title("Grayscale Histogram")
plt.xlabel("Bins")
plt.ylabel("# of Pixels")

plt.plot(hist)
plt.xlim([0, 256])
plt.show()
cv2.waitKey(0)
```

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/13.png"></div>
2、统计彩色图像中每个颜色强度（0~255）的**像素数量**：

```python
chans = cv2.split(image)
colors = ("b", "g", "r")

plt.figure()
plt.title("’Flattened’ Color Histogram")
plt.xlabel("Bins")
plt.ylabel("# of Pixels")

for (chan, color) in zip(chans, colors):
　　hist = cv2.calcHist([chan], [0], None, [256], [0, 256])
　　plt.plot(hist, color = color)
　　plt.xlim([0, 256])
```

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/14.png" width=50% height=50%></div>


##### 二维直方图（考虑图像的两个特征）

　　分别统计图像中：R和G、R和B、G和B**两个颜色强度的像素数量**：

```python
fig = plt.figure()
ax = fig.add_subplot(131)
hist = cv2.calcHist([chans[1], chans[0]], [0, 1], None,[32, 32], [0, 256, 0, 256])
p = ax.imshow(hist, interpolation = "nearest")
ax.set_title("2D Color Histogram for G and B")
plt.colorbar(p)
print("2D histogram shape: {}, with {} values".format(hist.shape, hist.flatten().shape[0])
```

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/15.png" width=50% height=50%></div>
　　图中蓝色到红的渐变过程表示：像素的数量由少到多

#### 直方图均衡化

　　直方图均衡通过“拉伸”像素的分布来改善图像的对比度。当图像包含了既黑暗又有光线的背景和背景时，这种方法是有用的：

```python
image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
eq = cv2.equalizeHist(image)

cv2.imshow("Histogram Equalization", np.hstack([image, eq]))
cv2.waitKey(0)
```

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/16.png" width=50% height=50%></div>


### Chapter 8 – Smoothing and Blurring

　　许多图像处理和计算机视觉功能，如**阈值**和**边缘检测**，如果图像首先平滑或模糊，效果会更好。在这个过程中，使用的**滑动窗口k的值越大越模糊**。

#### Averaging

　　在图像顶部定义一个k\*k滑动窗口，其中k始终是奇数。 此窗口将从左到右，从上到下滑动。 然后将**该矩阵中心的像素**（我们必须使用奇数，否则不会有真正的“中心”）设置为围绕它的所有**其他像素的平均值**。

```python
blurred = np.hstack([
　　cv2.blur(image, (3, 3)),
　　cv2.blur(image, (5, 5)),
　　cv2.blur(image, (7, 7))])

cv2.imshow("Averaged", blurred)
cv2.waitKey(0)
```

<div class="blockImg" style="width:600px;height:220px;" ><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/17.png"></div>


#### Gaussian

　　高斯模糊类似于平均模糊，但是我们现在使用**加权平均值**而不是使用简单均值，其中更接近中心像素的邻域像素对平均值贡献更多“权重”。

```python
blurred = np.hstack([
　　cv2.GaussianBlur(image, (3, 3), 0),
　　cv2.GaussianBlur(image, (5, 5), 0),
　　cv2.GaussianBlur(image, (7, 7), 0)])
cv2.imshow("Gaussian", blurred)
cv2.waitKey(0)
```

<div class="blockImg" style="width:600px;height:220px;" ><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/18.png"></div>
　　与平均方法相比，高斯模糊的图像模糊度更低，模糊的更自然一些。

#### Median

　　与平均方法不同，中值模糊方法不是用邻域的平均值替换中心像素，而是用邻域的中值替换中心像素。传统上，中值模糊方法在去除**椒盐噪声**时最有效，这是因为每个中心像素总是被图像中存在的像素强度替换。

```python
blurred = np.hstack([
　　cv2.medianBlur(image, 3),
　　cv2.medianBlur(image, 5),
　　cv2.medianBlur(image, 7)])

cv2.imshow("Median", blurred)
cv2.waitKey(0)
```

<div class="blockImg" style="width:600px;height:220px;" ><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/19.png"></div>
　　请注意，中值模糊方法不再像平均和高斯模糊那样创建“运动模糊”效果，相反，它正在消除细节和噪音。

#### Bilateral

　　到目前为止，我们的模糊方法的目的是减少图像中的噪声和细节; 但是，我们往往会**丢失图像中的边缘**。为了在保持边缘的同时降低噪音，我们可以使用**双边模糊**。 双边模糊通过引入**两个高斯分布**来实现这一点。**第一高斯函数**仅考虑空间邻居，即在图像的（x，y）坐标空间中出现在一起的像素。 然后，**第二高斯模型**对邻域的像素强度进行建模，确保在模糊的实际计算中**仅包括具有相似强度的像素**。

```python
blurred = np.hstack([
　　cv2.bilateralFilter(image, 5, 21, 21),
　　cv2.bilateralFilter(image, 7, 31, 31),
　　cv2.bilateralFilter(image, 9, 41, 41)])

cv2.imshow("Bilateral", blurred)
cv2.waitKey(0)
```

<div class="blockImg" style="width:600px;height:220px;" ><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/20.png" ></div>
　　总的来说，这种方法能够保留图像的边缘，同时还能降低噪点。 其最大的缺点就是它比平均，高斯和中值模糊慢得多。

### Chapter 9 – Thresholding

　　通常，我们使用**阈值**处理来关注图像中特别感兴趣的对象或区域，阈值处理其实就是对图像进行一个二值化的操作。

#### Simple Thresholding

　　应用简单的阈值方法需要人为干预，即图像阈值需要我们自己手动设置。

```python
image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
blurred = cv2.GaussianBlur(image, (5, 5), 0)
cv2.imshow("Image", image)

(T, thresh) = cv2.threshold(blurred, 155, 255, cv2.THRESH_BINARY)
cv2.imshow("Threshold Binary", thresh)

(T, threshInv) = cv2.threshold(blurred, 155, 255, cv2.THRESH_BINARY_INV)
cv2.imshow("Threshold Binary Inverse", threshInv)
cv2.imshow("Coins", cv2.bitwise_and(image, image, mask = threshInv))
cv2.waitKey(0)
```

<div class="blockImg" style="width:500px;height:520px;"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/21.png" ></div>
　　在进行二值化之前需要先进行一次高斯模糊：应用高斯模糊有助于去除图像中我们不关心的一些高频边缘。在代码中，155是我们手动设置的阈值T，当像素值小于155时，其值就设置为0，否则就设置为255。

#### Adaptive Thresholding

　　简单阈值方法的一大缺点就是需要人工设置阈值T，为了克服这个问题，我们可以使用自适应阈值处理，它考虑像素的小邻居，然后为每个邻居找到最佳阈值T.

```python
image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
blurred = cv2.GaussianBlur(image, (5, 5), 0)
cv2.imshow("Image", image)

thresh = cv2.adaptiveThreshold(blurred,  255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 11, 4)
cv2.imshow("Mean Thresh", thresh)

thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 3)
cv2.imshow("Gaussian Thresh", thresh)

cv2.waitKey(0)
```

<div class="blockImg" style="width:600px;height:220px;" ><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/22.png" ></div>


　　我们使用cv2.THRESH_BINARY_INV来指示邻域中任何大于T的像素强度应设置为255，否则应设置为0。

#### Otsu and Riddler-Calvard

　　我们可以自动计算T的阈值的另一种方法是使用Otsu的方法。Otsu的方法假设图像的灰度直方图中有两个峰值。 然后它试图找到一个最佳值来分隔这两个峰值——T值。

```python
import mahotas

image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
blurred = cv2.GaussianBlur(image, (5, 5), 0)
cv2.imshow("Image", image)

T = mahotas.thresholding.otsu(blurred)
print("Otsu’s threshold: {}".format(T))
thresh = image.copy()
thresh[thresh > T] = 255
thresh[thresh < 255] = 0
thresh = cv2.bitwise_not(thresh)
cv2.imshow("Otsu", thresh)

T = mahotas.thresholding.rc(blurred)
print("Riddler-Calvard: {}".format(T))
thresh = image.copy()
thresh[thresh > T] = 255
thresh[thresh < 255] = 0
thresh = cv2.bitwise_not(thresh)
cv2.imshow("Riddler-Calvard", thresh)

cv2.waitKey(0)
```

<div class="blockImg" style="width:600px;height:220px;" ><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/23.png" ></div>


### Chapter 10 – Gradients and Edge Detection

　　我们要做的第一件事是找到灰度图像的“渐变”，也就是梯度的变化，允许我们在x和y方向上找到类似边缘的区域。 然后，我们将应用Canny边缘检测，降噪（模糊）的多阶段过程，找到图像的梯度（在水平和垂直方向上利用Sobel核心），非最大抑制和滞后阈值。

#### Laplacian and Sobel

```python
image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
cv2.imshow("Original", image)
lap = cv2.Laplacian(image, cv2.CV_64F)
lap = np.uint8(np.absolute(lap)) 　　#这一步非常重要
cv2.imshow("Laplacian", lap)

cv2.waitKey(0)
```

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/24.png" ></div>
```python
sobelX = cv2.Sobel(image, cv2.CV_64F, 1, 0)
sobelY = cv2.Sobel(image, cv2.CV_64F, 0, 1)

# 由于uint8不支持负数，所以下面两行代码如果没有的话，边缘将会检测不出来。
sobelX = np.uint8(np.absolute(sobelX))
sobelY = np.uint8(np.absolute(sobelY))

sobelCombined = cv2.bitwise_or(sobelX, sobelY)
cv2.imshow("Sobel X", sobelX)
cv2.imshow("Sobel Y", sobelY)
cv2.imshow("Sobel Combined", sobelCombined)
cv2.waitKey(0)
```

<div class="blockImg" style="width:500px;height:520px;"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/25.png" ></div>


　　**注意：** 从黑色到白色的转变被认为是正斜率，而从白色到黑色的转变是负斜率。

#### Canny Edge Detector

　　Canny边缘检测器是一个多步骤的过程。 它涉及模糊图像以去除噪声，计算x和y方向上的Sobel梯度图像，抑制边缘，以及最后确定像素是否“边缘样”的滞后阈值阶段。

```python
image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
image = cv2.GaussianBlur(image, (5, 5), 0)
cv2.imshow("Blurred", image)

canny = cv2.Canny(image, 30, 150)
cv2.imshow("Canny", canny)
cv2.waitKey(0)
```

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/26.png" ></div>
　　在这种情况下，任何低于30的梯度值都被认为是非边缘，而高于150的任何值都被认为是边缘。

###  Chapter 11 – Contours

　　OpenCV提供了在图像中查找“曲线”的方法，称为轮廓。 轮廓是点的曲线，曲线中没有间隙。 轮廓对形状近似和分析等方面非常有用。 为了在图像中找到轮廓，需要首先使用边缘检测方法或阈值处理来获得图像的二值化。

```python
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
blurred = cv2.GaussianBlur(gray, (11, 11), 0)
cv2.imshow("Image", image)

edged = cv2.Canny(blurred, 30, 150)
cv2.imshow("Edges", edged)

(_, cnts, _) = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
print("I count {} coins in this image".format(len(cnts)))
coins = image.copy()
cv2.drawContours(coins, cnts, -1, (0, 255, 0), 2)
cv2.imshow("Coins", coins)

cv2.waitKey(0)
```

<div class="blockImg" style="width:600px;height:240px;" ><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Practical%20Python%20and%20OpenCV/27.png" ></div>
　　cv2.findContours函数中放入第二个参数是我们想要的轮廓类型。 我们使用cv2.RETR_EXTERNAL来仅检索最外面的轮廓（即，跟随硬币轮廓的轮廓）。

