---
title: IO库
categories: [读书笔记,C++ Primer]
tags: [IO库]
toc: true
---

### IO类

　　C++语言不直接处理出入输出，而是通过一族定义在标准库中的类型来处理IO。这些类型支持从设备读取数据、向设备写入数据的IO操作，设备可以是**文件** 、**控制台窗口** 等。还有一些类型允许**内存IO** ，即从string读取数据，向string写入数据。常见IO库设施如下：

<!--more-->

- istream（输入流）类型，提供输入操作。
- ostream（输出流）类型，提供输出操作。
- cin，一个istream对象，从标准输入**读取** 数据。
- cout，一个ostream对象，想标准输出**写入** 数据。
- cerr， 一个ostream对象，通常用于输出程序错误信息，**写入** 到标注错误。
- \> > 运算符，用来从一个istream对象**读取输入数据** 。
- < < 运算符，用来从一个ostream对象**写入输出数据** 。
- getline函数，从一个给定的istream读取一行数据存入一个给定的string对象中（遇到换行符结束）。

　　**IO库类型的头文件：**
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/IO%E5%BA%93/01.png" width=60% height=60%>

　　**IO类型间的关系：**
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/IO%E5%BA%93/02.png" width=60% height=60%>

　　**1、IO对象无拷贝或赋值：**

```
// 我们不能拷贝或对IO对象赋值
ofstream out1,out2;
out1 = out2;                    //错误：不能对流对象赋值
ofstream print(ofstream);       //错误：不能初始化ofsteram参数
out2 = print(out2);             //错误：不能拷贝流对象
```

　　由于不能拷贝IO对象，因此我们也不能将形参或返回类型设置为流类型。进行IO操作的函数通常以引用方式传递和返回流。读写一个IO对象会改变其状态，因此传递和返回的引用不能是const的。
　　**2、IO库条件状态：** IO操作的一个与生俱来的问题是可能发生错误，一些错误是可恢复的，而其他错误则发生在系统深处，已经超出了应用程序可以修正的范围。因此，IO类定义了一些函数和标志，可以帮助我们访问和操纵流的条件状态。

<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/IO%E5%BA%93/03.png" width=60% height=60%>
　　

**注意：** 一个流一旦发生错误，其上后续的IO操作都会失败。
　　确定一个流对象的状态的最简单的方法是将它作为一个条件来使用：

```
while(cin>>word){
  // ok：读操作成功....
}
```

　　**查询流的状态：** 将流作为条件使用，只能告诉我们流是否有效，而无法告诉我们具体发生了什么。IO库定义了一个`iostate` 类型，它提供了表达流状态的完整功能。这个类型应作为一个位集合来使用，即通过位运算来使用。IO库定义了4个iostate类型的`constexpr` 值，表示特定的位模式。这些值用来表示特定类型的IO条件，可以与位运算符一起使用来一次性检测或设置多个标志位。
　　**管理条件状态：** 流对象的`rdstate` 成员返回一个`iostate` 值（读取当前条件状态），对应流的当前状态。`setstate` 操作将`给定条件位`置位，表示发生了对应错误。clear成员是一个重载的成员，它有一个不接受参数的版本（复位所有错误标志位），而另一个版本接受一个iostate类型的参数。

```
// 机主cin的当前状态
auto old_state = cin.rdstate();       //记住cin的当前状态
cin.clear();                          //使cin有效
process_input(cin);                    //使用cin
cin,setstate(old_state);               //将cin置为原有状态

//复位failbit和badbit，保持其他标志位不变
cin.clear(cin.rdstate() & ~cin.failbit & ~cin.badbit);
```

　　**3、管理输出缓冲：** 每个`输出流` 都管理一个`缓冲区` ，用来保存程序读写的数据。导致缓冲刷新（即数据真正写到输出设备或文件）的原因有很多：

- 程序正常结束，作为main函数的return操作的一部分，缓冲刷新被执行。
- 缓冲区满时，需要刷新缓冲，而后新的数据才能继续写入缓冲区。
- 我们可以使用`操纵符endl、flush、ends` 来显示刷新缓冲区。
- 在每个输出操作之后，我们可以用`操纵符unitbuf` 设置流的内部状态，来清空缓冲区。默认情况下，对cerr是设置unitbuf的，因此写到cerr的内容都是立即刷新的。
- 一个输出流可能被`关联` 到另一个流。在这种情况下，当读写被关联的流时，关联到的流的缓冲区会被刷新。默认情况下，cin和cerr都被关联到cout，因此读cin或写cerr都会导致cout的缓冲区被刷新。

　　**刷新输出缓冲区：** 除了常见的endl外，IO库还有两个类似的操纵符：`flush` 和`ends` 。flush刷新缓冲区，但不输出任何额外的字符；ends向缓冲区插入一个空字符，然后刷新缓冲区：

```
cout<<"hi!"<<endl;      //输出hi和一个换行，然后刷新缓冲区
cout<<"hi!"<<flush;     //输出hi不附加任何额外字符，然后刷新缓冲区
cout<<"hi!"<<ends;      //输出hi和一个空字符，然后刷新缓冲区
```

　　**unitbuf操纵符：** 如果想在每次输出操作后都刷新缓冲区，我们可以使用unitbuf操纵符。它告诉流在接下来的每次写操作之后都进行一次`flush` 操作。而`nounitbuf` 操纵符则重置流，是其恢复使用正常的系统管理的缓冲区刷新机制：

```
cout<<unitbuf;                // 所有输出操作后会立即刷新缓冲区
// 任何输出都立即刷新，无缓冲
cout<<nounitbuf;              // 回到正常的缓冲方式
```

　　**警告：** 如果程序崩溃，输出缓冲区是不会被刷新的。
　　**关联输入和输出流：** 当一个输入流被关联到一个输出流时，任何试图从`输入流` 读取数据的操作都会先刷新关联的`输出流` 。标准库将cout和cin关联在一起，因此语句cin> > ival; ，将会导致cout的缓冲区被刷新。交互式系统通常应该关联输入流和输出流。这意味着所有输出，包括用户提示信息，都会在读操作之前被打印出来。
　　用于关联流的函数主要是`tie函数` ，tie有两个重载的版本：**一个版本不带参数，返回指向输出流的指针** ，如果本对象当前关联到一个输出流，则返回的就是指向这个流的指针，如果未关联到流，则返回空指针；**tie的第二个版本接受一个指向ostream的指针，将自己关联到此ostream，即x.tie(& o)将流关联到输出流o。
　　我们既可以将一个`istream` 对象关联到另一个`ostream` ，也可以将一个`ostream`关联到另一个`ostream`：

```
cin.tie(&cout)     //仅仅是用来展示：标准库cin和cout关联在一起
//old_tie指向当前关联到cin的流（如果有的话）
ostream *old_tie = cin.tie(nullptr);     //cin不再与其他流关联
//将cin与cerr关联；这不是一个好主意，因为cin应该关联到cout
cin.tie(&cerr);            //读取cin会刷新cerr而不是cout
cin.tie(old_tie);           //重建cin和cout间的正常关联
```

　　**注意：** 每个流同时最多关联到一个流，但多个流可以同时关联到同一个ostream。

### 文件输入输出

　　**1、fstream：** 除了继承自iostream类型的行为之外，fstream中定义的类型还增加了一些新的成员来管理与流关联的文件：
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/IO%E5%BA%93/04.png" width=60% height=60%>

　　**2、使用文件流对象：** 如果我们定义了一个空文件流对象，可以随后调用open来将它与文件关联起来：

```
ifstream in(ifile);     //构筑一个ifstream并打开给定文件
ofstream out;           //输出文件流未与任何文件相关联
out.open(ifile + ".copy");     //打开指定文件

//如果调用open失败，failbit会被置位。
//因为调用open可能失败，进行open是否成功的检测通常是一个好习惯
if(out)    //检查open是否成功
           //open成功，我们可以使用文件了
```

　　一旦一个文件流已经打开，它就保持与对应文件的关联。实际上，对一个已经打开的文件流调用open会失败，并且会导致failbit被置位，随后的试图使用文件流的操作都会失败。为了将文件流关联到另外一个文件，必须首先关闭已经关联的文件：

```
in.close();            //关闭文件
in.open(ifile+"2");    //打开另一个文件
```

　　**注意：** 当一个fstream对象被销毁时，close会自动被调用。
　　**3、文件模式：** 每个流都有一个关联的文件模式，用来指出如何使用文件。
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/IO%E5%BA%93/05.png" width=60% height=60%>

　　指定文件模式有如下限制：

- 只可以对ofstream或fstream对象设定`out`模式。
- 只可以对ifstream或fstream对象设定`in`模式。
- 只有当`out`也被设定时才可设定`trunc` 模式。
- 只要`trunc` 没被设定，就可以设定`app`模式。在`app` 模式下，即使没有显示指定`out` 模式，文件也总是以输出方式被打开。
- 默认情况下，即使我们没有指定`trunc` ，以`out` 模式打开的文件也会被截断。为了保留以`out` 模式打开的文件的内容，我们必须同时指定`app` 模式，这样只会将数据追加写到文件末尾；或者同时指定`in` 模式，即打开文件同时进行读写操作。
- `ate`和`binary` 模式可用于任何类型的文件流对象，且可以与其他任何文件模式组合使用。

　　**注意：** 每个文件流类型都定义了一个默认的文件模式，当我们未指定文件模式时，就使用此默认模式。与ifstream关联的文件默认以in模式打开；与ofstream关联的文件默认以out模式打开；与fstream关联的文件默认以in和out模式打开。

### string 流

　　**1、sstream：** 除了自iostream继承得来的的操作，sstream中定义的类型还增加了一些成员来管理与流相关联的string。
<img src="https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/IO%E5%BA%93/06.png" width=60% height=60%>

　　**2、使用istringstream:** 当我们的某些工作是对**整行文本** 进行处理，而其他一些工作是处理**行内的单个单词** 时，通常可以使用istringstream:

```
//假如要处理如下数据，个人信息（名字，手机号码）
morgan 2015552368 8625550123
drew 9735550130
lee 6095550132 2015550175 8005550000

struct Personlnfo {
string name;
vector <string> phones;
}

string line, word ; 			// 分别保存未自输入的一行和单饲
vector <PersonInfo> people ; 	// 保存来自输入的所有记录
// 运行从输入读取数据， 直至cin遇到文件尾(或其他错误)
while (getline(cin , line )){
	PersonInfoinfo; 			// 创建一个保存此记录数据的对象
	istringstream record(line) ; // 将记录绑定到刚读入的行
	record >> info.name ; 		// 读取名字
	while (record >> word) 		// 读取电话号码
		info.phones . push_back(word); // 保持它们
	people.push_back(info); 	// 将此记录追加到pe o ple 末尾
}
```

　　**3、使用ostringstream:** 当我们**逐步构造输出** ，希望**最后一起打印** 时，ostringstream是很有用的。比如，对上述的例子，我们可能想要逐个验证电话号码并改变其格式。如果所有号码都是有效的，我们希望输出一个新的文件，包含改变格式后的号码。对于那些无效的号码，我们不会将它们输出到新文件中，而是打印一条包含人名和无效号码的错误信息。

```
for(const auto &entry : people){    //对people中每一项
  ostringstream formatted,badNums;  //每个循环创建的对象
  for(const auto &nums : entry.phone){
    if(!valid(nums)){
      badNums<<" "<<nums;           //将数的字符串形式存入badNums
    }
    else{
       //将格式化的字符串“写入”formatted
      formatted<<" "<<format(nums);
    }
  }
  if(badNums.str().empty())          //没有错误的数
    os<<entry.name<<" "<<formatted.str()<<endl;
  else                               //否者，打印名字和错误的数
    cerr<<"input error"<<entry.name
    <<"incalid numbers"<<badNum.str()<<endl;
}
```