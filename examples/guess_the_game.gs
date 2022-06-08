def game()
    let number = round(random() * 100)
    echo* "Guess a number ($number)", 0
    let stop = false
    while not stop do
        let answer = ask "number? "
        if answer < number then
            echo "<red>number too small!</red>"
        else if answer > number then
            echo "<red>number too big!</red>"
        else
            echo "<yellow>You won, the number is $number.</yellow>"
            stop = true
        end
    end
end

def main()
    game()
    echo "do you want to play again?"
    let answer = ask "Y/N: ", lambda(answer)
        return answer =~ /^(Y|N)$/i
    end
    if answer =~ /y/i then
        main()
    else
        echo "Ok, bye."
    end
end

main()
