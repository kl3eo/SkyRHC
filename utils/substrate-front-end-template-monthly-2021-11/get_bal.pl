#!/usr/bin/perl
use CGI;
use JSON;

$query = new CGI;

my $acc = $query->param('acc') || '';

print $query->header();

#my $scriptURL = CGI::url();

#my $ddositsuko = ddos_check($scriptURL);

#my $par = 21;

#if ($ddositsuko > $par) {
#	exit if ($ddositsuko > $par+1); #important not to apply again
#	my $applied = apply_firewall();	
#	if ($applied) {
#		print STDERR "$addr: DDOS firewall applied!\n";
#	}
#}

#my $addr = defined ($ENV{'REMOTE_ADDR'}) ? $ENV{'REMOTE_ADDR'} : '';

#my $th_codes_curr = three_codes ($addr);

#planting seeds against ddos
#my $checkstr = $th_codes_curr."_".$scriptURL;
#if ( open(OUT, ">> /var/www/html/cp/handlers/checklist")) {
#	print OUT $checkstr."\n";
#	close(OUT);
#}

my $cur = length($acc) == 48 && substr($acc,0,1) == '5' ? `node /opt/nvme/polka/get_bal.js --address=$acc` : 0;
my %hash = ('current_balance' => $cur);
my $j = encode_json(\%hash);

print $j;

exit;

sub ddos_check {

my $url = shift;

my $checklist = "/var/www/html/cp/handlers/checklist";
my $addr=$ENV{'REMOTE_ADDR'};
my $checkstr = $addr."_".$url;
open (IN,$checklist);
   my $counter = 0;
   while (!eof(IN)) {
	my $q = readline (*IN); $q =~ s/\n//g;
	$counter++ if ($q eq $checkstr);
   }
   
close (IN);

return $counter;
}

sub apply_firewall {

my $who = shift;

my $applied = 0;

my $addr= length($who) ? $who : $ENV{'REMOTE_ADDR'};

system("sudo /usr/local/bin/ip_apply $addr");
print STDERR "sudo /usr/local/bin/ip_apply $addr\n";

return 1;
}

sub three_codes { #53

my $q = shift;

$q =~ /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
my $three = $1.".".$2.".".$3;

return $three;
}
