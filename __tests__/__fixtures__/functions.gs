def foo(arg)
end

def foo(arg)
  if arg =~ /foo/ then
    return 10 + 10
  end
end

def login(username)
  echo "what's up?"
  if username =~ /root/ then
    return ask username + "# "
  else
    return ask username + "$ "
  end
end

def define()

end

def define(*args)

end

def define(a, *args)

end
