let colors = ["red", "blue", "pink", "black"]

let color = ask* "color? ", 50, lambda(str)
    if not colors.includes(str) then
        echo "<red>I don't know this color!</red>"
        return false
    else
        return true
    end
end

echo color
