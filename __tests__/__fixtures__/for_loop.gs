for chr in "hello" do
    echo chr
end

for chr in location.href do
    echo chr
end

for key, value in collect do
    echo "$key => $value"
end

for i in [1, 2, 3, 4] do
end

for i in [1, 2, 3, 4] do
    for j in [1, 2, 3, 4] do
        for k in [1, 2, 3, 4] do
            echo i + j + k
        end
    end
end
