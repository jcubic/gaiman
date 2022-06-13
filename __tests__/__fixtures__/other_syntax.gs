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

async do
    animate do
        let command = commands.shift()
        delay(1000)
        exec* command, 10
    end
end

async animate do
    let command = commands.shift()
    delay(1000)
    exec* command, 10
end

let stage = new canvas.Canvas(cols(), 10)
