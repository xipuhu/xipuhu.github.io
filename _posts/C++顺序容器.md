---
title: C++顺序容器
categories: [读书笔记,C++ Primer]
tags: [C++顺序容器]
toc: true
---

### 容器库概览

#### 容器类型

　　顺序容器、关联容器和无序容器。

<!--more-->

#### 迭代器

　　与容器一样，迭代器有着公共的接口，如果一个迭代器提供某个操作，那么所有提供相同操作的迭代器对这个操作的实现方式都是相同的。比如，标准容器类型上的所有迭代器都允许我们访问容器中的元素，而**所有迭代器都是通过解引用运算符来实现这个操作的。** 类似的，**标准容器的所有迭代器都定义了递增运算符** ，用于从当前元素移动到下一个元素。

　　容器迭代器支持的所有操作如下：

> *iter 返回迭代器iter所指元素的引用iter->mem 解引用iter并获取该元素的名为mem的成员，等价于(*iter).mem

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/01.png" width=60% height=60%>

　　**其中有一个例外不符合公共接口特点：** forward_list迭代器不支持递减运算符。
　 迭代器支持的算术运算如下：
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/02.png" width=60% height=60%>

　　**注意：** 以上的这些运算只能应用与string、vector、deque和array的迭代器，我们不能将它们用于其他任何容器类型的迭代器。

#### **迭代器使用左闭合范围蕴含的编程假定**

　　 标准库使用左闭合范围是因为这种范围有三种方便的性质。假定begin和end构成一个合法的迭代器范围，则

- 如果begin和end相等，则范围为空。
- 如果begin与end不等，则范围至少包含一个元素，且begin指向该范围中的第一个元素。
- 我们可以对begin递增若干次，使得begin==end。

　　这些性质意味着我们可以像下面的代码一样用一个循环来处理一个元素范围，而这是安全的：

```
while(begin != end){
  *being = val;
  ++begin;
}
```

#### **容器类型成员**

　　 除了已经知道的常见迭代器容器，大多数容器还提供`反向迭代器`。简单来说，反向迭代器就是一种反向遍历容器的迭代器，与正向迭代器相比，各种操作的含义也都发生了颠倒。比如，对一个反向迭代器执行++操作，会得到上一个元素。
　　每个容器都定义了多个类型，如下所示：
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/03.png" width=60% height=60%>

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/04.png" width=60% height=60%>

#### begin和end成员

　　这两个操作有多个版本，其中带r的版本返回反向迭代器，以c开头的版本则返回const迭代器：

```
list<string> a= {"A", "B", "C"};
auto it1 = a.begin();         //list<string>::iterator
auto it2 = a.rbegin();        //list<string>::reverse_iterator
auto it3 = a.cbegin();        //list<string>::const_iterator
auto it4 = a.crbegin();       //list<string>::const_reverse_iterator
```

　　当auto与begin或end结合使用时，获得的迭代器类型依赖于容器类型，与我们想如何使用迭代器毫不相干。但以c开头的版本还是可以获得const_iterator的，而不管容器的类型是什么：

```
//显示指定类型
list<string>::iterator it5 = a.begin();
list<string>::const_iterator it6 = a.begin();
//是itertor还是const_iterator依赖于a的类型
auto it7 = a.begin();     //仅当a是const时，it7是const_iterator
auto it8 = a.cbegin();     //it8是const_iterator
```

#### 容器定义和初始化

　　每个容器类型都定义了一个`默认构造函数` ，除`array` 之外，其他容器的默认构造函数都会创建一个指定类型的空容器，且都可以接受指定容器大小和元素初始值的参数：
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/05.png" width=60% height=60%>

　　**注意：** 只有顺序容器的构造函数才接受大小参数，`关联函数` 并不支持。
　　**标准库array具有固定大小：** 与内置数组一样，标准库array的大小也是类型的一部分，当定义一个array时，除了指定元素类型，还要指定容器的大小：

```
array<int, 42>::size_type i;             // 数组类型包括元素类型和大小
array<int>::size_type j;                  // 错误：array<int>不是一个类型
```

　　如果我们对array进行列表初始化，初始值的数目必须等于或小于array的大小，如果初始值数目小于array的大小，则它们被用来初始化array中靠前的元素，所有剩余元素都会进行值初始化。

#### 赋值和swap

　　 `与内置数组不同，标准库array类型允许赋值` ，赋值号左右两边的运算对象必须具有相同的类型：

```
array<int, 10> a1 = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
array<int, 10> a2 = {0};     //所有元素值均为0
a1 = a2;                     // 替换a1中的元素
a2 = {0};                    // 错误：不能将一个花括号列表赋予数组
```

　　**注意：** 由于右边运算对象的大小可能与左边运算对象的大小不同，因此array类型不支持`assign` ，也不允许用花括号包围的值列表进行赋值。
　　容器赋值运算如下：
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/06.png" width=60% height=60%>

　　**使用assign（仅顺序容器）：** 顺序容器（array除外）还定义了一个名为assign的成员，允许我们从一个**不同但相容的类型赋值** ，或者从容器的一个子序列赋值。`assign操作` 用参数指定的元素（的拷贝）替换左边容器中的所有元素。例如，我们可以用assign实现将一个vector中的一段char*赋值予一个list中的string：

```
list<string> names;
vector<const char*> oldstyle;
names = oldstyle;   // 错误：容器类型不匹配
// 正确：可以将const char*转换为string
name.assign(oldstyle.cbegin(), oldstyle.cend());
```

**注意：** 由于其旧元素被替换，因此传递给assign的迭代器不能指向调用assign的容器。
　　`assign的第二个版本` 接受一个整型值和一个元素值。它用于指定数目且具有相同给定值的元素替换同期中原有的元素：

```
// 等价于slist1.clear();
// 后跟slist1.insert(slist1.begin(), 10, "Hiya!");
list<string> slist1(1);             // 1个元素，为空string
slist1.assign(10, "Hiya!");         // 10个元素，每个都是”Hiya！“
```

　　**使用swap：** swap操作主要用于交换`两个相同类型容器的类型` ，调用swap之后，两个容器中的元素将会交换：

```
vector<string> svec1(10);     // 10个元素的vector
vector<string> svec2(24);     //24个元素的vector
swap(vec1, vec2);
```

　　调用swap后，svec1将包含24个string元素，svec2将包含10个string，除array外，交换两个容器的操作保证会很快——**元素本身并未交换** ，**swap只是交换了两个容器的内部数据结构。**
　　**注意：** 除array外，swap不对任何元素进行拷贝、删除或插入操作，因此可以保证在常数时间内完成。
　　**使用swap需要注意以下几点：**

- **元素不会被移动的事实意味着，除string外，指向容器的迭代器、引用和指针在swap操作之后都不会失效** ，它们仍然指向swap操作之前所指向的那些元素。但是，在swap之后，这些元素已经属于不同的容器了。例如，将定iter在swap之前指向svec1[3]的string，那么在swap之后它指向svec3[3]的元素。与其他容器不同，对一个string调用swap会导致迭代器、引用和指针失效。
- **与其他容器不同，swap两个array会真正交换它们的元素，** 因此交换两个array所需的时间与array中元素的数目成正比。对于array，在swap操作之后，指针、引用和迭代器所绑定的元素保持不变，但元素值已经与另一个array中对应元素的值进行了交换。
- 在新标准库中，容器既提供`函数版本的swap` ，也提供非成员版的swap。而早期标准库版本只提供成员函数版本的swap。非成员版本的swap在`泛型编程` 中是非常重要的。**统一使用非成员版本的swap是一个好习惯。**

#### 容器大小操作

　　除了一个例外，每个容器类型都有三个相关的操作。成员函数`size` 返回容器中元素的数目；`empty`当size为0时返回布尔值true，否则返回false；`max_size` 返回一个大于或等于该类型容器所能容纳的最大元素数的值。**forward_list支持max_size和empty，但不支持size。**

#### 关系运算符

　　每个容器都支持相等运算符(==和！=)；除了`无序关联容器` 外的所有容器都支持关系运算符(>，>=，<，<=)。关系运算符左右两边的运算对象必须是相同类型的容器，且必须保存相同类型的元素。即，我们只能将一个vetor< int> 与另一个vector< int> 进行比较，而不能将一个vector< int> 与一个list< int> 或一个vector< double> 进行比较。
　　比较两个容器实际上是进行`元素的逐对比较` ，这些运算符的工作方式与string的关系运算类似：

- 如果两个容器具有相同大小且所有元素都两两对应相等，则这两个容器相等，否则两个容器不等。
- 如果两个容器大小不同，但较小容器中每个元素都等于较大容器中的对应元素，则较小容器小于较大容器。
- 如果两个容器都不是另一个容器的前缀子序列，则它们的比较结果取决于第一个不相等的元素的比较结果。

　　**容器的关系运算符使用元素的关系运算符完成比较：** `容器的相等运算符` 实际上是使用`元素的==运算符` 来实现比较的，而`其他关系运算符` 是使用`元素的<运算符` 。如果`元素类型` 不支持所需运算符，那么保存这种元素的容器就不能使用相应的关系运算符。例如，对于没有定义==和< 运算符的`类类型` ，就不能比较两个该类类型元素的容器：

```
vector<Sale_data> storeA, storeB;
if(storeA < storeB)                 // 错误：Sales_data没有<运算符
```

**注意：** 只有当其元素类型也定义了相应的比较运算符时，我们才可以使用关系运算符来比较两个容器。

### 顺序容器概述

　　所有顺序容器都提供了`快速顺序访问` 元素的能力，但是，这些容器在以下方面都有不同的性能折中：

- 向容器`添加` 或从容器中`删除` 元素的代价
- `非顺序访问` 容器中元素的代价

　　顺序容器类型如下：
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/07.png" width=60% height=60%>

　　在某些情况下，**存储策略** 还会影响特定容器是否支持特定操作：
　　**1、string和vector：** 将元素保存在连续的内存空间。由于元素是`连续存储` 的，通过元素的下标来计算其地址是非常快速的。但是，在这两种容器的中间位置添加或删除元素就会非常耗时。
　　**2、list和forward_list：** 这两个容器的设计目的是令容器`任何位置的添加和删除操作` 都很快速，但作为代价，这两个容器不支持元素的`随机访问` 。
　　**3、deque：** 与string和vector一样，在deque的中间位置添加或删除元素的代价（可能）很高。但是，在deque的两端添加或删除元素都是很快的，与list或forward_list添加删除元素的速度相当。
　　**4、array：** 与内置数组相比，array是一种更安全、更容易使用的数组类型。和内置数组类似，array对象的大小是固定的，因此，array不支持添加和删除元素以及改变容器大小的操作。
　　**注意：** forward_list和array是新C++标准增加的类型。
**确定使用哪种顺序容器：**

- 除非你有很好的理由选择其他容器，否则应使用vector。
- 如果你的程序`有很多小的元素` ，且`空间的额外开销很重要` ，则不要使用list或forward_list。
- 如果程序要求`随机访问元素`，应使用vector或deque。
- 如果程序需要`在容器的中间插入或删除元素` ，应使用list或forward_list。
- 如果程序需要`在容器的头尾位置插入或删除元素` ，但不会在中间位置进行插入或删除操作，则使用deque。

**注意：** 通常，使用vector是最好的选择，除非你有很好的理由选择其他容器。

### 顺序容器操作

#### 向顺序容器添加元素

 除array外，所有标准库容器都提供了灵活的内存管理，在运行时可以动态添加或删除元素来改变容器大小：
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/08.png" width=60% height=60%>

　　当我们使用以上这些操作时，必须要记得不同容器使用不同的策略来分配元素空间，而这些操作直接影响性能。在一个vector或string的尾部之外的任何位置，或是一个deque的首尾部之外的任何位置添加元素，都需要移动元素。而且，向一个vector或string添加元素可能引起整个对象`存储空间的重新分配` ，重新分配一个对象的存储空间需要分配新的内存，并将元素从旧的空间移动到新的空间中。
　　**1、使用push_back:** 除了array和forward_list之外，每个容器（包括string类型）都支持push_back。不过需要注意的是，容器元素是拷贝，当我们用一个对象来初始化容器时，或将一个对象插入到容器中时，实际上放入到容器中的是对象值的一个拷贝，而不是对象本身。
　　**2、使用push_front:** 除了push_back，`forward_list` 、`list` 和`daque` 容器还支持名为push_front的类似操作。此操作将元素插入到容器头部。
　　**注意：** deque像vector一样提供了`随机访问元素的能力` ，但它还提供了vector所不支持的push_front。deque保证在容器首尾进行插入和删除元素的操作都只花费常数时间。与vector一样，在deque首尾之外的位置插入元素将会很耗时。
　　**3、在容器中的特定位置添加元素：** `vector` 、`deque` 、`list` 和`string` 都支持`insert成员` ，`forward_list` 提供了特殊版本的insert成员。　　
　　每个insert函数都接受一个迭代器作为其第一个参数，由于迭代器可能指向容器尾部之后不存在的元素的位置，而且在容器开始位置插入元素是很有用的功能，所以**insert函数将元素插入迭代器所指向的位置之前**。

```
vector<string> svec
// vector不支持push_front，但可以插入到begin()之前
// 警告：插入到vector末尾之外的任何位置都可能很慢
svec.insert(sevec.begin(), "hello!")
```

　　**注意：** 虽然某些容器不支持`push_front` 操作，但是它们对于insert操作并无类似的限制（插入开始位置）。因此我们可以将元素插入到容器的开始位置，而不必担心是否支持push_front。**将元素插入到vector、deque和string中的任何位置都是合法的，但是这样做可能很耗时** 。
　　除了第一个迭代器参数之外，insert函数还可以接受更多的参数，着与容器构造函数类似。其中一个版本接受一个`元素数目` 和`一个值` ，它将指定数量的元素添加到指定位置之前，这些元素都按给定值初始化：

```
// 将10个"Anna"插入到svec的末尾
svec.insert(svec.end(), 10, "Anna");
```

　　接受一对迭代器或一个初始化列表的insert版本将给定范围中的元素插入到指定位置之前：

```
vector<string> v = {"A", "B", "C", "D"};
//将v的最后两个元素添加到slist的开始位置
slist.insert(slist.begin(), v.end()-2, v.end());

slist.insert(slist.end(),{"these", "words", "will", "go", "at", "the", "end"};
//运行时错误：迭代器表示要拷贝的范围，不能指向与目的位置相同的容器
slist.insert(slist.begin(), slist.begin(), slist.end());
```

　　**注意：** 在新标准下，接受元素个数或范围的insert版本返回指向第一个新加入元素的迭代器（在旧版本的标准库中，这些操作返回void），如果范围为空，不插入任何元素，insert操作会将第一个参数返回。
　　**4、使用insert的返回值：** 通过使用insert的返回值，可以在容器中一个特定位置反复插入元素：

```
list<string> lst;
auto iter = lst.begin();
while(cin>>word)
  iter = lst.insert(iter, word);  // 等价于调用push_front
```

　　**5、使用emplace操作：** 新标准引入了三个成员——emplace_front、emplace和emplace_back，这些操作构造而不是拷贝元素。这些操作分别对应push_front、insert和push_back，允许我们将元素放置在容器头部、一个指定位置之前或容器尾部。
　　当调用push或insert成员函数时，我们将元素类型的对象传递给它们，这些对象`被拷贝` 到容器中。**而当我们调用一个emplace成员函数时，则是将参数传递给元素类型的构造函数，emplace成员使用这些参数在容器管理的内存中直接构造元素。** 例如假定c保存Sales_data元素：

```
// 在c的末尾构造一个Sales_data对象
// 使用三个参数的Sales_data构造函数
c.emplace_back("9999-99999", 25, 15.99);

// 错误：没有接受三个参数的push_back版本
c.push_back("9999-99999", 25, 15.99);
// 正确：创建一个临时的Sales_data对象传递给push_back
c.push_back(Sales_data("9999-99999", 25, 15.99);
```

　　emplace函数的参数根据元素类型而变化，参数必须与元素类型的构造函数相匹配

```
// iter 指向c 中一个元素，其中保存了Sa1es_data 元素
c.emp1ace_back(); //使用Sales data 的默认构造函数
c.emplace(iter, " 999- 999999999 " ) ; // 使用Sa1es_data(string)
//使用Sales_data 的接受一个ISBN 、一个count 和一个price 的构造函数
c.emplace_front(" 978 - 0590353403 " , 25 , 15 . 99) ;
```

　　**注意：** emplace函数在容器中直接构造元素，传递给emplace函数的参数必须与元素类型的构造函数相匹配。

#### 访问元素

　　包括array在内的每个顺序容器都有一个`front成员函数` ，而除forward_list之外的所有容器都有一个`back成员函数` ，这两个操作分别返回首元素和尾元素的`引用` ：

```
// 在解引用一个迭代器或调用front或back之前检查是否有元素
if(!c.empty()){
  // val和val2是c中第一个元素值的拷贝
  auto val =*c.begin(),val2 = c.front();
  // val3和val4是c中最后一个元素值的拷贝
  auto last = c.end();
  auto val3 = *(--last);         // 不能递减forward_list迭代器
  auto val4 = c.back();          // forward_list不支持
}
```

**注意：** 迭代器end指向的是容器尾元素之后的（不存在的）元素，为了获取尾元素，必须首先递减此迭代器。在调用front和back（或解引用begin和end返回的迭代器）之前，要确保c非空，如果容器为空，if中操作的行为将是未定义的。
　　在顺序容器中访问元素的相关操作如下：
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/09.png" width=60% height=60%>

　　**1、访问成员函数返回的是引用：** 在容器中访问元素的成员函数（即，front、back、下标和at），返回的元素都是`引用` 。
　　**2、下标操作和安全的随机访问：** 提供快速随机访问的容器（string、vector、deque和array）也都提供下标运算符。下标运算符接受一个下标参数。返回容器中该位置的元素的`引用` 。
　　**注意：** 保证下标有效是程序员的责任，下标运算符并不检查是否在合法范围内。使用越界的下标是一种严重的程序设计错误，而且编译器并不检查这种错误。

#### 删除元素

　　与添加元素的多种方式类似，（非array）容器也很有多种删除元素的方式：
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/10.png" width=60% height=60%>

　　**注意：** 删除元素的成员函数并不检查其参数，在删除元素之前，程序员必须确保它（们）是存在的。
　　**1、pop_front和pop_back成员函数：** 与vector和string不支持push_front一样，这些类型也不支持pop_front。类似的，forward_list不支持pop_back。
　　**2、从容器内部删除一个元素：** `成员函数erase` 从容器中指定位置删除元素，我们可以删除由一个迭代器指定的单个元素，也可以删除由一对迭代器指定的范围内的所有元素。两种形式的erase都返回指向删除的（最后一个）元素之后位置的迭代器。即，若j是i之后的元素，那么erase(i)将返回指向j的迭代器。

```
// 删除list中的所有奇数元素
list<int> lst = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
auto it=lst.begin();
while(it != lst.end()){
  if(*it % 2)            
    it = lst.erase(it);   // 删除此元素
  else
    ++it;
}
```

　　**3、删除多个元素：** 接受一对迭代器的erase版本允许我们删除一个范围内的元素：

```
// 删除两个迭代器表示的范围内的元素
// 返回指向最后一个被删元素之后位置的迭代器
elem1 = slist.erase(elem1, elem2);            // 调用后，elem1 == elem2
```

　　为了删除一个容器中的所有元素，我们既可以调用clear，也可以用begin和end获得的迭代器作为参数调用erase：

```
slist.clear();    // 删除容器中所有元素
slist.erase(slist.begin(), slist.end());              // 等价调用
```

　　**4、特殊的forward_list操作：**
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/11.png" width=60% height=60%>

　　在一个forward_list中添加或删除元素的操作是通过改变给定元素之后的元素来完成的，这样我们总是可以访问到被添加或删除操作所影响的元素。由于这些操作与其他容器上的操作的实现方式不同，forward_list并未定义insert、emplace和erase，而是定义了名为`insert_after` 、`emplace_after` 和`erase_after` 的操作。为了支持这些操作，forward_list也定义了before_begin，它返回一个`首前迭代器` 。这个迭代器允许我们在链表首元素之前并不存在的元素“之后”添加或删除元素（即在链表首元素之前添加删除元素）：
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/12.png" width=60% height=60%>
　　**当forward_list中添加或删除元素时，我们必须关注两个迭代器——一个指向我们要处理的元素，另一个指向其前驱：**

```
forward_list<int> flst = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
auto prev = flst.before_begin();                           // 表示flst的“首前元素”
auto curr = flst.begin();                                  // 表示flst中的第一个元素
while(curr !=flst.end()){
  if(*curr %2)
    curr = flst.erase_after(prev);                         // 移除它并移动curr
  else{
    // 移动迭代器curr，指向下一个元素，prev指向curr之前的元素
    prev = curr;                                         
    ++curr;
  }
}
```

　　**5、改变容器大小：** 我们可以用`resize` 来增大或缩小容器，与往常一样，array不支持resize。如果当前大小大于所要求的大小，容器后部地元素会被删除；如果当前大小小于新大小，会将新元素添加到容器后部：

```
list<int> ilist(10, 42);      // 10个int：每个的值都是42
ilist.resize(15);             // 将5个值为0的元素添加到ilist的末尾
ilist.resize(25, -1);         // 将10个值为-1的元素添加到ilist的末尾
ilist.resize(5);              // 从ilist末尾删除20个元素
```

　　resize操作接受一个可选的元素值参数，用来初始化添加到容器中的元素。如果调用者未提供此参数，新元素进行值初始化。如果容器保存的是`类类型` 元素，且resize向容器添加新元素，则我们必须提供初始值，或者元素类型必须提供一个没人构造函数。
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/13.png" width=60% height=60%>
　　**6、容器操作可能使迭代器失效：** 向容器中添加元素和从容器中删除元素的操作可能会是指向容器元素的`指针` 、`引用` 或`迭代器` 失效。一个失效的指针、引用或迭代器将不再表示任何元素。使用失效的指针、引用或迭代器是一种严重的程序设计错误，很可能引起与使用为初始化指针一样的问题。
　　**在向容器添加元素后：**

- **如果容器是vector或string，且存储空间被重新分配，则指向容器的迭代器、指针和引用都会失败** 。如果存储空间未重新分配，指向插入位置之前的元素的迭代器、指针和引用仍有效，但指向插入位置之后元素的迭代器、指针和引用将会失效。
- 对于deque，插入到除首尾位置之外的任何位置都会导致迭代器、指针和引用失效。如果在首尾位置添加元素，迭代器会失效，但指向存在的元素的引用和指针不会失效。
- 对于list和forward_list，指向容器的迭代器（包括`尾后迭代器` 和`首前迭代器` ）、指针和引用仍有效。

　　**当我们删除一个元素后：**

- 对于vector和string，指向被删除元素之前元素的迭代器、引用和指针仍有效。注意，当我们删除元素时，尾后迭代器总是会失效。
- 对于deque，如果在首尾之外的任何位置删除元素，那么指向被删除元素外其他元素的迭代器、引用或指针也会失效。如果是删除deque的尾元素，则`尾后迭代器` 也会失效，但其他迭代器、引用和指针不受影响；如果是删除首元素，这些也不会受影响。
- 对于list和 forward_list ，指向容器其他位置的迭代器（包括`尾后迭代器` 和`首前迭代器` ）、引用和指针仍有效。

　　**警告：** 使用失效的迭代器、指针或引用是严重的运行时错误。
　　**注意：** 由于向迭代器添加元素和从迭代器删除元素的代码可能会使迭代器失效，因此必须保证每次改变容器的操作之后都正确地重新定位迭代器，这个建议对`vector` 、`string` 和`deque` 尤为重要。
　　**7、编写改变容器的循环程序：** 添加/删除vector、string或daque元素的循环程序必须考虑迭代器、引用和指针可能失效的问题。程序必须保证每个循环步中都更新迭代器、引用或指针。如果循环中调用的是insert或erase，那么更新迭代器很容易。这些操作都返回迭代器，我们可以用来更新：

```
// 傻瓜循环，删除偶数元素，复制每个奇数元素
vector<int> vi = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
auto iter = vi.begin();   //调用begin而不是cbegin，因为我们要改变vi
while(iter !=vi.end()){
  if(*iter % 2){
    iter = vi.insert(iter, *iter);    // 复制当前元素
    iter += 2;             // 向前移动迭代器，跳过当前元素以及插入到它之前的元素
  }
  else
    iter = vi.erase(iter);  // 删除偶数元素
    // 不应向前移动迭代器，iter指向我们删除的元素之后的元素
}
```

　　**8、不要保存end返回的迭代器：** 当我们添加/删除vector或string的元素后，或在deque中首元素之外任何位置添加/删除元素后，原来end返回的迭代器总是会失效。因此，添加或删除元素的循环程序必须反复调用end，而不能在循环之前保存end返回的迭代器，一直当作容器末尾使用。通常C++新标准库实现中end()操作都很快，部分就是因为这个原因。

### vector对象是如何增长的

　　假定容器中元素是连续存储的，且容器的大小是可变的，考虑向vector或string中添加元素会发生什么：**如果没有空间容纳新元素，容器不可能简单地将它添加到内存中其他位置——因为元素必须连续储存。** 容器必须分配新的内存空间来保存已有元素和新元素，**将已有元素从旧位置移动到新空间中，然后添加新元素，释放存储空间。** 如果我们每添加一个新元素，vector就执行一次这样的内存分配和释放操作，性能会慢到不可接受。
　　为了避免上述这种代价，标准库实现者采用了可以减少容器空间重新分配次数的策略。**当不得不获取新的内存空间时，vector和string的实现通常会分配比新的空间需求更大的内存空间。** 容器预留这些空间作为备用，可用来保存更多的元素。这样，就不需要每次添加新元素都重新分配容器的内存空间了。
　　**1、管理容量的成员函数：** `vector和sting类型` 提供来一些成员函数，允许我们与它的实现中内存分配部分互动。`capacity操作` 告诉我们容器在不扩张内存空间的情况下可以容纳多少个元素。`reserve操作` 允许我们通知容器它应该准备保存多少个元素。
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/14.png" width=60% height=60%>

　　**注意：** reserve并不改变容器中元素的数量，它仅影响vector预先分配多大的内存空间。只有当内存空间超过当前容量时，reserve调用才会改变vector的容量，**如果需求大小大于当前容量，reserve至少分配与需求一样大的内存空间（可能更大）。**
　　调用reserve永远也不会减少容器占用的内存空间。类似的`resize成员函数` 只改变容器中元素的数目，而不是容器的容量。我们同样不能用resize来减少容器预留的内存空间。
　　 在`C++11新标准库` 中，我们可以调用`shrink_to_fit` 来要求deque、vector或string退回不需要的内存空间。此函数指出我们不再需要任何多余的内存空间。但是，具体的实现可以选择忽略此请求，也就是说，**调用shrink_to_fit也并不保证一定退回内存空间。**
　　**注意：** 调用shrink_to_fit只是一个请求，标准库并不保证退还内存。
　　**capacity和size：** 理解capacity和size的区别非常重要。容器的size是指它已经保存的元素的数目；而capacity则是在不分配新的内存空间的前提下它最多可以保存多少元素（包括已经保存的元素）。

### 额外的string操作

　　**1、构造string的其他方法：**
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/15.png" width=60% height=60%>

　　这些构造函数接受一个string或一个const char*参数，还接受（可选的）指定拷贝多少个字符的参数：

```
const char *cp = "Hello World!!!";    // 以空字符结束的数纽
char noNu l l [] = ( 'H', 'i' ) ;   // 不是以空字符结束
string sl (cp);            // 拷贝cp 中的字符直到遇到空字符; sl == "Hello Wor1d!!!"
string s2 (noNull, 2 );    // 从noNul1 拷贝两个字符; s2 == "Hi "
string s3 (noNu11);        // 未定义noNu11 不是以空字符结束
string s4 (cp + 6, 5 ) ;   // 从cp[6]开始拷贝5个字符; s4 == "Wor1d"
string s5 (sl, 6, 5 );     // 从sl[6]开始拷贝5个字符; s5 == "World"
string s6 (sl, 6) ;        // 从sl[6]开始拷贝，直至sl 末尾; s6 == "Wor1d' ! !"
string s7 (sl, 6, 20 ) ;   // 正确，只拷贝到sl末尾; s7 == "World!!!"
string s8 (sl, 16);        // 抛出一个out_of_range 异常
```

　　**2、substr操作：** substr操作返回一个string，它是原始string的一部分或全部的拷贝，可以传递给substr一个可选的开始位置和计数值：

```
string s("hello world");
string s2 = s.substr(0, 5);        // s2 = "hello"
string s3 = s.substr(6);           // s3 = "world"
string s4 = s.substr(6, 11);       // s4 = "world"
string s5 = s.substr(12);          // 抛出一个out_of_range异常
```

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/16.png" width=60% height=60%>

　　**注意：** 如果开始位置超过了string的大小，则substr函数抛出一个out_of_range异常。如果开始位置加上计数值大于string的大小，则substr会调用整计数值，只拷贝到string的末尾。
　　**3、append和replace函数：**
　　append操作是在string末尾进行插入操作的一种简写形式：

```
string s("C++ Primer"),s2 =s;
s.insert(s.size(), "4th Ed.");    // s == ”C++ primer 4th Ed“
s2.append(" 4th Ed.");            // 等价方法：将”4th Ed.“追加到s2； s == s2
```

　　replace操作是调用erase和insert的一种简写形式：

```
// 将”4th“替换为”5th“的等价方法
s.erase(11, 3);             // s == "C++ Primer Ed."
s.insert(11, "5th");        // s == "C++ Primer 5th Ed."
//从位置11开始，删除3个字符并插入”5th“
s2.replace(11, 3, "5th");   //等价方法：s == s2
```

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/17.png" width=60% height=60%>

　　**4、改变string的多种重载函数：**
　　assign和append函数无须指定要替换string中哪个部分：**assign总是替换string中的所有内容，**append总是将新字符追加到string末尾。
　　replace函数提供来两种指定删除元素范围的方式，可以通过一个位置和一个长度来指定范围，也可以通过一个迭代器范围来指定。
　　insert函数允许我们用两种方式指定插入点：用一个下标或一个迭代器，在两种情况下，新元素都会插入到给定下标或迭代器之前的位置。
　　**5、string搜索操作：** string类提供了6个不同的搜索函数，每个函数都有4个重载版本。每个搜索操作都会返 回一个string::size_type值（unsigned类型），表示匹配发生位置的下标，如果搜索失败，则返回一个名为`string::npos` 的static成员。标准库将npos定义为一个const string::size_type类型，并初始化为值-1。
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/18.png" width=60% height=60%>

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/19.png" width=60% height=60%>

### 容器适配器

　　除了顺序容器外，标准库还定义来三个顺序容器适配器：`stack` 、`queue` 和`priority_queue` 。**适配器** 是标准库中的一个通用概念。**容器、迭代器和函数都有适配器** 。本质上，一个适配器是一种`机制` ，能使某种事物的行为看起来像另外一种事物一样。一个容器适配器接受一个已有的容器类型，使其行为看起来像一种不同的类型。例如，stack适配器接受一个顺序容器（**除array或forward_list外** ），并使其操作起来像一个stack一样。所有`容器适配器` 都支持的操作和类型如下：
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/20.png" width=60% height=60%>

　　**1、定义一个适配器：** 对于一个给定的适配器，可以使用哪些容器是有限制的。**所有适配器都要求容器具有添加和删除元素的能力** 。因此，适配器不能构造在array之上。类似的，我们也不能用forward_list来构造适配器，因为所有适配器都要求容器具有添加、删除以及访问尾元素的能力。

- stack 只要求`push_back` 、`pop_back` 和 `back` 操作，因此可以使用除array和forward list 之外的任何容器类型来构造stack。
- queue 适配器要求`back` 、`push_back` 、`front` 和`push_front` 。 因此它可以构造于list 或deque 之上， 但不能基于vector 构造。
- priority_queue 除了`front` ， `push_back` 和`pop_back` 操作之外还要求随机访问能力，因此它可以构造于vector 或deque 之上，但不能基于list构造。

　　**2、栈适配器：**
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/21.png" width=60% height=60%>

　　**3、队列适配器：**
　<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/%E9%A1%BA%E5%BA%8F%E5%AE%B9%E5%99%A8/22.png" width=60% height=60%>
　　**注意：** 每个容器适配器都基于底层容器类型的操作定义来自己的特殊操作，我们只可以使用适配器操作，而不能使用底层容器类型的操作。