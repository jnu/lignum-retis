# Some utility functions

ROOT="lignum-retis"


# Colorize bash output
#
# Modified from http://www.tldp.org/LDP/abs/html/colorizing.html
#
# Provides cecho function
#
# $ cecho 'hello, in red!' $red
#
# Provides logging functions: info, interesting, good, warn, and error,
# which call cecho with predetermined colors


# ----------- Colors ------------ #

black=$'\e[30m'
red=$'\e[31m'
green=$'\e[32m'
yellow=$'\e[33m'
blue=$'\e[34m'
magenta=$'\e[35m'
cyan=$'\e[36m'
white=$'\e[37m'
reset=$'\e[0m'

clr_info=$cyan
clr_warn=$yellow
clr_error=$red
clr_good=$green
clr_interesting=$magenta

# ------------------------------- #

cecho () {
    local default_msg=""

    message=${1:-$default_msg}
    color=${2:-$white}

    echo -n "$color"
    echo "$message"
    echo -n "$reset"

    return
}


info () {
    cecho "$1" $clr_info
    return
}

warn () {
    cecho "$1" $clr_warn
    return
}

error () {
    cecho "$1" $clr_error
    return
}

good () {
    cecho "$1" $clr_good
    return
}

interesting () {
    cecho "$1" $clr_interesting
    return
}


# ------ HELPERS ------- #

findroot () {
    info "Navigating to root ..."
    # go up directory tree until root is found
    cwd=${PWD##*/}
    LAST=
    while [[ "$ROOT" -ne "$cwd" ]]; do
        LAST=$cwd
        cd ..
        cwd=${PWD##*/}

        if [[ "$LAST" -eq "$cwd" ]]; then
            error "Can't find root. Try running from root or script directory."
            exit 1
        fi
    done
    interesting "Working in $cwd"
}
