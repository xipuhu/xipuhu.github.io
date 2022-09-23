---
title: Ubuntu16.04+CUDA8.0+caffe+tensorflow
categories: 工具使用
tags: [深度学习框架]
toc: true
---

### 前言

　　经过一周的不懈努力，通过对网站各种安装教程的学习，终于呕心沥血的完成本次的环境搭建= =。虽然网站的教程多不胜数，但是学习下来，总有一些不尽人意的地方，比如一些命令行中少了一个空格或者什么的，对于一个Ubuntu小白（就像我一样+_+）来说出了问题，很难察觉。现在就根据我自身在安装过程中的一些体会总结，来详细地梳理一遍，一是可以给自己做一个记录下次配置安装的时候会方便很多，二是也希望跟大家分享一下我的这次吐血经历从而少走些弯路。

<!--more-->

　　**本次框架搭建的全程概要：**

- **框架基础：** 安装显卡驱动 ==> 安装cuda ==> 测试cuda的Samples==> 降低gcc版本==> 重新测Samples==> 安装cudnn
- **安装caffe：**安装Opencv相关依赖项 ==> 编译Opencv ==> 安装Opencv==>安装caffe相关依赖项==> 修改配置文件==> 编译caffe
- **安装Thsorflow**

　　在整个过程中，出问题的部分主要是`安装cuda` 、`Opencv编译` 以及`caffe的编译` ，caffe是最难安装的了，TensorFlow稍微容易点。
　　**注意：** 在安装之前最好先将电脑的锁屏关闭，因为有时候由于网络或者软件源的问题会导致下载异常慢，所以为了防止下载中断先将锁屏功能关闭。

### 框架基础安装

#### 安装显卡驱动

　　首先去nvidia官网上查看适合你电脑GPU的最新驱动：<http://www.nvidia.com/Download/index.aspx?lang=en-us>
![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/01.png)

　　然后在终端中依次输入下列命令行：

```
sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt-get update
sudo apt-get install nvidia-375（375是你查到的版本号,如果查到的版本号含有小数只要整数部分）
sudo apt-get install mesa-common-dev
sudo apt-get install freeglut3-dev
```

　　执行完上述后，重启（reboot）。
　　重启后输入：

```
nvidia-smi
```

　　如果出现了你的GPU列表，则说明驱动安装成功了。另外也可以通过，或者输入

```
nvidia-settings
```

　　出现：

[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/02.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/02.png)

#### 安装cuda

　　cuda是nvidia的编程语言平台，想使用GPU就必须要使用cuda。从这里下载cuda的安装文件 （需要注册一个nvidia帐号下载）：
<https://developer.nvidia.com/cuda-release-candidate-download>
![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/03.png)

　　注意这里下载的是cuda8.0的runfile(local)文件，笔者一开始按照另外一篇博客下载deb(local)文件结果安装出问题因此并不建议下载deb(local)文件安装。
　　下载完cuda8.0后。执行如下语句，运行runfile文件：

```
sudo sh cuda_8.0.27_linux.run  (根据你下载的文件名来)
```

　　执行后会有一系列提示让你确认，**但是注意，有个让你选择是否安装nvidia361驱动时，一定要选择否**，因为前面我们已经安装了更加新的nvidia367，所以这里不要选择安装。其余的都直接默认或者选择是即可。
　　笔者安装后出现了如下界面：
[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/04.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/04.png)

　　可以发现系统提示缺少一些推荐安装的库：libGLU.so、libX11.so、libXi.so、libXmu.so，所以接下来执行如下命令行：

```
sudo apt-get install libglu1-mesa-dev   
sudo apt-get install libx11-dev
sudo apt-get install libxi-dev
sudo apt-get install libxmu-dev
```

　　然后再运行runfile文件进行安装一次，会发现上图中的错误就消失了。
　　安装完毕后，再声明一下环境变量，并将其写入到 ~/.bashrc 的尾部:

```
export PATH=/usr/local/cuda-8.0/bin${PATH:+:${PATH}}
export LD_LIBRARY_PATH=/usr/local/cuda-8.0/lib64${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}
```

　　然后设置环境变量和动态链接库，输入如下命令行：

```
sudo gedit /etc/profile
```

　　在打开的文件末尾加入：

```
export PATH = /usr/local/cuda/bin:$PATH
```

　　保存之后，创建链接文件：

```
sudo gedit /etc/ld.so.conf.d/cuda.conf
```

　　在打开的文件中添加如下语句：

```
/usr/local/cuda/lib64
```

　　然后执行如下语句，使链接立即生效。

```
sudo ldconfig
```

#### 测试cuda的Samples

　　编译测试cuda例子与测试，在命令行输入：

```
cd /usr/local/cuda-8.0/samples/1_Utilities/deviceQuery
sudo make ./deviceQuery
```

[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/05.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/05.png)

　　这里报错是因为Ubuntu16.04自带的gcc5.x版本CUDA不兼容，所以需要降低gcc+版本:

```
sudo apt-get install gcc-4.9 g++-4.9
cd /usr/bin
sudo rm　gcc 
sudo rm g++
sudo ln -s gcc-4.9 gcc
sudo ln -s g++-4.9 g++
```

　　再次输入如下语句重新测试Samples:

```
sudo make ./deviceQuery
```

　　打印类似如下信息，说明安装成功：

```
./deviceQuery Starting...

 CUDA Device Query (Runtime API) version (CUDART static linking)

Detected 1 CUDA Capable device(s)

Device 0: "GeForce GTX 950M"
  CUDA Driver Version / Runtime Version          9.0 / 8.0
  CUDA Capability Major/Minor version number:    5.0
  Total amount of global memory:                 2003 MBytes (2100232192 bytes)
  ( 5) Multiprocessors, (128) CUDA Cores/MP:     640 CUDA Cores
  GPU Max Clock rate:                            1124 MHz (1.12 GHz)
  Memory Clock rate:                             1001 Mhz
  Memory Bus Width:                              128-bit
  L2 Cache Size:                                 2097152 bytes
  Maximum Texture Dimension Size (x,y,z)         1D=(65536), 2D=(65536, 65536), 3D=(4096, 4096, 4096)
  Maximum Layered 1D Texture Size, (num) layers  1D=(16384), 2048 layers
  Maximum Layered 2D Texture Size, (num) layers  2D=(16384, 16384), 2048 layers
  Total amount of constant memory:               65536 bytes
  Total amount of shared memory per block:       49152 bytes
  Total number of registers available per block: 65536
  Warp size:                                     32
  Maximum number of threads per multiprocessor:  2048
  Maximum number of threads per block:           1024
  Max dimension size of a thread block (x,y,z): (1024, 1024, 64)
  Max dimension size of a grid size    (x,y,z): (2147483647, 65535, 65535)
  Maximum memory pitch:                          2147483647 bytes
  Texture alignment:                             512 bytes
  Concurrent copy and kernel execution:          Yes with 1 copy engine(s)
  Run time limit on kernels:                     Yes
  Integrated GPU sharing Host Memory:            No
  Support host page-locked memory mapping:       Yes
  Alignment requirement for Surfaces:            Yes
  Device has ECC support:                        Disabled
  Device supports Unified Addressing (UVA):      Yes
  Device PCI Domain ID / Bus ID / location ID:   0 / 1 / 0
  Compute Mode:
     < Default (multiple host threads can use ::cudaSetDevice() with device simultaneously) >

deviceQuery, CUDA Driver = CUDART, CUDA Driver Version = 9.0, CUDA Runtime Version = 8.0, NumDevs = 1, Device0 = GeForce GTX 950M
Result = PASS
```

#### 安装cudnn

　　首先去官网下载你需要的cudnn，下载的时候需要注册账号。选择对应你cuda版本的cudnn下载。这里我下载的是cudnn5.1，是个压缩文件（.tgz）——— 编译<https://developer.nvidia.com/rdp/cudnn-download>
[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/06.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/06.png)

　　下载完cudnn后，命令行输入文件所在的文件夹 (ubuntu为本机用户名)：

```
cd home/ubuntu/Downloads/
tar zxvf cudnn-8.0-linux-x64-v5.1.tgz #解压文件
```

　　cd进入cudnn5.1解压之后的include目录，在命令行进行如下操作：

```
sudo cp cudnn.h /usr/local/cuda/include/ #复制头文件
```

　　再cd进入lib64目录下的动态文件进行复制和链接：（5.1.5为对应版本具体可修改）

```
sudo cp lib* /usr/local/cuda/lib64/ #复制动态链接库
cd /usr/local/cuda/lib64/
sudo rm -rf libcudnn.so libcudnn.so.5 #删除原有动态文件
sudo ln -s libcudnn.so.5.1.5 libcudnn.so.5 #生成软衔接
sudo ln -s libcudnn.so.5 libcudnn.so #生成软链接
```

[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/07.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/07.png)

　　到此，框架搭建之前的准备就已经完成了，接下来将进行caffe的安装。

### 安装caffe

#### 安装Opencv3.1.0

　　从官网上下载opencv3.1.0 <http://opencv.org/releases.html>　　
　　并将其解压到你要安装的位置，假设解压到了/home。
[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/08.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/08.png)

　　**1、安装相关依赖项：**

```
sudo apt-get install --assume-yes libopencv-dev
sudo apt-get install build-essential cmake git libgtk2.0-dev
sudo apt-get install pkg-config python-dev
sudo apt-get install python-numpy
sudo apt-get install libdc1394-22-dev
sudo apt-get install libjpeg-dev
sudo apt-get install libpng12-dev
sudo apt-get install libtiff5-dev
sudo apt-get install libjasper-dev
sudo apt-get install libavcodec-dev
sudo apt-get install libavformat-dev
sudo apt-get install libswscale-dev
sudo apt-get install libxine2-dev
sudo apt-get install libgstreamer0.10-dev 
sudo apt-get install libgstreamer-plugins-base0.10-dev
sudo apt-get install libv4l-dev
sudo apt-get install libtbb-dev
sudo apt-get install libqt4-dev
sudo apt-get install libfaac-dev
sudo apt-get install libmp3lame-dev
sudo apt-get install libopencore-amrnb-dev
sudo apt-get install libopencore-amrwb-dev 
sudo apt-get install libtheora-dev
sudo apt-get install libvorbis-dev
sudo apt-get install libxvidcore-dev
sudo apt-get install x264 v4l-utils unzip

sudo apt-get install build-essential cmake git
sudo apt-get install ffmpeg libopencv-dev
sudo apt-get install libgtk-3-dev
sudo apt-get install python3-numpy
sudo apt-get install qtbase5-dev
```

　　**2、编译opencv：**
　　在opencv文件夹下（解压的那个文件夹）打开终端，然后：

```
mkdir build #新建一个build文件夹，编译的工程都在这个文件夹里
cd build/
cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local -D WITH_TBB=ON -D WITH_V4L=ON -D WITH_QT=ON -D WITH_OPENGL=ON -DCUDA_NVCC_FLAGS="-D_FORCE_INLINES" ..（后面两点不要忘记）
```

[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/09.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/09.png)

　　结果笔者出现了以下问题：
[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/10.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/10.png)

　　这是因为下载ippicv_linux_ 20151201.tgz需要翻墙，所以下载超时了，不过我们可以在这里下载<http://download.csdn.net/download/chu_ying/9432287>
　　下载好后，将该压缩包放在3rdpart/ippicv/downloads/linux-808b791a6eac9ed7下，再次重新配置：
[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/11.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/11.png)

　　出现如下内容，则表示配置cmake成功了：
[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/12.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/12.png)

　　然后进行make编译：

```
sudo make -j8     #j后面的数字8代表的是电脑的cpu核数可以根据自己电脑来修改
```

　　然而笔者又出现了问题：
[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/13.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/13.png)

　　这是因为cuda8.0不支持Opencv的Ggraphcut算法，因此需要进入opencv-3.1.0/modules/cudalegacy/src/目录，修改graphcuts.cpp文件：

```
将：
#include "precomp.hpp"   //有点难找，可以ctrl+f在文件中快速查找                  
#if !defined (HAVE_CUDA) || defined (CUDA_DISABLER)
改为：
#include "precomp.hpp"
#if !defined (HAVE_CUDA) || defined (CUDA_DISABLER) || (CUDART_VERSION >= 8000)
```

　　再次进行make编译，将会得到如下编译成功结果：[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/14.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/14.png)

　　**3、安装Opencv：**
　　上面是将opencv编译成功，但是并没有安装到我们的系统中，有很多的设置都没有写入到系统中，因此还要进行install。

```
sudo make install
sudo /bin/bash -c 'echo "/usr/local/lib" > /etc/ld.so.conf.d/opencv.conf'
sudo ldconfig
```

　　重启系统，重启系统后cd到build文件夹下：

```
sudo apt-get install checkinstall
sudo checkinstall
```

　　然后按照提示安装就可以了。使用checkinstall的目的是为了更好的管理我安装的opencv，因为opencv的安装很麻烦，卸载更麻烦，其安装的时候修改了一大堆的文件，当我想使用别的版本的opencv时，将当前版本的opencv卸载就是一件头疼的事情，因此需要使用checkinstall来管理我的安装。执行了checkinstall后，会在build文件下生成一个以backup开头的.tgz的备份文件和一个以build开头的.deb安装文件，当你想卸载当前的opencv时，直接执行dpkg -r build即可。

#### 配置caffe

　　**1、安装相关依赖项：**

```
sudo apt-get update 
sudo apt-get install -y build-essential cmake git pkg-config 
sudo apt-get install -y libprotobuf-dev libleveldb-dev libsnappy-dev libhdf5-serial-dev protobuf-compiler 
sudo apt-get install -y libatlas-base-dev 
sudo apt-get install -y no-install-recommends libboost-all-dev 
sudo apt-get install -y libgflags-dev libgoogle-glog-dev liblmdb-dev 
sudo apt-get install -y python-pip 
sudo apt-get install -y python-dev 
sudo apt-get install -y python-numpy python-scipy
```

　　**2、修改配置文件：**
　　将终端cd到你要安装caffe的位置，执行如下指令，从github上clone caffe。

```
git clone https://github.com/BVLC/caffe.git  //从github上git caffe
cd caffe //打开到刚刚git下来的caffe 
sudo cp Makefile.config.example Makefile.config   //将Makefile.config.example的内容复制到Makefile.config 
 //因为make指令只能make Makefile.config文件，而Makefile.config.example是caffe给出的makefile例子 
sudo gedit Makefile.config //打开Makefile.config文件
```

　　打开`Makefile.config` 文件之后修改：

```
//若使用cudnn，则将# USE_CUDNN := 1 修改成： USE_CUDNN := 1 
//若使用的opencv版本是3的，则将# OPENCV_VERSION := 3 修改为： OPENCV_VERSION := 3 
//若要使用python来编写layer，则需要将# WITH_PYTHON_LAYER := 1 修改为 WITH_PYTHON_LAYER := 1 
//重要的一项将# Whatever else you find you need goes here.下面的 INCLUDE_DIRS := $(PYTHON_INCLUDE) /usr/local/include LIBRARY_DIRS := $(PYTHON_LIB) /usr/local/lib /usr/lib 
修改为： INCLUDE_DIRS := $(PYTHON_INCLUDE) /usr/local/include /usr/include/hdf5/serial 
      LIBRARY_DIRS := $(PYTHON_LIB) /usr/local/lib /usr/lib /usr/lib/x86_64-linux-gnu/hdf5/serial //这是因为ubuntu16.04的文件包含位置发生了变化，尤其是需要用到的hdf5的位置，所以需要更改这一路径

//若使用MATLAB接口的话，则要讲MATLAB_DIR换成你自己的MATLAB安装路径
MATLAB_DIR := /usr/local
MATLAB_DIR := /usr/local/matlab2014a
```

　　再打开`Makefile` 文件：

```
sudo gedit Makefile
NVCCFLAGS +=-ccbin=$(CXX) -Xcompiler-fPIC $(COMMON_FLAGS) #用下面一行代码替换该行代码
NVCCFLAGS += -D_FORCE_INLINES -ccbin=$(CXX) -Xcompiler -fPIC $(COMMON_FLAGS)
```

　　**3、编译caffe：**

```
cd ~ /caffe  　　　　　#这是我的caffe目录
sudo apt-get install python-opencv  #安装cython, python-opencv
sudo pip install cython easydict　
#安装依赖库这里跟上面的一些是重复的，因为我是想编译FRCNN 所以我把我要用的包重现安装一遍。
sudo apt-get install python-numpy 
sudo apt-get install python-scipy
sudo apt-get install python-matplotlib
sudo apt-get install python-sklearnpython-skimage
sudo apt-get install python-h5py
sudo apt-get install python-protobuf
sudo apt-get install python-leveldb 
sudo apt-get install python-networkx
sudo apt-get install python-nosepython-pandas
sudo apt-get install python-gflags
sudo apt-get install Cython ipython
              　
sudo gedit /etc/profile　　　#添加~/caffe/python到$PYTHONPATH：
# 添加：export PYTHONPATH=/path/to/caffe/python:$PYTHONPATH
source /etc/profile 　　　　　# 使编译环境生效 
sudo apt-get install protobuf-c-compiler protobuf-compiler
sudo make clean 　　　　　　　#第一次编译不用添加，如果编译失败必须增需要添加。
sudo make all -j8
```

　　笔者在编译过程中出现了以下三个问题（花了好长时间填好的坑=_=）:
**第一个问题：** 　
[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/15.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/15.png)

 **解决方法：**
　　再次打开Makefile.config文件：

```
sudo gedit Makefile.config
```

　　找到如下部分内容进行修改：

```
CUDA_ARCH := -gencode arch=compute_20,code=sm_20 \ 
        -gencode arch=compute_20,code=sm_21 \
        -gencode arch=compute_30,code=sm_30 \
        -gencode arch=compute_35,code=sm_35 \
        -gencode arch=compute_50,code=sm_50 \
        -gencode arch=compute_52,code=sm_52 \
        -gencode arch=compute_60,code=sm_60 \
        -gencode arch=compute_61,code=sm_61 \
        -gencode arch=compute_61,code=compute_61
#修改为如下内容
CUDA_ARCH := -gencode arch=compute_30,code=sm_30 \ 
        -gencode arch=compute_35,code=sm_35 \
        -gencode arch=compute_50,code=sm_50 \
        -gencode arch=compute_52,code=sm_52 \
        -gencode arch=compute_60,code=sm_60 \
        -gencode arch=compute_61,code=sm_61 \
        -gencode arch=compute_61,code=compute_61
```

**第二个问题：**

[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/16.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/16.png)

　　**解决方法：**
　　将降级到4.9版本的gcc升级回5.x版本：

```
sudo rm　gcc 
sudo rm g++
sudo ln -s gcc-5 gcc
sudo ln -s g++-5 g++
```

**第三个问题：**
[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/17.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/17.png)

　　**解决方法：**
　　再次打开`Makefile文件` ，进行如下修改：

```
找到LIBRARIES += opencv_core opencv_highgui opencv_imgproc
并在后面加上opencv_imgcodecs：
LIBRARIES += opencv_core opencv_highgui opencv_imgproc opencv_imgcodecs
```

　　三个问题解决后，再次编译：

```
sudo make clean
sudo make all j8
```

[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/18.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/18.png)

　　得到以上结果那么就要恭喜你了，caffe环境马上就安装好了，接下来测试安装，成功如下所示：

```
sudo sh data/mnist/get_mnist.sh
sudo sh examples/mnist/create_mnist.sh
sudo sh examples/mnist/train_lenet.sh
```

[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/19.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/19.png)

　　接下来编译一些接口已经运行测试：

```
sudo make pycaffe   #python接口
sudo make matcaffe  

sudo make test
sudo make runtest
```

[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/20.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/20.png)

[![img](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/21.png)](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/21.png)

　　到此caffe安装就圆满完成了。

------------------------------------------

### 安装Tensorflow

　　对于TensorFlow的安装，接下来将采用最简单的方式，即pip安装，并安装GPU版本。由于安装TensorFlow的版本需要cuda9.0+cudnn7.0，前面已经安装了cuda8.0+cudnn5.1，故将需要在前面的基础上安装多个版本的cuda和cudnn。

#### 安装不同版本的cuda和cudnn

##### 安装cuda9.0

　　首先同样需要去nvidia官网下载cuda9.0: <https://developer.nvidia.com/cuda-release-candidate-download> ，下载的方式和前面一样，需要选择`runnfile` 文件下载。

　　进入到放置 `**cuda**_9.0.176_384.81_linux.run` 的目录：

```python
sudo chmod +x cuda_9.0.176_384.81_linux.run 	#为 cuda_9.0.176_384.81_linux.run 添加可执行权限
```

　　运行runfile文件进行安装：

```python
sudo sh cuda_9.0.176_384.81_linux.run
```

　　安装过程中截取其中比较重要的几个选择：

```python
Do you accept the previously read EULA? (accept/decline/quit): accept 
  
You are attempting to install on an unsupported configuration. Do you wish to continue? ((y)es/(n)o) [ default is no ]: y 
  
Install NVIDIA Accelerated Graphics Driver for Linux-x86_64 346.46? ((y)es/(n)o/(q)uit): n 
  
Do you want to install the OpenGL libraries? ((y)es/(n)o/(q)uit) [ default is yes ]: n 
  
Install the CUDA 9.0 Toolkit? ((y)es/(n)o/(q)uit): y 
  
Enter Toolkit Location [ default is /usr/local/cuda-9.0 ]: 
/usr/local/cuda-9.0 is not writable. 
Do you wish to run the installation with ‘sudo’? ((y)es/(n)o): y 
Please enter your password: 
  
Do you want to install a symbolic link at /usr/local/cuda? ((y)es/(n)o/(q)uit): n 
  
Install the CUDA 9.0 Samples? ((y)es/(n)o/(q)uit): y 
  
Enter CUDA Samples Location [ default is /home/xxx ]: 
Installing the CUDA Toolkit in /usr/local/cuda-9.0 … 
Installing the CUDA Samples in /home/xxx … 
Copying samples to /home/xxx/NVIDIA_CUDA-9.0_Samples now… 
Finished copying samples.
```

##### 多个cuda版本之间进行切换

　　首先需要将将`~/.bashrc` 或`~/.zshrc ` 下与cuda相关的路径都改为`/usr/local/cuda/` 而不使用`/usr/local/cuda-8.0/ ` 或`/usr/local/cuda-9.0/` 。

　　上一步我们已经将链接库设置好了，最后只需要在终端输入：

```python
#从cuda8.0切换到cuda9.0
sudo rm -rf /usr/local/cuda                     #删除之前创建的软链接
sudo ln -s /usr/local/cuda-9.0 /usr/local/cuda  #创建新 cuda 的软链接

$ nvcc --version     #查看当前cuda版本
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2017 NVIDIA Corporation
Built on Fri_Sep__1_21:08:03_CDT_2017
Cuda compilation tools, release 9.0, V9.0.176

#从cuda9.0切换到cuda8.0
sudo rm -rf /usr/local/cuda                     #删除之前创建的软链接
sudo ln -s /usr/local/cuda-8.0 /usr/local/cuda  #创建新 cuda 的软链接

$ nvcc --version      #查看当前cuda版本
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2017 NVIDIA Corporation
Built on Fri_Sep__1_21:08:03_CDT_2017
Cuda compilation tools, release 8.0, V9.0.176
```

　　其中终端输入截图如下：

![](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Ubuntu16.04%2BCUDA8.0%2BCUNN5.1%2Bcaffe%2Btensorflow%2BTheano/22.png)

##### 安装cudnn7.0

　　同样需要去下载相应的cudnn版本，需要注意的是，我们这里选择`cuda9.0下cuDNN v7.0.5 Library for Linux` 。下载好后直接命令行解压，然后复制lib64和include文件夹到`usr/local/cuda-9.0` ，命令如下：

```python
# Installing from a Tar File
sudo cp cuda/include/cudnn.h /usr/local/cuda-9.0/include
sudo cp cuda/lib64/libcudnn* /usr/local/cuda-9.0/lib64
sudo chmod a+r /usr/local/cuda-9.0/include/cudnn.h /usr/local/cuda-9.0/lib64/libcudnn*
```

#### 通过pip安装TensorFlow

　　接下来进入正式的TensorFlow的安装过程，其过程相较与caffe而言是比较简单的。

##### 安装pip

　　如果未安装pip或pip3版本8.1（或更高版本），在终端输入如下命令来进行安装或升级：

```python
$ sudo apt-get install python-pip python-dev   # for Python 2.7
$ sudo apt-get install python3-pip python3-dev # for Python 3.n
```

##### 添加用于指示TensorFlow软件包的网址tfBinaryURL

　　在这里： https://www.tensorflow.org/install/install_linux#the_url_of_the_tensorflow_python_package ，查找适合你系统的`tfBinaryURL` 值。

```python
$ wget https://storage.googleapis.com/tensorflow/linux/gpu/tensorflow_gpu-1.6.0-cp35-cp35m-linux_x86_64.whl --no-check-certificate  #wget命令用来从指定的URL下载文件，使下载更加稳定
$sudo apt-get update
```

##### 安装TensorFlow

```python
$ sudo pip  install --upgrade tfBinaryURL   # Python 2.7
$ sudo pip3 install --upgrade tfBinaryURL   # Python 3.n 

$ sudo pip3 install --upgrade https://storage.googleapis.com/tensorflow/linux/gpu/tensorflow_gpu-1.6.0-cp35-cp35m-linux_x86_64.whl
```

　　由于国内访问不了`storage.googleapis.com` ，所以上面的下载可能会超时然后中断掉。出现这种情况的时候，我们可以先在翻墙的环境中下载好`tensorflow_gpu-1.6.0-cp35-cp35m-linux_x86_64.whl` 这个文件，如果没有翻墙环境，没关系，下面我提供了一个百度云的连接，可以进行下载相应的资源文件，然后拷贝到`Ubuntu`中进行安装：

```python
$ sudo pip3 install tensorflow_gpu-1.6.0-cp35-cp35m-linux_x86_64.whl
```

#####  卸载TensorFlow

```python
$ sudo pip3 uninstall tensorflow-gpu==1.6
```

##### 相关安装资料

　　本教程用到的安装文件：https://pan.baidu.com/s/1qtUTrm42dF6JITT2pxPeqw 密码：rhvl
　　官网安装教程：https://www.tensorflow.org/install/install_linux#InstallingNativePip
　　常见安装问题：https://www.tensorflow.org/install/install_linux#common_installation_problem
　　博客参考： https://blog.csdn.net/tunhuzhuang1836/article/details/79545625
　　　　　　　 https://blog.csdn.net/maple2014/article/details/78574275

##### 使用TensorFlow过程中遇到的问题

　　在安装完后，编写TensorFlow代码时，发现在运行时总是弹出如下问题，导致每次都创建不了`session` 使得代码运行中断：

```python
$ ...
$ Internal: CUDA runtime implicit initialization on GPU:0 failed. Status: unknown error
$ ....
$ ....
$ tensorflow.python.framework.errors_impl.InternalError: Failed to create session.
```

　　出现上面的问题，经过一番`google` 后发现，原来是`TensorFlow版本绑定` 的问题，本教程中安装的是`TensorFlow1.6` ，解决的方法就是换一个`TensorFlow版本` ，对其版本进行一个降级，先通过上述的卸载方法将`TensorFlow1.6` 卸载了，然后重新安装一个`TensorFlow1.4` 。
　　参考：https://github.com/GustavZ/realtime_object_detection/issues/3

-----------------------------







