def ask_email(message)
   let reply = ask message
   if reply ~= /y|yes/i then
      echo "OK"
   else if reply ~= /n|no/i then
      echo "FAIL"
   else
      global(message)
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

if cookie.visited then
  if cookie.USER_NAME then
    echo "hello $user"
  else if cookie.EMAIL then
    echo "Will contact with with any updates"
  else
    echo "Do you want me to contact you with updates?"
    let confirm = ask "yes/no: "
    if confirm ~= /y|yes/i then
      echo "what is your name?"
      let command = ask "name: "
      if command then
        let user = command
        #let response = post "/register" { name: user, email: email }
        if response then
          echo "Welcome $user. You're successfully registered"
        end
      end
    end
  end
else
  echo "Welcome stranger. What is your name? "
  let name = ask "name: "
  if name then
    echo "Hi $name. Do you want me to concat you when time come?"
    let command = ask "YES/NO? "
    if command ~= /yes/i then
      echo "What is your email"
      let email = ask "email? "
      if email then
        echo "is email $email correct?"
        let confirm = ask "YES/NO? "
        if confirm ~= /yes/i then
          echo "ok will keep your email and contact you when time come."
        end
      end
    end
  end
end
