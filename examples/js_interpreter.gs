import eval

echo "JavaScript REPL"

while true do
    let code = ask "js> "
    try
        if code == "exit" then
            exit
        end
        echo eval(code)
    catch e
      echo "<red>" + e.message + "</red>"
    end
end
