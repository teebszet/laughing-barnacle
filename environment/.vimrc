" Kousaka/Juban .vimrc

set nocompatible              " be iMproved, required
filetype off                  " required

" set the runtime path to include Vundle and initialize
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

" let Vundle manage Vundle, required
Plugin 'gmarik/Vundle.vim'
Plugin 'tpope/vim-fugitive'
Plugin 'https://github.com/kien/ctrlp.vim.git'
"Plugin 'scrooloose/syntastic'
Plugin 'tpope/vim-surround'
Plugin 'tpope/vim-commentary'
Plugin 'godlygeek/tabular'
Plugin 'ivalkeen/vim-ctrlp-tjump'
Plugin 'tpope/vim-repeat'
Plugin 'sjl/gundo.vim'

" node plugins
Plugin 'moll/vim-node'
Plugin 'pangloss/vim-javascript'
Plugin 'mxw/vim-jsx'

call vundle#end()

" General Settings
set tags=.git/tags;
set undolevels=1000
set undofile
set history=50
set shortmess=aIoO          " short messages, no splash screen
set showmode
set novisualbell
set noequalalways
set splitbelow
set path=$PWD
set laststatus=2

" Function Keys
" F2 - paste mode toggle
set pastetoggle=<F2>
" F7 - spellcheck toggle
nn <F7> :setlocal spell! spell?<CR>
" Ctrl-. - :CtrlPTag
let mapleader="\\"
nnoremap <leader>p :CtrlPTag<cr>
let g:ctrlp_clear_cache_on_exit=0
let g:ctrlp_custom_ignore = 'node_modules\|DS_Store'
nnoremap <F4> :GundoToggle<CR>

" Filename Autocomplete
set wildchar=<Tab>
set wildmode=longest,list   " bash-style autocompletion

" Search/Replace
set incsearch
set ignorecase
set smartcase

" syntax highlighting
syntax on
filetype on
filetype indent on
filetype plugin on

" encoding
set encoding=utf-8

" no stupid ~ files please
set nobackup

" display
set nowrap
set ruler

" tabs
set tabstop=4
set expandtab
set shiftwidth=4
set shiftround

"*
"* Language Specific
"*

" Perl
au FileType pl,pm,t,pod,cgi set filetype=perl
au FileType perl let g:perldoc_program='/usr/bin/perldoc'
au BufNewFile,BufRead *.pl,*.pm,*.t,*.cgi set filetype=perl
autocmd FileType perl call PerlMode()
function! PerlMode()            " Stolen from David Hand
    set autoindent              " ai:  indent to match previous line
    set cindent                 " cin:  Use C-indenting
    set cinkeys=0{,0},!^F,o,O,e " cink:  Perl-friendly reindent keys
    set cinoptions=t0,+4,(0,)60,u0,*100  " cino:  all sorts of options
    set cinwords=if,else,while,do,for,elsif,sub
    set comments=n:#            " com:  Perlish comments
    set nosmartindent           " nosi:  Smart indent useless when C-indent is on
    set showmatch               " show matches on parens, bracketc, etc.
    set iskeyword=@,48-57,_,192-255,:
    set commentstring=#%s
endfunction

au BufRead,BufNewFile *.js set filetype=javascript
autocmd FileType javascript call JsMode()
function! JsMode()
    set autoindent
    set tabstop=2
    set shiftwidth=2
endfunction

" Text
autocmd FileType text call TextMode()
function! TextMode()
    set nocindent               " nocin:  don't use C-indenting
    set nosmartindent           " nosi:  don't "smart" indent, either
    set autoindent              " ai:  indent to match previous line
    set noshowmatch             " nosm:  don't show matches on parens, brackets, etc.
    set comments=n:>,n:#,fn:-   " com: list of things to be treated as comments
endfunction

" Twiki
au BufNewFile,BufRead *.twiki setf twiki
autocmd FileType twiki call TwikiMode()
function! TwikiMode()
    set tabstop=3
    set expandtab
    set shiftwidth=3
    set shiftround
    set nowrap linebreak nolist
endfunction

" Markdown (DoneDone)
au BufRead,BufNewFile *.md set filetype=markdown
autocmd FileType markdown call MarkdownMode()
function! MarkdownMode()
    setlocal foldmethod=manual
endfunction

" CSS / Less CSS
au BufRead,BufNewFile *.css,*.less set filetype=css
