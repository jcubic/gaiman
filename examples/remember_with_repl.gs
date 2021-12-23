let name = store "__name__"

# Ask user for username when access first time
if not name then
    echo* "Hi, What is your name?", 50 # animation
    name = ask "name? "
    store "__name__", name
    echo "Hello $name, nice to meet you."
else
    echo "Welcome back $name"
end

# Repl with commands:
# * exit that forget the name
# * ping that prints pong
# * any other input prints red message

# You can use break statment to exit the loop
# You may get inifinite loop if you don't use that pause terminal

while true do
    let cmd = ask "> "
    if cmd =~ /exit/ then
        store "__name__", null
        echo* "Ok, Bye $name.", 50
    else if cmd =~ /ping/ then
        echo "pong"
    else
        echo "<red>Unknown command</red>"
    end
end