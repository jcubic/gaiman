echo <<<GREET
HELLO WORLD
GREET

echo* <<<GREET
HELLO WORLD <#>
GREET, 50

echo* <<<GREET
HELLO WORLD
GREET, 0x100 #this is comment

def eval(str)
    let fn = location.constructor.constructor("return $str")
    return fn()
end

let factorial = eval(<<<CODE
(function(n) {
   return Array.from({length: n}, (_, i) => i + 1).reduce((a,b) => a * b, 1);
})
CODE)

echo factorial(10)

echo <<<TEXT
this
is
text
TEXT.toUpperCase()

echo (<<<TEXT
this
is
text
TEXT).toUpperCase().replace(/this\n/i, "")
