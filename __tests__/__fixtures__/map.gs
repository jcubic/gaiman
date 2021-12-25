def map(fn, list)
    let result = []
    for item in list do
        result.push(item)
    end
    return result
end

echo map(lambda(x)
    return x * x
end, [1,2,3,4])