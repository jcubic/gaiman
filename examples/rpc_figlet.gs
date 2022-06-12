## import JavaScript objects into Gaiman
import figlet from "https://cdn.jsdelivr.net/npm/figlet/lib/figlet.js"
import Array

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
    echo* "<white>This is the Jargon File, a comprehensive compendium of hacker slang illuminating many aspects of hackish tradition, folklore, and humor.</white>", 20

    while true do
        let term = ask "jargon? "
        for result in service.jargon(term) do
            echo result["def"]
        end
    end
end
