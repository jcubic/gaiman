
def step(str)
    str = "$str ..."
    echo msg
    msg += " success"
    update -1, msg
end

prompt "# "
enter "nmap -v -sS -O 10.2.2.2", 100
echo ""
sleep* 10
echo "Starting nmap V. 2.54BETA25"
echo "Insufficient responses for TCP sequencing (3). OS detection may be less"
echo "accurate"
sleep* 10
echo "Interesting ports on 10.2.2.2:"
echo "(The 1539 ports scanned but not shown below are in state: closed)"
echo "Port\t\tState\t\tService\n22/tcp\t\topen\t\tssh"
echo ""
echo "No exact OS matches for host"
echo ""
echo "Nmap run completed -- 1 IP address (1 host up) scanneds"
enter* "sshnuke 10.2.2.2 -rootpw=\"Z10N0101\"", 100
prompt ""
step("Attempting to exploit SSHv1 CRC32")
sleep 400
echo "System open: Access level <9>"
prompt "# "
sleep 400
enter* "ssh 10.2.2.2 -l root", 100
prompt "root@10.2.2.2's password: "
sleep 1000
prompt "RRF-CONTROL> "
echo "root@10.2.2.2's password: \n"
sleep 500
enter* "disable grid nodes 21 - 48", 100
echo ""
echo "[[;#B9EDFF;]Warning: Disabling nodes 21-48 will disconnect sector 11 (27 nodes)]"
prompt ""
echo "         [[;#B9EDFF;]ARE YOU SURE? (y/n)]"
update -1, "         [[;#B9EDFF;]ARE YOU SURE? (y/n)] y"
echo ""
for i in range(21, 48) do
    echo "[[;#B9EDFF;]Grid Node $i offline...]"
    sleep 200
end
echo "\nConnection to 10.2.2.2 closed."
prompt "# "
