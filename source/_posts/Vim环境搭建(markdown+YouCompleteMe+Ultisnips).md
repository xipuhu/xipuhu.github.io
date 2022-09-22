---
title: Vim环境搭建(markdown+YouCompleteMe+Ultisnips)
categories: 工具使用
tags: [vim]
toc: true
---

### Vim+Markdown

#### 插件管理器: vim-plug

　　vim-plug([github](<https://github.com/junegunn/vim-plug> ))是一款适用于vim的插件管理器，具有安装简单，实用简单，多线程平行安装等等功能。 将vim-plug下载下来后，把其中的plug.vim文件复制到vim安装路径中的autoload文件夹(~/.vim/autoload/)中即可。

<!--more-->

　　vim-plug安装成功后我们就可以在.vimrc文件(~/.vimrc)中安装插件了：

```shell
call plug#begin('~/.vim/plugged') "Vim 插件的安装路径，可以自定义。
"~ 表示系统路径，在windows下为 C:/User/username/

Plug 'path/of-plugin'
Plug '...'
"将所有插件安装在这里

call plug#end()
```
　　配置完成以后，重启vim，在命令行模式下输入：
```shell
:PlugInstall     
```

##### 更新插件

　　要更新插件，请运行：

```shell
:PlugUpdate
```

##### 删除插件

　　删除一个插件：删除或注释掉你之前在vim配置文件中添加的plug命令。然后，运行`:source ~/.vimrc`或重启Vim编辑器。最后，运行一下命令卸载插件：

```shell
:PlugClean
```

##### 升级Vim-plug

　　要升级vim-plug本身，请输入：

```shell
:PlugUpgrade
```

#### Markdown插件安装及配置

##### vim-markdown

　　vim-markdown([github](<https://github.com/plasticboy/vim-markdown> ))是一个Markdown语法高亮插件，其提供了针对Markdown的`语法高亮`、`段落折叠`、`查看目录`、`段间跳转`等功能：  

　　**安装**：在.vimrc文件中添加如下内容，然后重启进入vim，在命令行模式下输入`PlugInstall`即可安装：  

```shell
call plug#begin('~/.vim/plugged')
Plug 'godlygeek/tabular' "必要插件，安装在vim-markdown前面
Plug 'plasticboy/vim-markdown'
...
call plug#end()
```
　　**相关配置选项**：同样接着上面的内容，按自己的需求添加相关的开关选项。
```shell
let g:tex_conceal = ""
let g:vim_markdown_math = 1
"To disable math conceal with LaTeX math syntax enabled.

let g:vim_markdown_folding_disabled = 1
"To disable the folding configuration/
```
##### vim-markdown-toc

 　　vim-markdown-toc([github](<https://github.com/mzlogin/vim-markdown-toc> ))是一个可以自动在`当前光标`处生成目录的插件。  

 　　**安装**： 安装方式和vim-markdown一样同样在.vimrc中添加插件地址,然后重启进入vim，在命令行模式下输入`PlugInstall`即可。

 ```shell
"vim-markdown-doc(自动生成目录)
Plug 'mzlogin/vim-markdown-toc'
 ```
　　**相关配置选项**
```shell
let g:vmt_auto_update_on_save = 0  
"This plugin will update existing table of contents on save automatic.
"You can close this feature by add the following line to your vimrc file.
```

##### markdown-preview.vim

 　　markdown-preview.vim([github](<https://github.com/iamcco/markdown-preview.vim> ))可以通过浏览器实时预览markdown文件，并可以借助浏览器的打印功能导出PDF文档，需要注意的是，如果想预览数学公式，我们还需要安装`mathjax-support-for-mkdp`。  

 　　**安装**

 ```shell
 "markdown-preview.vim(预览markdown效果)
 Plug 'iamcco/mathjax-support-for-mkdp'
 Plug 'iamcco/markdown-preview.vim'
 ```
　　**相关配置选项**
```shell
let g:mkdp_auto_start = 1
" Set to 1, Vim will open the preview window on entering the Markdown
 " buffer.

let g:mkdp_auto_close = 1
 " Set to 1, Vim will automatically close the current preview window when
 " switching from one Markdown buffer to another.

let g:mkdp_path_to_chrome = "/usr/bin/google-chrome-stable"
 " Path to the chrome or the command to open chrome (or other modern browsers).
 " If set, g:mkdp_browserfunc would be ignored.
```
##### 所有环境配置在.vimrc文件中的内容

```shell
call plug#begin('~/.vim/plugged') "Vim 插件的安装路径，可以自定义。

"在vim上配置markdown环境(begin)

"vim-markdown(markdown语法高亮)
Plug 'godlygeek/tabular' "必要插件，安装在vim-markdown前面
Plug 'plasticboy/vim-markdown'

let g:tex_conceal = ""
let g:vim_markdown_math = 1
"To disable math conceal with LaTeX math syntax enabled.

let g:vim_markdown_folding_disabled = 1
"to disable the folding configuration

"vim-markdown-doc(自动生成目录)
Plug 'mzlogin/vim-markdown-toc'

let g:vmt_auto_update_on_save = 0  
"This plugin will update existing table of contents on save automatic.
"You can close this feature by add the following line to your vimrc file.

"markdown-preview.vim(预览markdown效果)
Plug 'iamcco/mathjax-support-for-mkdp'
Plug 'iamcco/markdown-preview.vim'

let g:mkdp_auto_start = 1
" Set to 1, Vim will open the preview window on entering the Markdown
" buffer.

 let g:mkdp_auto_close = 1
 " Set to 1, Vim will automatically close the current preview window when
 " switching from one Markdown buffer to another.

 let g:mkdp_path_to_chrome = "/usr/bin/google-chrome-stable"
 " Path to the chrome or the command to open chrome (or other modern browsers).
 " If set, g:mkdp_browserfunc would be ignored.

 "在vim上配置markdown环境(end)
 call plug#end()
```

### Vim+代码补全
#### C/C++代码补全(YCM)
　　YCM([YouCompleteMe](https://github.com/ycm-core/YouCompleteMe))插件能让vim像那些IDE一样自动补全代码，跳转等等（主要是对C/C++语言而言），它先通过预先编译，根据编译的结果来推测需要补全的内容。在运行安装脚本之前，需要解决一些依赖问题，具体如下：  
* 确保vim版本在7.4.1578以上，通过`vim --version`来查看，注意ubuntu18默认是vim8.1。
* 确保vim对python和Python3的支持，也通过`vim --version`来查看，在python和Python3前面有加号，说明已经支持了。

##### 安装

　　同样可以通过vim-plug来进行YCM的安装，在.vimrc文件中添加YCM的在github上的源代码目录。

```shell
" 代码补全(C/c++)
Plug 'valloric/youcompleteme'
```
　　退出.vimrc文件后，运行vim，并在命令行模式下输入`PlugInstall`即可，与其他插件安装不同的是，YCM是一款编译型的插件，此时只是把YouCommpleteMe在github上的源码给下载了下来，我们还需手动进行一个编译安装，在终端中进入`~/.vim/plugged/youcompleteme/`，然后运行`./install.py --clang-completer`进行编译安装即可，注意，加上选项--clang-completer才能够对C/C++代码进补全。  

##### 配置

　　现在还不能够顺利通过YCM来进行代码补全，需要对其进行相应的配置后才能够达到代码补全的效果。首先我们需要在用户目录下新建文件".ycm_extra_conf.py"，复制以下代码文件（否则会出现“NoExtraConfDetected: No .ycm_extra_conf.py file detected”问题），在该文件中，主要是配置C/C++在系统中的相关include路径信息等：

```shell
import os
import ycm_core
 
flags = [
    '-Wall',
    '-Wextra',
    '-Werror',
    '-Wno-long-long',
    '-Wno-variadic-macros',
    '-fexceptions',
    '-DNDEBUG',
    '-std=c++11',
    '-x',
    'c++',
    '-I',
    '/usr/include',
    '-isystem',
    '/usr/lib/gcc/x86_64-linux-gnu/5/include',
    '-isystem',
    '/usr/include/x86_64-linux-gnu',
    '-isystem'
    '/usr/include/c++/5',
    '-isystem',
    '/usr/include/c++/5/bits'
  ]
 
SOURCE_EXTENSIONS = [ '.cpp', '.cxx', '.cc', '.c', ]
 
def FlagsForFile( filename, **kwargs ):
  return {
    'flags': flags,
    'do_cache': True
  }
```
　　在.vimrc文件中对其进行一个全局的YCM属性配置：
```shell
""""""""""""YouCompleteMe""""""""""""""""
"配置全局路径
let g:ycm_global_ycm_extra_conf = '~/.ycm_extra_conf.py' 
 
"每次直接加载该文件，不提示是否要加载     
let g:ycm_confirm_extra_conf=0 
  
"开启YCM
set runtimepath+=~/.vim/plugged/youcompleteme
let g:ycm_collect_identifiers_from_tags_files = 1  
         
"基于标签引擎
let g:ycm_collect_identifiers_from_comments_and_strings = 1 "

"注释与字符串中的内容也用于补全
let g:syntastic_ignore_files=[".*\.py$"]

"语法关键字补全
let g:ycm_seed_identifiers_with_syntax = 1                  
let g:ycm_complete_in_comments = 1
let g:ycm_confirm_extra_conf = 0

"按键映射
let g:ycm_key_list_select_completion = ['', '']  

"没有这个会拦截掉tab键，导致其他插件的tab不能用(尤其是Ultisnips)
let g:ycm_key_list_previous_completion = ['', '']

"在注释输入中也能补全
let g:ycm_complete_in_comments = 1   
 
"在字符串输入中也能补全              
let g:ycm_complete_in_strings = 1   

"注释和字符串中的文字也会被收入补全                    
let g:ycm_collect_identifiers_from_comments_and_strings = 1 

"禁用语法检查 
let g:ycm_show_diagnostics_ui = 0    

"回车即选中当前项                   
inoremap  pumvisible() ? "\" : "\" |  
   
"跳转到定义处
nnoremap  :YcmCompleter GoToDefinitionElseDeclaration| 
 
"从第2个输入字符就开始罗列匹配项
"let g:ycm_min_num_of_chars_for_completion=2 
                
"跳转快捷键
nnoremap <c-k> :YcmCompleter GoToDeclaration<CR>|
nnoremap <c-h> :YcmCompleter GoToDefinition<CR>| 
nnoremap <c-j> :YcmCompleter GoToDefinitionElseDeclaration<CR>|

""""""""""""YouCompleteMe""""""""""""""""
```
#### python代码补全
　　在python代码补全中，我们分别需要通过vim-plug来安装两个插件`pyflakes`和`jedi-vim`，前者用于语法检测，后者用于提示补全，这两个插件只需要安装即可，无需配置 。

##### 安装

　　在.vimrc文件中输入pyflakes和jedi-vim两个插件在github上的目录即可，然后重启进入vim，输入`PlugInstall`。  

```shell
"代码补全(python)
Plug 'PyCQA/pyflakes'
Plug 'davidhalter/jedi-vim
```
### Vim+代码片段管理(Ultisnips)
　Ultisnips([github](https://github.com/SirVer/ultisnips))是一个非常实用的vim插件，Snippets翻译为片段，在这里表示可被一段关键词触发并替换的一段短小的，可重复利用的文本块。  

##### 安装

　　Ultisnips插件安装分两部分，一个是Ultisnips插件本身，另一个是代码片段仓库（包含了所有语言的默认.snippets文件），同样可以通过vim-plug来进行安装，在.vimrc文件中添加如下内容。

```shell
"插件本身
Plug 'SirVer/ultisnips'
"代码片段仓库的git地址
Plug 'honza/vim-snippets
```
##### 选项配置

　　这里我们直接使用官网提供的默认配置选项，如果有需要可以自己修改。  

```shell
" Trigger configuration. Do not use <tab> if you use https://github.com/Valloric/YouCompleteMe.
" 快捷键设置（一般使用tab来触发代码片段补全）
let g:UltiSnipsExpandTrigger="<tab>"
let g:UltiSnipsJumpForwardTrigger="<c-b>"
let g:UltiSnipsJumpBackwardTrigger="<c-z>"

" If you want :UltiSnipsEdit to split your window.
let g:UltiSnipsEditSplit="vertical"
```
##### snippets文件

　　在使用vim-plug安装Ultisnips之后，可以在路径`~/.vim`下，新建一个`Ultisnips`文件夹用来存放本地的自定义`.snippets文件`，注意，Ultisnips插件默认安装在`~/.vim/plugged/ultisnips`中。在文件夹`~/.vim/UltiSnips/`中，创建一个文件名为`语言.snippets`的文件，这个语言即会在某个具体的语言生效。比如，需要创建一个用来补全C语言的文件，那文件名就是`c.snippets`，创建一个用来补全CPP的文件，那文件名就是`cpp.snippets`，创建一个用来补全markdow语言的文件，那文件名就是`markdown.snippets`。  
　　.snippets文件的语法规则：每一个展开规则都类似于如下的样式。

```shell
snippet 缩写 “描述” 设定
展开后的代码
endsnippet
```
　　例如，如果我想对#define进行缩写，想要达到的效果输入def，即可自动展开，那么，应该如下编写
```shell
snippets def "define" b
#define
endsnippet
```
　　设定的选项有介绍一下几种：  
* b——这个关键字表示，只有出现在行首的时候，才能被展开；
* A——表示自动展开；
* i——表示片段可在句中被触发。默认是只有在前面有多个空格或者在行首时才会被触发。   

##### 注意事项

如果出现Ultisnips失灵的情况，也就是按了tab键却没有进行代码展开，可以考虑以下两点：

* 是否和YCM中的tab键发生了冲突，导致无法使用；

* 有没有打开文件类型检测(并且在多个文件中没有重复打开该检测选项)：

  ```shell
  syntax on                    " 开启文件类型侦测
  filetype indent on           " 针对不同的文件类型采用不同的缩进格式
  filetype plugin on           " 针对不同的文件类型加载对应的插件
  filetype plugin indent on    " 启用自动补全
  ```

##### vimrc文件的所有内容

```shell
"""""""""""""""""""""""""""""""
"          插件安装            
"""""""""""""""""""""""""""""""
call plug#begin('~/.vim/plugged') "Vim 插件的安装路径，可以自定义。

" 代码补全(C/c++)
Plug 'valloric/youcompleteme'

" 代码补全(python)
Plug 'PyCQA/pyflakes'
Plug 'davidhalter/jedi-vim'

"""""""""在vim上配置markdown环境(begin)"""""""""
"vim-markdown(markdown语法高亮)
Plug 'godlygeek/tabular' "必要插件，安装在vim-markdown前面
Plug 'plasticboy/vim-markdown'

let g:tex_conceal = ""
let g:vim_markdown_math = 1
"To disable math conceal with LaTeX math syntax enabled.

let g:vim_markdown_folding_disabled = 1
"to disable the folding configuration

"vim-markdown-doc(自动生成目录)
Plug 'mzlogin/vim-markdown-toc'

let g:vmt_auto_update_on_save = 0  
"This plugin will update existing table of contents on save automatic.
"You can close this feature by add the following line to your vimrc file.

"markdown-preview.vim(预览markdown效果)
Plug 'iamcco/mathjax-support-for-mkdp'
Plug 'iamcco/markdown-preview.vim'

let g:mkdp_auto_start = 1
" Set to 1, Vim will open the preview window on entering the Markdown
 " buffer.

let g:mkdp_auto_close = 1
" Set to 1, Vim will automatically close the current preview window when
" switching from one Markdown buffer to another.

let g:mkdp_path_to_chrome = "/usr/bin/google-chrome-stable"
" Path to the chrome or the command to open chrome (or other modern browsers).
" If set, g:mkdp_browserfunc would be ignored.
"""""""""在vim上配置markdown环境(end)"""""""""

"""""""""""""""""Ultisnips"""""""""""""""""

Plug 'SirVer/ultisnips'
Plug 'honza/vim-snippets'

" Trigger configuration. Do not use <tab> if you use https://github.com/Valloric/YouCompleteMe.
let g:UltiSnipsExpandTrigger="<tab>"

let g:UltiSnipsJumpForwardTrigger="<c-b>"

let g:UltiSnipsJumpBackwardTrigger="<c-z>"

" If you want :UltiSnipsEdit to split your window.
let g:UltiSnipsEditSplit="vertical"

"""""""""""""""""Ultisnips"""""""""""""""""

call plug#end()


"""""""""""""""""""""""""""""""
"       插件属性配置           
"""""""""""""""""""""""""""""""

""""""""""""YouCompleteMe""""""""""""""""
"配置全局路径
let g:ycm_global_ycm_extra_conf = '~/.ycm_extra_conf.py' 
 
"每次直接加载该文件，不提示是否要加载     
let g:ycm_confirm_extra_conf=0 
  
" 开启 YCM
set runtimepath+=~/.vim/pluged/youcompleteme
let g:ycm_collect_identifiers_from_tags_files = 1  
         
"基于标签引擎
let g:ycm_collect_identifiers_from_comments_and_strings = 1 "

"注释与字符串中的内容也用于补全
let g:syntastic_ignore_files=[".*\.py$"]

"语法关键字补全
let g:ycm_seed_identifiers_with_syntax = 1                  
let g:ycm_complete_in_comments = 1
let g:ycm_confirm_extra_conf = 0

"映射按键,
let g:ycm_key_list_select_completion = ['', '']  

"没有这个会拦截掉tab, 导致其他插件的tab不能用.
let g:ycm_key_list_previous_completion = ['', '']

" 在注释输入中也能补全
let g:ycm_complete_in_comments = 1   
 
"在字符串输入中也能补全                      
let g:ycm_complete_in_strings = 1   

"注释和字符串中的文字也会被收入补全                        
let g:ycm_collect_identifiers_from_comments_and_strings = 1 

"禁用语法检查
let g:ycm_show_diagnostics_ui = 0    

"回车即选中当前项                      
inoremap  pumvisible() ? "\" : "\" |  
   
"跳转到定义处      
nnoremap  :YcmCompleter GoToDefinitionElseDeclaration| 
 
"从第1个键入字符就开始罗列匹配项   
"let g:ycm_min_num_of_chars_for_completion=1 
                
"跳转快捷键
nnoremap <c-k> :YcmCompleter GoToDeclaration<CR>|
nnoremap <c-h> :YcmCompleter GoToDefinition<CR>| 
nnoremap <c-j> :YcmCompleter GoToDefinitionElseDeclaration<CR>|

""""""""""""YouCompleteMe""""""""""""""""

"""""""""""""""""""""""""""""""
"       基本属性配置           
"""""""""""""""""""""""""""""""
"自动语法高亮
syntax enable
"syntax on 

"支持256色，使得vim配色支持终端
set t_Co=256

"英文字体
set guifont=Consolas:h12:cANSI 
set guifontwide=SimSun-ExtB:h12:cGB2312

"表示Tab代表4个空格的宽度
set tabstop=4 

"表示Tab自动转换成空格
set expandtab 

"表示换行后自动缩进
set autoindent 

"当文件仔外部被修改时，自动重新读取
set autoread 

"vim记住的历史操作的数量，默认时20
set history=400 

"使用vim自己的键盘模式，而不是兼容vi的模式
set nocompatible 

"处理未保存或者只读文件时，给出提示
set confirm 

"智能对齐
set smartindent 

"统一缩进为4 
set softtabstop=4 
set shiftwidth=4 

"设定默认解码 
set fenc=utf-8 
set fencs=utf-8,usc-bom,euc-jp,gb18030,gbk,gb2312,cp936

"Ctrl+A全选，Ctrl+C复制，Ctrl+V粘贴
map <C-A> ggvG$ 
imap <C-A> <Esc>ggvG$
vmap <C-C> "+y<Esc>
map <C-V> "+p
imap <C-V> <Esc>"+pa

" 括号等的自动匹配
inoremap ( ()<Esc>i
inoremap [ []<Esc>i
inoremap { {}<Esc>i
inoremap ' ''<Esc>i
inoremap " ""<Esc>i

" 在状态行上显示光标所在位置的行号和列号 
set ruler

"显示行号
set number 

"可以折叠 
set foldenable 
set foldmethod=manual

"开启文件类型侦测
syntax on     
               
filetype indent on           " 针对不同的文件类型采用不同的缩进格式
filetype plugin on           " 针对不同的文件类型加载对应的插件
filetype plugin indent on    " 启用自动补全

"在窗口中允许使用鼠标进行操作
set mouse=a

"补全文件名,按钮映射
inoremap <C-F> <C-X><C-F> 
"补全宏定义,按钮映射
inoremap <C-D> <C-X><C-D> 
"整行补全,按钮映射
inoremap <C-L> <C-X><C-L>  
autocmd InsertEnter * let save_cwd = getcwd() | set autochdir
autocmd InsertLeave * set noautochdir | execute 'cd' fnameescape(save_cwd)
```

##### 参考

- <https://zhuanlan.zhihu.com/p/84773275> 

- <https://www.cnblogs.com/wAther/p/10444045.html> 

- https://www.cnblogs.com/schips/p/10766599.html

- https://blog.csdn.net/keeliizhou/article/details/82260498

- https://www.v2ex.com/t/484050

- https://www.cnblogs.com/sench/p/vim.html
- <https://blog.easwy.com/archives/advanced-vim-skills-auto-complete/> 
- https://zhuanlan.zhihu.com/p/26156186

