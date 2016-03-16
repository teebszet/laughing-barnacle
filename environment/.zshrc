
# Lines configured by zsh-newuser-install
HISTFILE=~/.zshhistfile
HISTSIZE=1000000
SAVEHIST=1000000
setopt incappendhistory sharehistory histexpiredupsfirst histignoredups
setopt autocd notify

bindkey -e
# End of lines configured by zsh-newuser-install
# The following lines were added by compinstall
zstyle :compinstall filename '/home/tim/.zshrc'
zstyle ':completion:*' completer _complete _ignored _correct
zstyle ':completion:*' expand prefix suffix
zstyle ':completion:*' ignore-parents parent pwd ..
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}
zstyle ':completion:*' list-prompt %SAt %p: Hit TAB for more, or the character to insert%s
zstyle ':completion:*' list-suffixes true
zstyle ':completion:*' max-errors 1 numeric
zstyle ':completion:*' preserve-prefix '//[^/]##/'

bindkey "^[[A" history-search-backward
bindkey "^[[B" history-search-forward

autoload -Uz compinit
compinit
# End of lines added by compinstall

source /home/tim/ext_gits/zsh-git-prompt/zshrc.sh
# faster but not installed on my VM
#GIT_PROMPT_EXECUTABLE="haskell"

if  [ $USER = 'root' ]
then
    export prompt='%n@%m (%2~) > '
else
    export prompt='%m (%2~)%b$(git_super_status) > '
fi

setopt list_packed
setopt sh_word_split

# Environment
export EDITOR='vim'
export SVN_EDITOR='vim'
export PATH=$PATH:/sbin:/usr/sbin
export GREP_OPTIONS='--color=auto'
export GREP_COLOR='1;31'
RED="\[\033[0;31m\]"
PINK="\[\033[1;31m\]"
YELLOW="\[\033[1;33m\]"
GREEN="\[\033[0;32m\]"
LT_GREEN="\[\033[1;32m\]"
BLUE="\[\033[0;34m\]"
WHITE="\[\033[1;37m\]"
PURPLE="\[\033[1;35m\]"
CYAN="\[\033[1;36m\]"
BROWN="\[\033[0;33m\]"
COLOR_NONE="\[\033[0m\]"

alias ls="ls --color=always"
alias ll="ls -l -F --color=always"
alias ag='ack-grep'
alias wp='wigdo prove -v -r'
alias mel='ls ~/common/logs/apache/metrics-ui/error_log.*(om[1,1])'
alias ctagss="ctags --exclude='**/assets/**' -f ~/code/.git/tags -R ~/code/perl ~/code/bin ~/code/share/lokku.net/metrics/cgi"

alias ld_au="ssh -tv lokku@ld1 'code/ext/bin/mysql -u root --socket common/run/mysql-listings-db.sock au_realestate'"

alias tfa='tail -f ~/common/logs/apache/frontend/access_log.`date +%Y-%m-%d`*'
alias tfe='tail -f ~/common/logs/apache/frontend/error_log.`date +%Y-%m-%d`*'
alias tfsa='tail -f ~/common/logs/apache/frontend-static/access_log.`date +%Y-%m-%d`*'
alias tfse='tail -f ~/common/logs/apache/frontend-static/error_log.`date +%Y-%m-%d`*'
alias tsa='tail -f ~/common/logs/apache/search-api/access_log.`date +%Y-%m-%d`*'
alias tse='tail -f ~/common/logs/apache/search-api/error_log.`date +%Y-%m-%d`*'

# function parse_git_branch () {
#   git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
# }
# 
# setopt prompt_subst
# autoload -Uz vcs_info
# zstyle ':vcs_info:*' actionformats \
#         '%F{5}(%f%s%F{5})%F{3}-%F{5}[%F{2}%b%F{3}|%F{1}%a%F{5}]%f '
# zstyle ':vcs_info:*' formats       \
#         '%F{5}(%f%s%F{5})%F{3}-%F{5}[%F{2}%b%F{5}]%f '
# zstyle ':vcs_info:(sv[nk]|bzr):*' branchformat '%b%F{1}:%F{3}%r'
# zstyle ':vcs_info:*' enable git cvs svn
# # or use pre_cmd, see man zshcontrib
# vcs_info_wrapper() {
#   vcs_info
#   if [ -n "$vcs_info_msg_0_" ]; then
#     echo "%{$fg[grey]%}${vcs_info_msg_0_}%{$reset_color%}$del"
#   fi
# }
# RPROMPT=$'$(vcs_info_wrapper)'
# 
# precmd () { vcs_info }
# PROMPT='%F{5}[%F{2}%n%F{5}] %F{3}%3~ ${vcs_info_msg_0_} %f%# '

source /home/tim/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
