import Promise, setTimeout

async do
  animate do
    exec* "hello, world", 0
  end
end

def delay(time)
    return new Promise(lambda(resolve)
        setTimeout(resolve, time)
    end)
end
