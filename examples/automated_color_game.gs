echo* "What is your favorite color?", 50
let colors = ["red", "green", "blue", "yellow", "orange"]
while true do
  if colors.length then
    prompt ""
    async do
      animate do
        let color = colors.shift()
        delay(1000)
        exec* color, 10
      end
    end
  end
  let color = ask "color? "
  echo* "<$color>$color</$color>, is a nice color", 50
end
