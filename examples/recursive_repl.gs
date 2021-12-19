def repl()
    let rep = ask ">>> "
    echo rep
    repl()
end
echo "Echo REPL"
repl()