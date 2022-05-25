def global(message)
  echo message
  if message =~ /hello/ then
    show_hello()
  end
end

def show_hello()
  echo "hello"
end

global("hello")

hello(1, *[1,2,3])
hello(*[1,2,3])



list[cmd](10)()
list[cmd](10).foo.bar()
list[cmd][cmd]()
list[cmd][cmd].foo.bar()
list[cmd][cmd]().foo.bar()
list[cmd](10).foo.bar()()
list[cmd].foo(10).foo.bar()()
list.inner[cmd].foo.bar(10).foo.bar()()

echo ( <<<TEXT
this
is
text
TEXT.toUpperCase() ).replace(/this\n/i, "")
echo ( (<<<TEXT
this
is
text
TEXT).toUpperCase() ).replace(/this\n/i, "")
