echo "Factorial Interpreter\n"

while true do
    let res = ask "factorial> "
    if res =~ /^[0-9]+$/ then
        echo factorial(res)
    else
        echo "<red>$res is invalid number</red>"
    end
end

def factorial(n)
    if n <= 0 then
        return 1
    else
        return n * factorial(n - 1)
    end
end
