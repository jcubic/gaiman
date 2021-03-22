def ask_email(message)
   set reply = ask message
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
    set confirm = ask "yes/no: "
    if confirm ~= /y|yes/i then
      echo "what is your name?"
      set command = ask "name: "
      if command then
        set user = command
        set cookie.user = command
        set response = post "/register" { name: user, email: email }
        if response then
          echo "Welcome $user. You're successfully registered"
        end
      end
    end
  end
end
