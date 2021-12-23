let name = store "__name__"
if not name then
    echo* "Hi, What is your name?", 50
    name = ask "name? "
    echo "Hello $name, nice to meet you."
else
    echo "Welcome back $name"
end