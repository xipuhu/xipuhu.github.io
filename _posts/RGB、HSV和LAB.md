---
title: RGB、HSV和lab
categories: 计算机视觉
tags: [色彩空间]
mathjax: true
toc: true
---

### RGB

　　RGB颜色模式为光色三原色，它有R（红）、G（绿）、B（蓝）三个颜色通道，每个通道有256个颜色级别，单个通道以0-255数值表示，数值越大表示颜色输出越强。三个通道一起可以模拟出**16777216种色彩**。

<!--more-->

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/RGB%E3%80%81HSV%E5%92%8Clab/00.jpg" width=40% height=40%></div>

　　RGB是对机器很友好的色彩模式，适合在屏幕上显示，但并不够人性化，因为我们对色彩的认识往往是”**什么颜色**？**鲜艳不鲜艳？亮还是暗？”。**

### HSV

　　由于RGB不够“人性化”，为了弥补这个缺陷，HSL 模式和 HSV(HSB) 就基于 RGB ，作为一个更方便友好的方法创建出来了，HSV 分别为<span class="blockFont">色相</span>，<span class="blockFont">饱和度</span>，<span class="blockFont">明度</span>。

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/RGB%E3%80%81HSV%E5%92%8Clab/01.png" width=50% height=50%></div>

#### 色彩的三要素

**色相（表，表现）**：即色彩的相貌和特征。自然界中色彩的种类很多，色相指色彩的种类和名称。如；红、橙、黄、绿、青、蓝、紫等等颜色的种类变化就叫色相。

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/RGB%E3%80%81HSV%E5%92%8Clab/02.png" width=50% height=50%></div>

　　HSV的H(hue)分量，代表的是人眼所能感知的颜色范围，这些颜色分布在一个平面的色相环上，取值范围是0°到360°的圆心角，每个角度可以代表一种颜色。色相值的意义在于，我们可以在不改变光感的情况下，通过旋转色相环来改变颜色。在实际应用中，我们需要记住色相环上的六大主色，用作基本参照：**360°/0°红**、**60°黄**、**120°绿**、**180°青**、**240°蓝**、**300°洋红**，它们在色相环上按照60°圆心角的间隔排列。

**明度（表，面子）：**指色彩的**亮度**或明度，也叫明亮度。颜色有深浅、明暗的变化。比如，深黄、中黄、淡黄、柠檬黄等黄颜色在明度上就不一样，紫红、深红、玫瑰红、大红、朱红、桔红等红颜色在亮度上也不尽相同。这些颜色在明暗、深浅上的不同变化，也就是色彩的又一重要特征一一明度变化。

<div class="blockImg" style="width:600px;height:120px;" ><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/RGB%E3%80%81HSV%E5%92%8Clab/03.png"></div>

　　HSV的V(value)分量，指的是色彩的明度，作用是控制色彩的明暗变化。它同样使用了0%至100%的取值范围。数值越小，色彩越暗，越接近于**黑色**；数值越大，色彩越亮，越接近于**白色**。

**纯度（里，里子）**：指色彩的鲜艳程度，也叫**饱和度**。原色是纯度最高的色彩。颜色混合的次数越多，纯度越低，反之，纯度则高。原色中混入补色，纯度会立即降低、变灰。物体本身的色彩，也有纯度高低之分，西红柿与苹果相比，西红柿的纯度高些，苹果的纯度低些。有好的表现，必然有一定的面子跟里子做基础。

<div class="blockImg" style="width:600px;height:120px;" ><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/RGB%E3%80%81HSV%E5%92%8Clab/04.png"></div>

　　HSV的S(saturation)分量，指的是色彩的饱和度，它用0%至100%的值描述了相同色相、明度下色彩纯度的变化。数值越大，颜色中的**灰色**越少，颜色越**鲜艳**，呈现一种从理性(灰度)到感性(纯色)的变化。

　　在图像处理中，HSV和RGB相比，有一个优点：<span class="blockFont">可以单独处理色调H的值</span>，而不会影响到明度和纯度。由于RGB模式下的颜色是由R、G和B三个分量来共同决定的，并不能只通过操作一个分量来改变颜色，而HSV中颜色只取决于H的值，所以这是HSV在图像处理中优于RGB的一点。

　　比如在车牌识别中，我们首先需要进行颜色定位(车牌的颜色一般只有两个颜色：蓝色和黄色)，如果采用RGB这个过程将会很复杂，因为要同时考虑RGB三个因素变量，而采用HSV则只需要考虑H这个变量，[颜色定位与偏斜扭转](https://www.cnblogs.com/subconscious/p/4351007.html)。

　　HSV也通常用于确定想要跟踪的颜色范围（例如视频流中的绿球）：

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/RGB%E3%80%81HSV%E5%92%8Clab/05.png" width = 50% height = 50%></div>

　　还可以使用HSV提取颜色直方图，来量化图像的内容甚至构建图像搜索引擎。

### lab

　　LAB颜色模式，L表示明度通道，它记录头像中的细节，不记录颜色。a通道表示从红色到绿色，b通道表示从蓝色到黄色。LAB颜色模式把图像中的颜色和细节分开记录，我们在后期中可以利用它的这个特性。

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/RGB%E3%80%81HSV%E5%92%8Clab/06.png" width=50% height=50%></div>

　　LAB颜色模式中有3个通道：

1. L明度通道：主要是包含了图片中的黑白灰区域；
2. A通道：主要是包含了图片中从绿色信息到洋红信息的色彩区域（绿色为暗调，洋红色为高光）；
3. B通道：主要是包含了图片中从蓝色信息到黄色信息的色彩区域（蓝色为暗调，黄色为高光）。

**对于a、b通道的理解：**

　　把红到绿之间的颜色层级映射到黑白上，纯红为纯白，纯绿为纯黑，半红半绿的映射为灰色，此为**a通道**：

<div class="blockImg" style="width:300px;height:120px;" ><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/RGB%E3%80%81HSV%E5%92%8Clab/07.png"></div>

同理，把黄到蓝之间的颜色层级映射到黑白上，纯黄为纯白，纯蓝为纯黑，半黄半蓝的映射为灰色。此为b通道：

<div class="blockImg" style="width:300px;height:120px;" ><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/RGB%E3%80%81HSV%E5%92%8Clab/08.png"></div>

　　lab与rgb有本质的区别：lab的三个通道分别代表，l是明度，a是红绿，b是黄蓝。在lab模式下的曲线，因为明度是单独保存在l通道中的，所以我们可以在不改变色彩信息的前题下调整明度。同样的，我们也可以不改变明度的前题下调整色彩。这是rgb模式下的曲线无法做到的，因为rgb的三个通道分别保存的是红绿蓝三原色。

　　比如在lab模式下对一张图片进行调整：

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/RGB%E3%80%81HSV%E5%92%8Clab/09.jpg" width=50% height=50%></div>

　　其调整的效果如下：

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/RGB%E3%80%81HSV%E5%92%8Clab/11.jpg" width=50% height=50%></div>

### 色彩表达范围

　　在**表达色彩范围**上，最全的是<span class="blockFont">Lab模式</span>，其次是<span class="blockFont">RGB模式</span>，最窄的是<span class="blockFont">CMYK模式</span>。也就是说Lab模式所定义的色彩最多，且与光线及设备无关，并且处理速度与RGB模式同样快，比CMYK模式快数倍。因此，您可放心大胆的在图像编辑中使用Lab模式，而且，Lab模式保证在转换成CMYK模式时色彩最少丢失或被替代。因此，从理论上讲最佳避免色彩损失的方法是：应用Lab模式编辑图像，再转换CMYK模式打印。

<div class="blockImg"><img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/RGB%E3%80%81HSV%E5%92%8Clab/10.png" width=50% height=50%></div>