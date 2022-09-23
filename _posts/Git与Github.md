---
title: Git与Github
categories: 工具使用
tags: [git,github]
mathjax: true
toc: true
---

### Git与GitHub的来历

　　Linux 之父 Linus 在 1991 年创建开源的 Linux 操作系统之后，多年来依靠全世界广大热心志愿者的共同建设，经过长足发展，现已成为世界上最大的服务器系统。系统创建之初，代码贡献者将源码文件发送给 Linus，由其手动合并。这种方式维持多年后，代码量已经庞大到人工合并难以为继，于是深恶集中式版本控制系统的 Linus 选择了一个分布式商业版本控制系统 BitKeeper，不过 Linux 社区的建设者们可以免费使用它。BitKeeper 改变了 Linus 对版本控制的认识，同时 Linus 发现 BitKeeper 有一些不足，而且有个关键性的问题使之不能被广泛使用，就是不开源。

<!--more-->

　　在 2005 年，BitKeeper 所在公司发现 Linux 社区有人企图破解它，BitKeeper 决定收回 Linux 社区的免费使用权。Linus 对此事调节数周无果，找遍了当时已知的各种版本控制系统，没有一个看上眼的，一怒之下决定自己搞一个。Linus 花了十天时间用 C 语言写好了一个开源的版本控制系统，就是著名的 Git。

　　2007 年旧金山三个年轻人觉得 Git 是个好东西，就搞了一个公司名字叫 GitHub，第二年上线了使用 Ruby 编写的同名网站 GitHub，这是一个基于 Git 的免费代码托管网站（有付费服务）。十年间，该网站迅速蹿红，击败了实力雄厚的 Google Code，成为全世界最受欢迎的代码托管网站。2018 年 6 月，GitHub 被财大气粗的 Microsoft 收购。2019 年 1 月 GitHub 宣布用户可以免费创建私有仓库。根据 2018 年 10 月的 GitHub 年度报告显示，目前有 3100 万开发者创建了 9600 万个项目仓库，有 210 万企业入驻。

### Git基础操作

#### Git仓库的三大区域

　　Git 本地仓库有三大区域：<span class="blockFont">工作区</span>、<span class="blockFont">暂存区</span>、<span class="blockFont">版本区</span>。这是一个概念，有这个了解即可，随着使用 Git 的时间增多，慢慢就会理解这三个区域的作用以及为何要这么设计，学习阶段只需按照文档逐步操作即可。

![](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Git%E4%B8%8EGitHub/01.jpg)

#### 一次完整的修改、提交、推送操作

##### 查看整个仓库的状态

　　进入仓库主目录，执行<span class="blockFont">git status</span>，即可查看仓库的状态。

##### 添加修改到暂存区以及撤销修改

　　使用<span class="blockFont">git add [file name]</span>命令跟踪新建文件，即把新增文件添加到暂存区，以备提交。

　　如果对多个文件或目录进行了增删改，可以使用<span class="blockFont">git add .</span>命令全部添加到暂存区。注意这里有个概念，当我们修改了工作区，git add 命令是将这些修改添加到暂存区，暂存区记录的只是修改。如果要撤销暂存区的修改怎么办？执行 <span class="blockFont">git reset -- [file name] </span>或者 <span class="blockFont">git rm --cached [file name] </span>命令即可。

　　查看暂存区的全部修改，可以使用<span class="blockFont">git diff --cached</span>命令。

##### 查看提交历史

　　接下来，将执行<span class="blockFont">git commit</span>命令把暂存区的修改提交到版本区，生成一个新的版本，在此之前，先介绍另一个命令<span class="blockFont">git log</span>，它用来查看版本区的提交历史记录，关于查看提交版本历史记录的命令，有些常用的选项介绍下：

* `git log [分支名]` 查看某分支的提交历史，不写分支名查看当前所在分支
* `git log --oneline` 一行显示提交历史
* `git log -n` 其中n是数字，查看最近n个提交
* `git log -- author [贡献者名字]` 查看指定贡献者的提交记录
* `git log --graph` 图示法显示提交历史

##### 配置个人信息

　　接下来需要对Git进行一些本地配置：

* `user.email`：写入你自己注册GitHub账号的邮箱
* `user.name`： 你自己的GitHub账号名字

　　这两个命令设置你的身份信息，<span class="blockFont">git config -l</span>可以查看配置信息：

```c++
$ git config --global user.email "your email"
$ git config --global user.name "your name"
$ git config -l
```

　　完成后，系统自动生成Git的配置文件<span class="blockFont">.gitconfig</span>

##### 提交暂存区的修改

　　现在执行<span class="blockFont">git commit</span>命令生成一个新的提交，一个必须的选项<span class="blockFont">-m</span>用来提供提交的备注：

```c++
$ git commit -m "information of remark"
```

　　提交后，暂存区的修改被清空，执行<span class="blockFont">git log </span>查看提交记录即可，会显示这次操作的提交版本号，这个信息十分重要。

　　最后一个环节，将本地新增的提交推送到GitHub远程仓库中，命令是<span class="blockFont">git push</span>，后面不需要任何选项和参数，此命令会把本地仓库master分支上的新增提交推送到远程仓库的同名分支上。

#### 版本退回

　　如果发现所提交的文件内容有误，怎么做？可以修改此文件然后再次添加到暂存区、提交、推送，也可以撤销最近的一次提交，修改文件后重新提交推送。现在使用后一种方法来演示撤销提交的操作流程：

　　首先执行<span class="blockFont">git reset --soft HEAD^</span> 撤销最近的一次提交，将修改还原到暂存区， `--sift` 表示软退回，对应的还有`--hard` 硬退回，`HEAD^` 表示撤销一次提交，`HEAD^^` 表示撤销两次提交。软退回一个提交后，执行<span class="blockFont">git branch -avv</span>命令查看分支信息。再次修改文件后，执行`git add .`命令将新的修改添加到暂存区，然后执行`git commit`命令生成新的提交。

　　**注意：** `git status` 和`git branch -avv` 这两个命令使用的会非常频繁。 

### Git分支操作

#### 为Git命令设置别名

　　有一些命令的重复度极高，比如<span class="blockFont">git status</span> 和<span class="blockFont">git branch -avv</span>等，Git 可以对这些命令设置别名，以便简化对它们的使用，设置别名的命令是 <span class="blockFont">git config --global alias.\[别名\]\[原命令\]</span>，如果原命令中有选项，需要加引号。别名是自定义的，可以随意命名，设置后，原命令和别名具有同等作用。操作如下:

```c++
$ git config --global alias.st status 
$ git config --global alias.br "branch -avv"
$ git config --global alias.com "commit -m"
```

　　自己设置的别名要记住，也可以使用`git config -l`命令查看配置文件。

#### Git分支管理

##### git fetch刷新本地分支信息

　　在介绍分支之前，先讲解另一个命令 `git fetch`，它的作用是将远程仓库的分支信息拉取到本地仓库，注意，仅仅是更新了本地的远程分支信息，也就是执行 `git branch -avv`  命令时，查看到的 remotes 开头的行的分支信息。fetch 命令的作用是刷新保存在本地仓库的远程分支信息，此命令需要联网。此时若想使本地 master 分支的提交版本为最新，可以执行` git pull`  命令来拉取远程分支到本地，pull 是拉取远程仓库的数据到本地，需要联网，而由于前面执行过 git fetch 命令，所以也可以执行 `git rebase origin/master`  命令来实现 “使本地 master 分支基于远程仓库的 master 分支”。

##### 建立新的本地分支

　　分支在项目开发中作用重大，多人协作时尤其不可或缺。例如一个项目上线了 1.0 版本，研发部门需要开发 1.1、1.2 两个测试版，增加不同的新功能，测试版的代码显然不能在正式版所在的分支上，此时需要新的分支来存放不同版次的代码。

　　首先，克隆远程仓库到本地，进入仓库主目录，执行 `git br` 查看分支信息（注意git br是前面对命令`git branch -avv` 的修改别名）

　　执行`git brach [分支名]` 可以创建新的分支：

```c++
$ git brach dev
$ git br
```

　　此命令创建新分支后并未切换到新分支，还是在 master 分支上，执行 `git checkout [分支名]`  切换分支，checkout 也是常用命令，先给它设置别名，然后切换分支：

```c++
$ git config --glboal alias.ch checkout
$ git ch dev  // 切换到分支'dev'
```

　　创建新分支还要手动切换太麻烦，介绍另一个常用的命令 `git checkout -b [分支名]`  创建分支并切换到新分支：

```c++
$ git ch -b dev1 //切换到一个新分支'dev1'
```

##### 将新分支中的提交推送至远程仓库

　　执行 `git push [主机名][本地分支名]:[远程分支名]`  即可将本地分支推送到远程仓库的分支中，通常冒号前后的分支名是相同的，如果是相同的，可以省略 :[远程分支名]，如果远程分支不存在，会自动创建：

```c++
$ git push origin dev1:dev1  // 也可以简写为git push origin dev1
```

##### 本地分支跟踪远程分支

　　现在有个问题，当我们再次在 `dev1`  分支上修改并提交，推送到远程仓库时还是要输入上面的那个长长的命令，好不方便。如果能和 master 分支一样跟踪远程同名分支，就可以直接使用 git push 命令推送了。有办法的，执行这个命令 `git branch -u [主机名/远程分支名][本地分支名] ` 将本地分支与远程分支关联，或者说使本地分支跟踪远程分支。如果是设置当前所在分支跟踪远程分支，最后一个参数本地分支名可以省略不写：

```c++
$ git branch -u origin/dev1
```

##### 删除远程分支

　　接下来，介绍一下删除分支的方法。

　　首先，删除远程分支，使用 `git push [主机名] :[远程分支名]`  ，如果一次性删除多个，可以这样：`git push [主机名] :[远程分支名] :[远程分支名] :[远程分支名] ` 。此命令的原理是将空分支推送到远程分支，结果自然就是远程分支被删除。另一个删除远程分支的命令：`git push [主机名] --delete [远程分支名]` 。删除远程分支的命令可以在任意本地分支中执行。两个命令分别试一下：

```c++
$ git push origin :dev
$ git push origin --delete dev1
```

##### 本地分支的更名与删除

　　使用 `git branch -D [分支名]`  删除本地分支，同样地，此命令也可以一次删除多个，将需要删除的分支名罗列在命令后面即可。在此之前，先介绍一个极少用到的命令：给本地分支改名 `git branch -m [原分支名][新分支名]`  ，若修改当前所在分支的名字，原分支名可以省略不写:

```c++
$ git branch -m ved
```

　　现在要一次性删除本地分支 `ved` 和 `dev1` 。需要注意的一点：当前所在的分支不能被删除。切换到 master 分支，然后执行` git branch -D ved dev1 ` 命令：

```c++
$ git ch master //切换到分支"master"
$ git branch -D ved dev1 //删除分支ved和dev1
```

### Git常用命令速查表

![](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Git%E4%B8%8EGitHub/02.jpg)

### github的一些实用技巧

#### awesome的使用

　　在github上面专门有一些人整理了相关领域的最新发展现状，一般都以awesome来命名该仓库，我们在搜索的时候在关键词前面加上`awesome` 即可将这些内容搜索出来，比如，我想了解`目标检测` 的最新发展：

![](https://hexo-blog-1258021165.cos.ap-guangzhou.myqcloud.com/Git%E4%B8%8EGitHub/03.png)


参考：https://www.shiyanlou.com/courses/1035