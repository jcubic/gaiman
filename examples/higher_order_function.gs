def adder(x)
    return lambda(y)
        return x + y
    end
end

echo [1,2,3,4].map(adder(10))