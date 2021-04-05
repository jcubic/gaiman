
def prompt_email()
  echo "What is your email"
  let email = ask "email? "
  if email then
    echo "is email $email correct?"
    let confirm = ask "YES/NO? "
    if confirm ~= /yes/i then
      echo "ok will keep your email and contact you when time come."
    end
  else
    echo "You need to type your email"
    prompt_email()
  end
end

def ask_email()
  let command = ask "YES/NO? "
  if command ~= /yes/i then
    prompt_email()
  else
    echo "Ok, I understand."
  end
end

def global(command)
   if command ~= /help/ then
      echo "available commands help"
   else if command ~= /ls/ then
      echo get "/exec?command=ls"
   else
      echo "wrong command"
   end
end

def ask_name()
  let name = ask "name: "
  if name then
    cookie.USER_NAME = name
    echo "Hi $name. Do you want me to concat you when time come?"
  else
    echo "You need to type something"
    ask_name()
  end
end

if cookie.VISITED then
  if cookie.USER_NAME then
    let user = cookie.USER_NAME
    if cookie.EMAIL then
      echo "Welcome back $user. Will contact with with any updates"
    else
      echo "Welcome back $user. Do you want me to contact you with updates?"
      ask_email()
    end
  else
    echo "Welcome back stranger. What is your name?"
    ask_name()
    ask_email()
  end
else
  cookie.VISITED = true
  echo "Welcome stranger. What is your name? "
  ask_name()
  echo "Do you want me to contact you with updates?"
  ask_email()
end
