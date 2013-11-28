 <?php $recSearchLink = "recommendations#search/";
 	//$recSearchLink = "recTester.php";
 ?>
 <div id="grid-bottom" >
    <div class="row-fluid" id="recValueProps">
    	<div class="module mod_1 first no_title span3">
			<a href="<?= $recSearchLink ?>">
				<img src="../images/snowflake-hi.png" class="centerImage" alt="Powder"/>
				<h4>Powder</h4>
			</a>
			<p>What everyone cares about! How much fresh snow can you expect for the day?</p>
			<div class="bottomValueProp">
				<a href="<?= $recSearchLink ?>">See top forecasted powder ratings</a>
			</div>
		</div>

        <div class="module mod_3 span3">
            <a href="<?= $recSearchLink ?>sort=quality">
                <img src="../images/star-hi.png" class="centerImage" alt="Snow Quality"/>
                <h4>Snow Quality</h4>
            </a>
            <p>How soft is the snow going to be? Should I expect blower pow or faceshots?</p>
            <div class="bottomValueProp">
                <a href="<?= $recSearchLink ?>sort=quality">See top rated resorts by snow quality</a>
            </div>
        </div>

		<div class="module mod_2 span3">
			<a href="<?= $recSearchLink ?>sort=bluebird">
				<img src="../images/sun-hi.png" class="centerImage" alt="Bluebird"/>
				<h4>Bluebird</h4>
			</a>
			<p>How nice of a day is it going to be?  Is it worth it to bring the camera (or the sunscreen?)</p>
			<div class="bottomValueProp">
				<a href="<?= $recSearchLink ?>sort=bluebird">See top forecasted bluebird ratings</a>
			</div>
		</div>
		
		<div class="module mod_4 last span3">
			<a href="<?= $recSearchLink ?>sort=distance">
				<img src="../images/map-pin-md.png" class="centerImage" alt="Distance"/>
				<h4>Distance</h4>
			</a>
			<p>What areas are directly closest to me?
			<span class="footnote">
			Note: you will need to approve sharing your location at the prompt to enable this feature
			</span>
			</p>
			<div class="bottomValueProp">
				<a href="<?= $recSearchLink ?>sort=distance">See resorts closest to me</a>
			</div>
		</div>
	</div>
</div>
    