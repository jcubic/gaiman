def map(fn, array)
    let result = []
    for item in array do
        result.push(fn(item))
    end
    return result
end

def filter(fn, array)
    let result = []
    for item in array do
        if fn(item) then
            result.push(item)
        end
    end
    return result
end

def reduce(fn, init, array)
    let result = init
    for item in array do
        result = fn(result, item)
    end
    return result
end

echo filter(lambda(a)
    return a % 2 == 0
end, [1,2,3,4,5])

echo reduce(lambda(a, b)
    return a * b
end, 1, [1,2,3,4,5,6,7,8,9,10])

echo map(lambda(a)
    return a * 2
end, [1,3,4,5])
