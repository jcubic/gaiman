def range(start, stop, step)
    if not stop then
        stop = start
        start = 0
    end

    if not step then
        if start > stop then
            step = -1
        else
            step = 1
        end
    end

    if start > stop and step > 0 then
        return []
    end

    let result = []

    def run()
        result.push(start)
        start += step
    end

    if start > stop then
        while start > stop do
            run()
        end
    else
        while start < stop do
            run()
        end
    end

    return result
end
