def facorial(n)
    if n <= 0 then
        return 1
    else
        return n * facorial(n - 1)
    end
end