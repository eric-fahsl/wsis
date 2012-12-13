<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-35552544-1']);
  _gaq.push(['_trackPageview']);
  <?php 
  	if(isset($_GET['resort'])) {
  		$resortName = $_GET['resort'];
  		echo "_gaq.push(['_setCustomVar',1,'resort','resortName']);"
  	}

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>