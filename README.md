# Gaiman Engine and Programming Language

![Gaiman: Text based advanture games engine and programming language](https://raw.githubusercontent.com/jcubic/gaiman/master/assets/banner.svg)

[![npm](https://img.shields.io/badge/npm-1.0.0%E2%80%93beta.2-blue.svg)](https://www.npmjs.com/package/gaiman)
[![Build and test](https://github.com/jcubic/gaiman/actions/workflows/build.yaml/badge.svg)](https://github.com/jcubic/gaiman/actions/workflows/build.yaml)
[![Coverage Status](https://coveralls.io/repos/github/jcubic/gaiman/badge.svg?branch=master)](https://coveralls.io/github/jcubic/gaiman?branch=master)
[![LICENSE GPLv3](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://github.com/jcubic/gaiman/blob/master/LICENSE)

[Gaiman: Storytelling Text Based Game Engine and Programming Language](https://github.com/jcubic/gaiman)

Main part of Gaiman is a minimalist programming language and main purpose is to help create
[Text Adventure Games](https://en.wikipedia.org/wiki/Interactive_fiction). But it can also be used
to create any interactive CLI applications (Web Based Terminal applications).
It support browser based CLI applications and in the future also native command line.

## Installation

```
npm install -g gaiman@beta
```

## Usage

```
gaiman -o directory input.gs
```

This will compile your source file and generate `dir/index.html` and `dir/index.js` files.
And you can open generated html file in browser and run the game.

## Documentation

See [Reference Manual on Wiki](https://github.com/jcubic/gaiman/wiki/Reference-Manual).

## Examples

This is Hello world Gaiman DSL example:

```ruby
echo get "https://gaiman.js.org/gaiman.txt"
echo* "Hi, What is your name?", 50 # Typing animation with 50ms delay
let name = ask "name? "
echo "Hello $name, nice to meet you."
```

More advanced example:

```ruby
if cookie.visited then
    if cookie.user then
        let user = cookie.user
        echo "Hello $user, welcome back"
    else
        ask_details("Welcome back strager")
    end
else
    cookie.visited = true
    ask_details("Welcome stranger")
end

def ask_details(msg)
    echo msg
    echo "Do you want me to contact you with updates?"
    let confirm = ask "yes/no: ", lambda(answer)
        return answer =~ /^(y|yes|n|no)$/i
    end
    if confirm =~ /y|yes/i then
        echo "what is your name?"
        let name = ask "name: ", lambda(name)
            let valid = name != ""
            if not valid then
                echo "You need to type something"
            end
            return valid
        end
        cookie.user = name
        let email = ask "email: ", lambda(email)
            let valid = email =~ /^.+@.+\..+$/
            if not valid then
                echo "wrong email"
            end
            return valid
        end
        cookie.email = email
        let response = post "/register", { "name" => name, "email" => email }
        if response then
            echo "Welcome $user. You're successfully registered"
        end
    else
        echo "Ok, as you wish. Bye"
    end
end
```

More examples in [examples directory](https://github.com/jcubic/gaiman/tree/master/examples)

See [Reference Manual](https://github.com/jcubic/gaiman/wiki/Reference-Manual) for details about the features

## Live Demo

See [Gaiman language Playground](https://gaiman.js.org/)

Live Edit of Gaiman Code:
![Gaiman programming language Playground Demo Session](https://github.com/jcubic/gaiman/blob/master/assets/edit.gif?raw=true)

Live edit of style
![Gaiman programming language Playground Demo Session](https://github.com/jcubic/gaiman/blob/master/assets/simple.gif?raw=true)

## Roadmap

See Wiki [TODO & Roadmap](https://github.com/jcubic/gaiman/wiki/TODO-&-Roadmap).

## Name and Origin

Name came from [Neil Gaiman](https://en.wikipedia.org/wiki/Neil_Gaiman),
Author of novels, comic books, graphic novels and films. Great storyteller.

You can read about the origin of the language in the beginning of the article:
* [How to create programming language that compiles to JavaScript](https://hackernoon.com/creating-your-own-javascript-based-programming-language-has-never-been-easier-wju33by)

## Acknowledge

Logo use:

* Font [Calling Heart](https://www.dafont.com/calling-heart.font)
  by [Lettersiro Studio](https://www.dafont.com/lettersiro-studio.d7440)
* Clipart [Book with bookmarks](https://openclipart.org/detail/280709/book-with-bookmarks)
  by [Kevin David Pointon](https://openclipart.org/artist/Firkin)

## License

Released under GNU GPL v3 or later<br/>
Copyright (c) 2021-2022 [Jakub T. Jankiewicz](https://jcubic.pl/me)
