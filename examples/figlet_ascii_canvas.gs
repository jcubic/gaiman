## import JavaScript objects into Gaiman
import canvas from "https://cdn.jsdelivr.net/npm/ascii-canvas/dist/umd.min.js"
import figlet from "https://cdn.jsdelivr.net/npm/figlet/lib/figlet.js"
import Array, Boolean, Math

figlet.defaults({
    "fontPath" => "https://unpkg.com/figlet/fonts/"
})

## Array.from is needed because filget expect standard behavior of Array::reduce
## and Gaiman extend arrays and use it's own implementation of reduce
## and other methods to make them async (in Gaiman all output JavaScript code is async)
figlet.preloadFonts(Array.from(["Standard"]), ready)


def ready()
    let stage = new canvas.Canvas(cols(), 20)
    let fig = ascii("Gaiman Lang")
    let fig_small = ascii("Gaiman")

    let info = new canvas.Item(get_info())
    let text = new canvas.Item("")

    let position = {
        "right" => {
            "x" => width(fig) + 3,
            "y" => 2
        },
        "bottom" => {
            "x" => 3,
            "y" => fig.length + 1
        }
    }

    fig = fig.join("\n")
    fig_small = fig_small.join("\n")

    stage.append(text)
    stage.append(info)

    echo lambda()
        let n = cols()
        if n < 63 then
            text.update(fig_small)
        else
            text.update(fig)
        end
        if n < 94 then
            info.move(position.bottom)
        else
            info.move(position.right)
        end
        return stage.toString().replace(/\s+$/, "")
    end
end

def ascii(text)
    text = render(text)
    ## TODO: split should return async array
    ## https://github.com/jcubic/gaiman/issues/78
    return [*text.split("\n")].map(format)
end

def format(line)
    if line =~ /^\s+$/ then
        return ""
    else
        return "<yellow>$line</yellow>"
    end
end

def get_info()
    let author = "https://jakub.jankiewicz.org"
    let project = "https://github.com/jcubic/gaimanl"
    let license = "https://github.com/jcubic/gaiman/blob/master/LICENSEE"

    return [
        "<white>Project</white>: <a href=\"$project\">Gaiman</a>",
        " <white>Author</white>: <a href=\"$author\">Jakub T. Jankiewicz</a>",
        "<white>License</white>: <a href=\"$license\">GNU GPL v3</a>"
    ].join("\n")
end

def render(text, font)
    return figlet.textSync(text, {
        "font" => font or "Standard"
    })
end

def width(lines)
    return Math.max(*lines.map(lambda(x) return x.length end))
end
