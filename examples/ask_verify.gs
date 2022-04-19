# ask with validation example
let colors = ["red", "green", "blue", "pink", "white"]

while true do
    let color = ask "color? ", lambda(str)
        let valid = colors.includes(str)
        if not valid then
            echo "<red>I don't know this color!</red>"
        end
        return valid
    end

    echo* "Your color is <$color>$color</$color>", 50
end
