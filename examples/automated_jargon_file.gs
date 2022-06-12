## import JavaScript objects into Gaiman
import figlet from "https://cdn.jsdelivr.net/npm/figlet/lib/figlet.js"
import Array, setTimeout, Promise

def delay(time)
    return new Promise(lambda(resolve)
        setTimeout(resolve, time)
    end)
end

figlet.defaults({
    "fontPath" => "https://unpkg.com/figlet/fonts/"
})

## Array.from is needed because filget expect standard behavior of Array::reduce
## and Gaiman extend arrays and use it's own implementation of reduce
## and other methods to make them async (in Gaiman all output JavaScript code is async)
figlet.preloadFonts(Array.from(["Standard"]), ready)

## jQuery Terminal RPC service used for comments and 404 error page
let service = rpc "https://terminal.jcubic.pl/service.php"

def ready()
    let ascii = figlet.textSync("Jargon File", {
        "font" => "Standard"
    })
    echo "<yellow>$ascii</yellow>"

    let commands = ["Hacker", "Hack", "Hack value"]
    while true do
        ## typing and executing the given commands
        if commands.length then
            prompt ""
            async do
                animate do
                    let command = commands.shift()
                    delay(1000)
                    exec* command, 10
                end
            end
        end

        let term = ask* "jargon? ", 10
        for result in service.jargon(term) do
            echo result["def"]
        end
    end
end
