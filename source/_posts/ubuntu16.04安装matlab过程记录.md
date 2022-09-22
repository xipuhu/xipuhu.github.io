---
title: ubuntu16.04安装matlab过程记录
categories: [工具使用]
tags: [Matlab]
toc: true
---

### 准备工作

1. 下载matlab R2016b的linux版本及破解所需文件，需要下载以下三个文件·：`R2016b_glnxa64_dvd1.iso` 、`R2016b_glnxa64_dvd2.iso` 、`Matlab 2016b Linux64Crack.rar` ，三个文件总共7G左右，还是比较大的：

```
https://pan.baidu.com/s/1cwKJd8  密码：m6an。
```

安装过程：先将第一个文件挂载到Linux，进行安装，当安装到80%左右，会提示需要将第二个文件挂载好来并继续安装。经过这两个文件的安装后，最后再进行激活操作。

<!--more-->

### 安装

#### 挂载

　　首先建立用于挂载文件的文件夹，本文为`home/media/matlab2016` ，然后使用`mount` 命令进行`R2016b_glnxa64_dvd1.iso` 文件挂载：

```python
#命令行如下：
mkdir ~/media/matlab2016          #挂载目录
sudo mount -o loop [path(三个文件存放的位置目录)]R2016b_glnxa64_dvd1.iso ~/media/matlab2016
```

#### 安装

　　挂载好后，接着执行如下命令进行安装：

```python
sudo ~/media/matlab2016/install
```

　　接下来就是安装引导的图像界面了：

![](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/ubuntu16.04%E5%AE%89%E8%A3%85matlab%E8%BF%87%E7%A8%8B%E8%AE%B0%E5%BD%95/01.png?center)

　　选择选择Use a File Installtion Key，点击Next；

![](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/ubuntu16.04%E5%AE%89%E8%A3%85matlab%E8%BF%87%E7%A8%8B%E8%AE%B0%E5%BD%95/02.png)

　　选择I have the File Installation Key for my license，然后输入Installation Key，Installation Key可以在Crack文件夹下的readme.txt中找到；接着就进入安装过程了。
　　进度条到80%左右的时候，`R2016b_glnxa64_dvd1.iso` 安装完成，会提示拔出dvd1，然后插入dvd2对话框，此时需要挂载第二个iso文件到/home/media/matlab2016文件夹下，这里注意的是，由于你当时的终端窗口正在 进行安装，所以你是无法进行操作的，所以你需要**ctrl+Alt+t**进行重新开一个终端命令窗口。挂载成功后直接点击ok就可以了：

```python
ctrl+Alt+t     #新建窗口

sudo mount -o loop [path(三个文件存放的位置目录)]R2016b_glnxa64_dvd2.iso ~/media/matlab2016
```

#### 运行matlab执行文件

　　安装完成后，可以试着在`/usr/local/MATLAB/R2016b/bin`  目录下打开终端，输入如下命令：

```python
sudo matlab
```

　　结果可能会没有发现matlab可执行文件，并提示matlab command not found。

　　**解决方法** 

 　　在终端输入：

```python
sudo su    #进入root
cd /usr/local/bin/
sudo ln -s /usr/local/MATLAB/R2016b/bin/matlab matlab
```

　　此时启动时会让你激活matlab，选择无网络激活。

### 激活

　　在`/usr/local/MATLAB/R2016b/bin/` 下打开终端，并输入下面命令：

```python
sudo matlab
```

　　打开matlab，此时会提示进行激活，使用本地文件激活，选择`Matlab 2016b Linux64Crack.rar` 文件中的`license_standalone.lic` 即可。

　　然后将`matlab_2016b_linux64_crack/R2016b/bin/glnxa64` 目录下的文件文件`libmwservices.so` 复制到`/usr/local/MATLAB/R2016b/bin/glnxa64` :

```python
sudo cp matlab_2016b_linux64_crack/R2016b/bin/glnxa64/libmwservices.so /usr/local/MATLAB/R2016b/bin/glnxa64
```

　　最后还需要安装`matlab-support` :

```python
sudo apt-get install matlab-support  #注意如果出现了问题，则说明前面matlab并没有完全安装好，可以卸载了重新安装
```

　　安装及激活就全部完成了。

### 卸载

　　如果在安装的过程中完全安装好需要卸载时，可以进行如下操作：

1. 打开终端，并输入：

```python
sudo rm -rf /usr/local/MATLAB/R2016b
sudo rm /usr/local/bin/matlab /usr/local/bin/mcc /usr/local/bin/mex /usr/local/bin/mbuild #仅供参考，这些文件可能不存在
```

2. 在`/home/user(你的用户名)` 下面有`.matlab` 文件夹，这是一个隐藏文件夹，输入如下命令进行删除：

```python
sudo rm -rf .matlab
```

### 服务器可视化安装matlab

#### 准备工作

##### 服务器可视化配置

　　服务器由于并没有提供可视化的操作，因此安装matlab的方式会有点不同，为了可以在服务器上可视化操作，在window平台上，我们需要用到`MobaXterm` 这款软件来操作（下载地址：链接：https://pan.baidu.com/s/1Y6CH9xK6sMAh_vtnNjau-A  提取码：ixzj ） ：

![](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/ubuntu16.04%E5%AE%89%E8%A3%85matlab%E8%BF%87%E7%A8%8B%E8%AE%B0%E5%BD%95/03.png)

　　为了能够可视化操作服务器，我们还需要在服务器上配置`x11` :

```c++
apt install x11-apps  --no-install-recommends  // 在服务器终端输入
```

　　检测可视化操作是否正常使用，首先打开`MobaXterm` 登录服务器，并输入如下命令：

```c++
export DISPLAY=202.193.56.131:0.0  //202.193.56.131是你本地电脑的ip地址
```

　　然后输入如下命令，如果显示出了一个小钟的图形界面，则说明可视化正常：

```
xclock
```

　　为了后面的工作更方便的使用`MobaXterm` ，我们还需要对这个工具进行配置，第一点，就是在使用该工具中，选中内容后，右击鼠标右键其会默认自动粘贴，这种设置会不适应，可以进入`Settings`  ——>  `Terminal` 将`Paste using the right-click` 选项的勾选取消。第二点就是在使用ssh的过程中，该工具会由于隔了一段时间没操作会自动断开ssh链接，在使用matlab长时间运行代码的时候这种情况会经常发生而导致matlab程序中断，可以进入`Settings`  ——>  `SSH` 将`SSH keppalive` 选项的勾选上即可。

##### 安装jdk

　　一般在安装matlab之前，Ubuntu上需要有java的环境，因此先查看Ubuntu上是否已经存在该环境：

```c++
java -version  //如果有打印出相关信息，则表明该环境已存在
```

　　如果不存在，则进行如下操作：

```c++
sudo apt-get install openjdk-8-jre
java -version
```

#### 挂载

　　由于服务器用户权限等问题，我们无法在服务器上进行挂载操作，但是我们可以对安装文件（ISO文件），进行解压操作，这个和挂载效果是一样的，首先我们需要在服务器上安装解压iso文件的命令：

```python
apt install --no-install-recommends xorriso
```

　　进入所需安装文件的目录，并先将`R2016b_glnxa64_dvd1.iso` 文件解压至`/mnt/` :

```
osirrox -indev ./R2016b_glnxa64_dvd1.iso -extract / /mnt/disk1
```

#### 进入安装

　　接下来的安装就和前面的安装过程一样了，首先对`dvd1`进行安装操作：

```
sudo /mnt/disk1/install
```

　　注意，在执行上述命令的时候，可能会发生如下错误：

![](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/ubuntu16.04%E5%AE%89%E8%A3%85matlab%E8%BF%87%E7%A8%8B%E8%AE%B0%E5%BD%95/04.png)

　　这是因为，终端当前路径为该安装文件的路径(`/mnt/disk1/`) ，我们需要先跳转到其他路径再进行安装，比如：

```c++
cd ~  //返回到home目录下
sudo /mnt/disk1/install  //再进行安装
```

　　当安装进度为80%的时候，会弹出如下窗口提示我们移出`dvd1` ，插入`dvd2`。

![](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/ubuntu16.04%E5%AE%89%E8%A3%85matlab%E8%BF%87%E7%A8%8B%E8%AE%B0%E5%BD%95/05.png)

　　此时我们可以进行如下操作：

```c++
sudo rm -rf /mnt/disk1/  //清空disk1内容
sudo mv ./media/disk2/ /mnt/disk1/ //将disk2文件移动到disk1里，disk2文件同样通过解压dvd2获得
```

　　接下来的激活操作就和上述在本地ubuntu上安装的过程一样了，请跳转至前面的激活步骤查看。安装结束后，清空mnt目录中的安装文件:

```
sudo rm -rf /mnt/disk1
```



参考：http://www.linuxidc.com/Linux/2017-03/142298.htm

　　　http://blog.csdn.net/jiandanjinxin/article/details/51910555

　　　http://www.linuxidc.com/Linux/2015-11/125153.htm

　　　http://blog.csdn.net/generallc/article/details/52793820

