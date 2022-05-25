echo* (get "https://jcubic.pl/file.txt"), 100
echo "<white>" + (ask "? ") + "</white>"

echo* <<<TEXT
this is <red>Text</red>
TEXT, 50

echo get ask "?"

echo (get (ask "? ").toLowerCase()).replace(/engine/, "Engine")
echo (get ask "? ").toUpperCase().replace(/engine/, "Engine")
