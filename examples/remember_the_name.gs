let name = store "__name__"
if not name then
    echo* "Hi, What is your name?", 0
    name = ask "name? "
    store "__name__", name
    echo* "Hello $name, nice to meet you.", 0
else
    echo "Welcome back $name"
end
