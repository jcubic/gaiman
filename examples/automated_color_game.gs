echo* "What is your favorite color?", 50
let colors = ["red", "green", "blue", "yellow", "orange"]
while true do
    if colors.length then
        prompt ""
        async animate do
            let color = colors.shift()
            delay(1000)
            exec* color, 50
        end
    end
    let color = ask "color? "
    echo* "<$color>$color</$color>, is a nice color.", 100
end
