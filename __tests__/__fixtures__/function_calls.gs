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
