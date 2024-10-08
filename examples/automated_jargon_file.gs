## import JavaScript objects into Gaiman
import figlet from "https://cdn.jsdelivr.net/npm/figlet/lib/figlet.js"
import Array
import Promise

figlet.defaults({
    "fontPath" => "https://unpkg.com/figlet/fonts/"
})

## jQuery Terminal RPC service used for comments and 404 error page
let service = rpc "https://terminal.jcubic.pl/service.php"

let ascii = figlet.text("Jargon File", {
    "font" => "Standard"
})
echo "<yellow>$ascii</yellow>"
echo* "<white>This is the Jargon File, a comprehensive compendium of hacker slang illuminating many aspects of hackish tradition, folklore, and humor.</white>", 20
echo
let commands = ["Hacker", "Hack value"]
while true do
    ## typing and executing the given commands
    if commands.length then
        prompt ""
        async animate do
            let command = commands.shift()
            delay(1000)
            exec* command, 10
        end
    end

    let term = ask* "jargon? ", 10
    for result in service.jargon(term) do
        echo result["def"]
        echo
    end
end