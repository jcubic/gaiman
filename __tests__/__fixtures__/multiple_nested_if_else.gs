if $1 =~ /foo/ then
  let command = ask "? "
  if commad =~ /(bar)/g then
    echo $1
  else if command =~ /(baz)/g then
    echo $1
  else
    echo "NOP"
  end
else
  echo "NOP"
end

let command = ask "? "
if command =~ /foo/ then
  echo "1"
else if command =~ /bar/ then
  echo "2"
else
  echo "3"
end
