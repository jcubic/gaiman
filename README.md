# Gaiman

![Gaiman Text based advanture games engine](assets/banner.svg)

[Storytelling Text Based Game Engine](https://github.com/jcubic/gaiman)

## Examples

This is basic Gaiman DLS example:

```ruby
def ask_email(message)
   set reply = ask message
   if reply ~= /y|yes/i then
      echo "OK"
   else if reply ~= /n|no/i then
      echo "FAIL"
   else
      global(message)
   end
end

def global(command)
   if command ~= /help/ then
      echo "available commands help"
   else if command ~= /ls/
      echo get "/exec?command=ls"
   else
      echo "wrong command"
   end
end

if cookie.visited then
  if cookie.USER_NAME then
    echo "hello $user"
  else if cookie.EMAIL then
    echo "Will contact with with any updates"
  else
    echo "Do you want me to contact you with updates?"
    set confirm = ask "yes/no: "
    if confirm ~= /y|yes/i then
      echo "what is your name?"
      set command = ask "name: "
      if command then
        set user = command
        set cookie.user = command
        set response = post "/register" { name: user, email: email }
        if response then
          echo "Welcome $user. You're successfully registered"
        end
      end
    end
  end
end
```

## TODO
- [ ] Parser
  - [x] variables
  - [x] property access
  - [x] if/else if/else statements
  - [x] Functions
  - [ ] Functions return value
  - [x] Commands
    - [x] `ask` - set prompt
    - [x] `get` - send HTTP GET request
    - [x] `post` - send HTTP POST request
    - [x] `echo` - print message
    - [x] `set` - save expression or command into variable
  - [ ] Not operator inside if statements
  - [ ] comparison operators
    - [x] regex match `~=`
    - [ ] `$1` variables
- [ ] Compiler to JSON
- [ ] Unit tests
- [ ] Interpreter
- [ ] jQuery Terminal integration

## Name

Name came from [Neil Gaiman](https://en.wikipedia.org/wiki/Neil_Gaiman),
Author of novels, comic books, graphic novels and films. Great storyteller.

## Acknowledge

Logo use:

* Font [Calling Heart](https://www.dafont.com/calling-heart.font)
  by [Lettersiro Studio](https://www.dafont.com/lettersiro-studio.d7440)
* Clipart [Book with bookmarks](https://openclipart.org/detail/280709/book-with-bookmarks)
  by [Kevin David Pointon](https://openclipart.org/artist/Firkin)

## License

Released under [MIT](http://opensource.org/licenses/MIT) license<br/>
Copyright (c) 2021 [Jakub T. Jankiewicz](https://jcubic.pl/me)
