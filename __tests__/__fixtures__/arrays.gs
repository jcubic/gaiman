let x = [1,  2,   3,   4]

for word in ["lorem", "ipsum", "dolor"] do
    echo word
end

for i in [1,2,3] do
    echo i
end

let names = ["helo", "world"]

echo names[0] + " " + names[1]

echo [1,2,3,4].map(lambda(x)
    return x * x
end)