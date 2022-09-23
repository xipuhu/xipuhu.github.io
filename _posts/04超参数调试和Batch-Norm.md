---
title: 04超参数调试和Batch Norm
categories: [计算机视觉,吴恩达深度学习]
tags: [深度学习]
mathjax: true
toc: true
---

### 超参数调试

#### 随机选取超参数

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/01.png" width=60% height=60%>

<!--more-->

  * 在机器学习领域，超参数比较少的情况下，我们利用设置网格点的方式来调试超参数；
  * 而在深度学习领域，超参数比较多的情况下，不是设置规则的网格点，而是随机选择点进行调试。这样做的原因是在我们处理问题的时候，是无法知道哪个超参数是更重要的，所以随机的方式去测试参数点，更为合理，这样可以探究超参数的潜在价值。

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/02.png" width=60% height=60%>

　　如果在某一区域找到一个效果好的点，我们可以将关注重心放在改点附近的小区域内，继续寻找，做更进一步的精确查找。

#### 为超参数选择合适的范围

　　在超参数选择的时候，一些超参数是在一个范围内进行均匀随机取值，如隐藏层神经元结点的个数、隐藏层的层数等。但是有一些超参数的选择做均匀取值是不合适的，这里需要按照一定的比例在不同的小范围内进行均匀取值。

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/03.png" width=60% height=60%>

　　以学习率$\alpha$ 的选择为例，在$0.001, \cdots ,1$ 范围内进行选择，如上图所示，如果$0.001, \cdots ,1$ 的范围内进行均匀随机取值，则有$90\%$的的概率选择在$0.1 \sim 1$ 的范围之间，而只有$10\%$ 的概率才能选择到$0.001 \sim 0.1$ 的范围之间，这显然是不合理的。所以选择的时候，需要在不同比例范围内进行均匀随机取值，如$0.001 \sim 0.001$ ，$0.001 \sim 0.01$ ，$0.01 \sim 0.1$ ，$0.1 \sim 1$ 范围内选择。
　　其代码实现如下：

```python
r = -4*np.random.rand()  # r in [-4, 0]
learning_rate = 10 ** r
```

#### 超参数调试实践

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/04.png" width=60% height=60%>

* 在计算资源有限的情况下，使用上图左边的方式，仅调试一个模型，每天不断进行优化；
* 在计算机资源充足的情况下，使用上图右边的方式，同时并行调试多个模型，选取其中最好的模型。

#### 重新对超参数重新测试

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/05.png" width=60% height=60%>

　　假如已经找到了一组比较满意的超参数设置，并正在继续发展该算法，但是也许在几个月的过程中，我们的数据在逐渐发生改变，或者更换了服务器等，这个时候我们就需要重新来评估我们的超参数了，每隔几个月至少进行一次这样的操作。

### Batch Norm

#### 对隐藏层输入进行归一化

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/06.png" width=60% height=60%>

　　在逻辑回归中，将输入特征进行归一化，可以加速模型的训练，那么对于更深层次的神经网络，我们也可以对其隐藏层的输出$a^{[l]}$ 或者经过激活函数前的$z^{[l]}$ 进行归一化操作，以便加速神经网络的训练过程，这就是`Batch Norm` 的核心思想。

#### Batch Norm的实现

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/07.png" width=60% height=60%>

　　以神经网络中某一层隐藏层的中间值$z^{(1)},z^{(2)},\ldots,z^{(m)}$ 为例：
$$\mu = \dfrac{1}{m}\sum\limits_{i}z^{(i)}$$ 

$$\sigma^{2}=\dfrac{1}{m}\sum\limits_{i}(z^{(i)}-\mu)^{2}$$ 

$$z^{(i)}_{\rm norm} = \dfrac{z^{(i)}-\mu}{\sqrt{\sigma^{2}+\varepsilon}}$$ 

　　**注意：** 第三个式子中加上$\varepsilon$ 是为了保证数值的稳定，即防止出现分母为零的情况。

　　到这里所有$Z$ 的分量都是平均值为0和方差为1的分布，但是我们不希望隐藏层的单元总是如此，也许不同的分布会更有意义，所以我们再进行计算：
$$\widetilde z^{(i)} = \gamma z^{(i)}_{\rm norm}+\beta$$ 

　　**注意：** 上述等式中，$\widetilde z^{(i)}$ 的分布将由参数$\gamma$ 和$\beta$ 决定，这两个参数也是可以更新学习的参数。

#### 加入Batch Norm到神经网络中

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/08.png" width=60% height=60%>

　　`Batch Norm` 操作发生在计算激活函数值$a$ 之前，即常用的方式是将隐藏层经过激活函数前的$ z^{(i)}$ 进行归一化。得到$\widetilde z^{(i)}$ ，然后在进行激活函数的计算。

#### 实现梯度下降

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/09.png" width=60% height=60%>

　　`Batch Norm` 通常和训练集的`Mini-batch` 一起使用，需要注意的是，在计算均值和方差的时候，b的值将会被抵消减掉而不起作用，因此在进行`Batch Norm` 的时候可以将b忽略，或将其置为0。

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/10.png" width=60% height=60%>

　　上图为在`Mini-batch` 进行操作`Batch Norm` 操作的梯度下降过程，注意其中不需要对b进行梯度下降，$\gamma$ 和$\beta$ 参数的更新，和$w$ 的更新方法一样。

#### Batch Norm起作用的原因

##### 原因一

　　首先`Batch Norm`  可以加速神经网络训练，对输入层的输入特征进行归一化，改变损失函数的形状，使得每一次梯度下降都可以更快的接近函数的最小值点，从而加速模型训练过程的原理是有相同道理的。
　　只是`Batch Norm ` 不是单纯的将输入的特征进行归一化，而是将各个隐藏层的激活函数的激活值进行的归一化，并调整到另外的分布。

##### 原因二

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/11.png" width=60% height=60%>

　　`Batch Norm`  可以加速神经网络训练的另外一个原因是它可以使权重比网络更滞后或者更深层。
　　比如上图中，第一训练样本的集合中的猫均是黑猫，而第二个训练样本集合中的猫是各种颜色的猫。如果我们将第二个训练样本直接输入到用第一个训练样本集合训练出的模型进行分类判别，那么我们在很大程度上是无法保证能够得到很好的判别结果。
　　这是因为第一个训练集合中均是黑猫，而第二个训练集合中各色猫均有，虽然都是猫，但是很大程度上样本的分布情况是不同的，所以我们无法保证模型可以仅仅通过黑色猫的样本就可以完美的找到完整的决策边界。第二个样本集合相当于第一个样本的分布的改变，称为：`Covariate shift问题` 。

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/12.png" width=60% height=60%>

　　那么存在Covariate shift的问题如何应用在神经网络中？就是利用**Batch Norm**来实现。网络的目的是通过不断的训练，最后输出一个更加接近于真实值的$\hat{y}$。
　　现在以第2个隐藏层为输入来看，对于后面的神经网络，是以第二层隐层的输出值$a^{[2]}$ 作为输入特征的，通过前向传播得到最终的$\hat{y}$ ，但是因为我们的网络还有前面两层，由于训练过程，参数$w^{[1]}$，$w^{[2]}$ 是不断变化的，那么也就是说对于后面的网络，$a^{[2]}$ 的值也是处于不断变化之中，所以就有了`Covariate shift` 的问题。
　　如果对$z^{[2]}$ 使用了**Batch Norm** ，那么即使其值不断的变化，但是其均值和方差却会保持。那么**Batch Norm** 的作用便是其限制了前层的参数更新导致对后面网络数值分布程度的影响，使得输入后层的数值变得更加稳定。另一个角度就是可以看作，**Batch Norm ** 削弱了前层参数与后层参数之间的联系，使得网络的每层都可以自己进行学习，相对其他层有一定的独立性，这会有助于加速整个网络的学习。

#### Batch Norm具有正则化效果

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/13.png" width=60% height=60%>

　　`Batch Norm` 还有轻微的正则化效果。这是因为在使用`Mini-batch` 梯度下降的时候，每次计算均值和偏差都是在一个`Mini-batch` 上进行计算，而不是在整个数据样集上。这样就在均值和偏差上带来一些比较小的噪声。那么用均值和偏差计算得到的$\widetilde z^{(i)}$ 也将会加入一定的噪声。
　　所以和`Dropout` 相似，其在每个隐藏层的激活值上加入了一些噪声，（这里因为`Dropout` 以一定的概率给神经元乘上0或者1）。所以和`Dropout` 相似，`Batch Norm` 也有轻微的正则化效果。
　　这里引入一个小的细节就是，如果使用`Batch Norm`  ，那么使用大的`Mini-batch` 如256，相比使用小的`Mini-batch` 如64，会引入更少的噪声，那么就会减少正则化的效果。

#### 在测试数据上使用Batch Norm

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/14.png" width=60% height=60%>

　　训练过程中，我们是在每个`Mini-batch` 使用`Batch Norm` ，来计算所需要的均值$\mu$ 和方差$\sigma^2$ 。但是在测试的时候，我们需要对每一个测试样本进行预测，无法计算均值和方差。
　　此时，我们需要单独进行估算均值$\mu$ 和方差$\sigma^2$ 。通常的方法就是在我们训练的过程中，对于训练集的`Mini-batch` ，使用`指数加权平均` ，当训练结束的时候，得到指数加权平均后的均值$\mu$ 和方差$\sigma^2$ ，而这些值直接用于`Batch Norm` 公式的计算，用以对测试样本进行预测。

### Softmax 回归

　　在多分类问题中，有一种 `logistic regression` 的一般形式，叫做`Softmax regression` 。`Softmax回归` 可以将多分类任务的输出转换为各个类别可能的概率，从而将最大的概率值所对应的类别作为输入样本的输出类别。

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/15.png" style="zoom:67%;" />

#### Softmax layer

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/16.png" style="zoom:67%;" />

　　Softmax激活函数，与一般逻辑回归的激活函数不同的是其输入输出是一个多维数据，而对于一般逻辑回归的激活函数，其输入输出都只是一个实数，即只能做二分类。

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/17.png" style="zoom:67%;" />

#### 理解Softmax

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/18.png" style="zoom:67%;" />

　　通常我们判定模型的输出类别，是将输出的最大值对应的类别判定为该模型的类别，也就是说最大值的位置为1，其余位置为0，这也就是所谓的“hardmax”。而Sotfmax将模型判定的类别由原来的最大数字5，变为了一个最大的概率0.842，这相对于“hardmax”而言，输出更加“soft”而没有那么“hard”。Sotfmax回归 将 logistic回归 从二分类问题推广到了多分类问题上。

#### Softmax的损失函数

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E8%B6%85%E5%8F%82%E6%95%B0%E8%B0%83%E8%AF%95%E5%92%8CBatch%20Norm/19.png" style="zoom:67%;" />

　　Sotfmax使用的损失函数为：
$$L(\hat y,y)=-\sum\limits_{j=1}^{4}y_{j}\log \hat y_{j}$$ 

　　在训练过程中，我们的目标是最小化$L(\hat y,y)$，由目标值我们可以知道，$y_1=y_3=y_4=0，y_2=1$，所以代入$L(\hat y,y)$中，有：
$$L(\hat y,y)=-\sum\limits_{j=1}^{4}y_{j}\log \hat y_{j}=-y_{2}\log \hat y_{2}=-\log \hat y_{2}$$ 

　　所以为了最小化$L(\hat y,y)$，我们的目标就变成了使得$\hat{y_2}$的概率尽可能的大。也就是说，这里的损失函数的作用就是找到你训练集中的真实的类别，然后使得该类别相应的概率尽可能地高，这其实是最大似然估计的一种形式。

　　对应的损失函数如下：

$$J(w^{[1]},b^{[1]},\ldots)=\dfrac{1}{m}\sum\limits_{i=1}^{m}L(\hat y^{(i)},y^{(i)})$$ 

参考自：https://blog.csdn.net/koala_tree/article/details/78234830
代码链接：https://pan.baidu.com/s/1ARKQXAyqTmKs4pjcZpQZ6A 密码：c8dt