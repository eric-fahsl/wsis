define(['handlebars'], function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["app/scripts/templates/about.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"item-page\">\n\n	<h2>\n			<a href=\"/about\">\n		About</a>\n		</h2>\n<p>It is certainly an exciting time to be a skier and/or snowboarder! In today’s world, technology and data surround and bombard us. Before you go to your local mountain, how many web resources do you look at? &nbsp;Is the next mountain an hour or two further going to be significantly better? &nbsp;Introducing <em>Where Should I Ski</em>. &nbsp;Weather data feeds are automatically retrieved from a variety of sources and provide ratings and a recommendation on where to go and to tell you what kind of skiing conditions to expect. &nbsp;The site will be in beta mode this season - meaning we will be trying out new ideas and will try to adapt quickly to user feedback.</p>\n<h2>Ratings</h2>\n<p>The ratings system is simple - the best rating is five and the worst is one. &nbsp;You can sort by either of these rating systems, as well as narrow down your search based on date, state, or region.</p>\n<h3>Powder&nbsp;<img src=\"/images/snowflake5.png\" border=\"0\" alt=\"\" style=\"cursor: se-resize !important;\"></h3>\n<p>What most everyone cares about! Many times this can simply be \"how much new snow is projected for X date\". However, I believe that measuring a powder day is by a combination of three factors:&nbsp;</p>\n<ul>\n<li>Fresh snow from the past 24 hours</li>\n<li>New snow projected during the day</li>\n<li>Snow from the last 72 hours</li>\n</ul>\n<p>The rating is calculated by a combination of these factors, weighting fresh snow at 60% and new snow / previous snow at 20% each. In general, a rating of 1 star corresponds to no new snow and a rating of 5 stars means the above three factors average to over ten inches of new snow. Do you have an opinion on how powder should be measured? Give some&nbsp;<a href=\"/feedback\">feedback</a>!</p>\n<p>Bottom line, if you see five flakes, you should definitely bring your powder skis/board.&nbsp;</p>\n<h3>Bluebird&nbsp;<img src=\"/images/bluebird5.png\" border=\"0\" alt=\"\" style=\"cursor: se-resize !important;\"></h3>\n<p>This rates the forecasted weather on how much of a clear/sunny day it is expected to be. For example, sunny Lake Tahoe will get many of these where the cloudy/gloomy Pacific Northwest will not get much. Why do we have this? Well, if there is going to be now new snow, will it at least be a nice day out? Plus, on some lucky days we can be fortunate to have a great powder day plus a bluebird day.</p>\n<p>Bottom line, if you see five suns, you better pack some sunscreen.</p>\n<h2>The Team&nbsp;</h2>\n<h4><img src=\"/images/profile-med.jpg\" border=\"0\" style=\"float: left; padding-right: 10px;\">Eric Fahsl, Founder</h4>\n<p>\n \n </span></p>\n<p>Eric has been skiing since childhood and has a deep passion for skiing and web development while possessing a strong analytical background. His day job is a technology consultant for a large global firm working on a recommendations engine for an electronics retailer. Based in Washington State, he designed and built&nbsp;<em>Where Should I Ski&nbsp;</em>as a side project to see if he can help fellow skiers have a better experience on the mountains. &nbsp;</p>\n<p>&nbsp;</p> \n	\n</div>";
  });

this["JST"]["app/scripts/templates/facet-sort.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression;


  if (stack1 = helpers.displayValue) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.displayValue; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  });

this["JST"]["app/scripts/templates/facet-template.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"x\" id=\"X_";
  if (stack1 = helpers.term) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.term; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">X</div>\n<a href=\"/";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.displayValue) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.displayValue; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a>";
  return buffer;
  });

this["JST"]["app/scripts/templates/feedback.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h2>Feedback</h2>\n\n<p>Have you enjoyed Where Should I Ski? &nbsp;Have some ideas on future enhancements? &nbsp;Want to contribute? &nbsp;Provide some feedback! &nbsp;Where Should I Ski is in BETA mode which means we are focused on proving out new concepts for enhancing in the future. &nbsp;Please e-mail me at eric@whereshouldiski.com, I'd love to hear from you!\n</p>\n<p><br>Regards,<br>Eric<br>Founder, WhereShouldISki.com</p> \n	\n";
  });

this["JST"]["app/scripts/templates/recc-date-template.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div style=\"clear:both;\"></div>\n<h5><a href=\"";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.prettyDate) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.prettyDate; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></h5>\n";
  return buffer;
  });

this["JST"]["app/scripts/templates/recc-template.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div class=\"recresultLanding\">\n    <div class=\"recheader\">\n        <a href=\"resorts?resort="
    + escapeExpression(((stack1 = ((stack1 = depth0.fields),stack1 == null || stack1 === false ? stack1 : stack1.resort)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "&amp;date="
    + escapeExpression(((stack1 = ((stack1 = depth0.fields),stack1 == null || stack1 === false ? stack1 : stack1.date)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.fields),stack1 == null || stack1 === false ? stack1 : stack1.resort_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n    </div>\n    <span>"
    + escapeExpression(((stack1 = ((stack1 = depth0.fields),stack1 == null || stack1 === false ? stack1 : stack1.state_full)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span><br>\n    <h6>Powder:</h6>\n    <div class=\"flakes\" style=\"width: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.calculateRatingWidth || depth0.calculateRatingWidth),stack1 ? stack1.call(depth0, ((stack1 = depth0.fields),stack1 == null || stack1 === false ? stack1 : stack1['powder.rating']), options) : helperMissing.call(depth0, "calculateRatingWidth", ((stack1 = depth0.fields),stack1 == null || stack1 === false ? stack1 : stack1['powder.rating']), options)))
    + "px\" title=\"Rating: "
    + escapeExpression(((stack1 = ((stack1 = depth0.fields),stack1 == null || stack1 === false ? stack1 : stack1['powder.rating'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " / 5\"></div>\n    <h6>Snow Quality (BETA):</h6>\n    <div class=\"stars\" style=\"width: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.calculateRatingWidth || depth0.calculateRatingWidth),stack1 ? stack1.call(depth0, ((stack1 = depth0.fields),stack1 == null || stack1 === false ? stack1 : stack1['snow_quality.rating']), options) : helperMissing.call(depth0, "calculateRatingWidth", ((stack1 = depth0.fields),stack1 == null || stack1 === false ? stack1 : stack1['snow_quality.rating']), options)))
    + "px\" title=\"Rating: "
    + escapeExpression(((stack1 = ((stack1 = depth0.fields),stack1 == null || stack1 === false ? stack1 : stack1['snow_quality.rating'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " / 5\"></div>\n    <h6>Bluebird:</h6>\n    <div class=\"suns\" style=\"width: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.calculateRatingWidth || depth0.calculateRatingWidth),stack1 ? stack1.call(depth0, ((stack1 = depth0.fields),stack1 == null || stack1 === false ? stack1 : stack1['bluebird.rating']), options) : helperMissing.call(depth0, "calculateRatingWidth", ((stack1 = depth0.fields),stack1 == null || stack1 === false ? stack1 : stack1['bluebird.rating']), options)))
    + "px\" title=\"Rating: "
    + escapeExpression(((stack1 = ((stack1 = depth0.fields),stack1 == null || stack1 === false ? stack1 : stack1['bluebird.rating'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " / 5\"></div>\n    <h6>Freezing Level:</h6>\n    <div class=\"mtnContainer\"><div class=\"mtnShading\" style=\"background-position-y: "
    + escapeExpression(((stack1 = ((stack1 = depth0.fields),stack1 == null || stack1 === false ? stack1 : stack1['freezing_level.offset'])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "px\" ></div></div>\n</div>\n";
  return buffer;
  });

this["JST"]["app/scripts/templates/reccDetailsView.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  
  return "\n                 ft\n            ";
  }

function program3(depth0,data) {
  
  
  return "\n                 m\n            ";
  }

  buffer += "<h2>";
  if (stack1 = helpers.resort_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.resort_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ", ";
  if (stack1 = helpers.state) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.state; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h2>\n<p class='nomarginbottom'><a target='new' href='\"";
  if (stack1 = helpers.resort_website) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.resort_website; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"'>";
  if (stack1 = helpers.resort_website) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.resort_website; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></p>\n\n<section class=\"smallRightPad col-md-9\">\n    <h3 class=\"minPhoneWidth\">Ratings for ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.dateFormat || depth0.dateFormat),stack1 ? stack1.call(depth0, depth0.date, options) : helperMissing.call(depth0, "dateFormat", depth0.date, options)))
    + "</h3>\n    <div class=\"smallItalic\">Generated on ";
  if (stack2 = helpers.createdOn) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.createdOn; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " PST</div>\n    <span class=\"ital\"><a href=\"/resorts?resort=";
  if (stack2 = helpers.resort) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.resort; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "&date=";
  if (stack2 = helpers.previousDate) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.previousDate; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">Previous Day</a></span> |\n    <span class=\"ital\"><a href=\"/resorts?resort=<?= $resort ?>&date=<?= $nextDate ?>\">Next Day</a></span>\n\n    <table cellpadding=\"3\" id=\"resortDetailRatings\">\n    <tr>\n        <td><h4>Powder</h4></td>\n        <td><h6>"
    + escapeExpression(((stack1 = ((stack1 = depth0.powder),stack1 == null || stack1 === false ? stack1 : stack1.rating)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h6></td>\n        <td><div class=\"flakes-large\" style=\"width: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.calculateRatingWidth || depth0.calculateRatingWidth),stack1 ? stack1.call(depth0, ((stack1 = depth0.powder),stack1 == null || stack1 === false ? stack1 : stack1.rating), "large", options) : helperMissing.call(depth0, "calculateRatingWidth", ((stack1 = depth0.powder),stack1 == null || stack1 === false ? stack1 : stack1.rating), "large", options)))
    + "px\" title=\"Rating: "
    + escapeExpression(((stack1 = ((stack1 = depth0.powder),stack1 == null || stack1 === false ? stack1 : stack1.rating)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/ 5\"></div>\n    </tr>\n    <tr>\n        <td><h4>Snow Quality</h4></td>\n        <td><h6>"
    + escapeExpression(((stack1 = ((stack1 = depth0.snow_quality),stack1 == null || stack1 === false ? stack1 : stack1.rating)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h6></td>\n        <td><div class=\"stars-large\" style=\"width: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.calculateRatingWidth || depth0.calculateRatingWidth),stack1 ? stack1.call(depth0, ((stack1 = depth0.snow_quality),stack1 == null || stack1 === false ? stack1 : stack1.rating), "large", options) : helperMissing.call(depth0, "calculateRatingWidth", ((stack1 = depth0.snow_quality),stack1 == null || stack1 === false ? stack1 : stack1.rating), "large", options)))
    + "px\" title=\"Rating: "
    + escapeExpression(((stack1 = ((stack1 = depth0.snow_quality),stack1 == null || stack1 === false ? stack1 : stack1.rating)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/ 5\"></td>\n    </tr>\n    <tr>\n        <td><h4>Bluebird</h4></td>\n        <td><h6>"
    + escapeExpression(((stack1 = ((stack1 = depth0.bluebird),stack1 == null || stack1 === false ? stack1 : stack1.rating)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h6></td>\n        <td><div class=\"suns-large\" style=\"width: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.calculateRatingWidth || depth0.calculateRatingWidth),stack1 ? stack1.call(depth0, ((stack1 = depth0.bluebird),stack1 == null || stack1 === false ? stack1 : stack1.rating), "large", options) : helperMissing.call(depth0, "calculateRatingWidth", ((stack1 = depth0.bluebird),stack1 == null || stack1 === false ? stack1 : stack1.rating), "large", options)))
    + "px\" title=\"Rating: "
    + escapeExpression(((stack1 = ((stack1 = depth0.bluebird),stack1 == null || stack1 === false ? stack1 : stack1.rating)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/ 5\"></td>\n    </tr>\n    <tr>\n        <td><h5>Freezing <br/> Level</h5></td>\n        <td><h6>"
    + escapeExpression(((stack1 = ((stack1 = depth0.freezing_level),stack1 == null || stack1 === false ? stack1 : stack1.freezing_level_avg)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n            ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.freezing_level),stack1 == null || stack1 === false ? stack1 : stack1.freezing_level_avg), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </h6></td>\n        <td>\n            <div class='mtnContainer-large'><div class='mtnShading-large' style='background-position-y:  ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.calculateFreezingLevelOffset || depth0.calculateFreezingLevelOffset),stack1 ? stack1.call(depth0, ((stack1 = depth0.freezing_level),stack1 == null || stack1 === false ? stack1 : stack1.rating), ((stack1 = depth0.freezing_level),stack1 == null || stack1 === false ? stack1 : stack1.freezing_level_avg), "large", options) : helperMissing.call(depth0, "calculateFreezingLevelOffset", ((stack1 = depth0.freezing_level),stack1 == null || stack1 === false ? stack1 : stack1.rating), ((stack1 = depth0.freezing_level),stack1 == null || stack1 === false ? stack1 : stack1.freezing_level_avg), "large", options)))
    + "px;' title='Freezing Level: "
    + escapeExpression(((stack1 = ((stack1 = depth0.freezing_level),stack1 == null || stack1 === false ? stack1 : stack1.freezing_level_avg)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'></div></div>\n        </td>\n    </tr>\n    </table>\n\n</section>\n\n\n<section class=\"col-md-3\" id=\"rdp_sidebar\">\n        <?php if ($liftieId != null) { ?>\n            <h4>Live Lift Status</h4>\n            <div id=\"liftie\" class=\"liftie-widget\" data-resort=\"<?= $liftieId ?>\" data-style=\"naked\"/>\n        <?php } ?>\n\n        <h4>Mountain Stats</h4>\n        <table>\n            <?php\n            $unitStr = \" (m, approx)\";\n            if ($isDomestic) {\n                $unitStr = \" (ft, approx)\";\n            }\n            createTableRow(\"Summit Elevation<br/>\" . $unitStr, $resortInfo->{'summit_elevation'});\n            createTableRow(\"Base Elevation<br/>\" . $unitStr, $resortInfo->{'base_elevation'});\n            createTableRow(\"Latitude\", $resortInfo->{'latitude'});\n            createTableRow(\"Longitude\", $resortInfo->{'longitude'});\n            ?>\n\n        </table>\n\n        <h4>Data Sources</h4>\n\n        <?php\n        if ($isDomestic) {\n            echo \"<a target='new' href='http://forecast.weather.gov/MapClick.php?unit=0&lg=english&FcstType=text&lat=\" .\n                $resortInfo->{'latitude'} . \"&lon=\" . $resortInfo->{'longitude'} . \"'>$resortName NOAA Forecast</a><br/>\\n\";\n        }\n        echo \"<a target='new1' href='http://www.snow-forecast.com/resorts/\" . $resortInfo->{'snowforecast_id'} . \"/6day/mid'/>\" .\n            \"$resortName Snow-Forecast.com Weather <br/><img src='../images/snowforecast-logo.jpg' class='smallmarginbottom'/></a><br/>\";\n\n        echo \"<a target='new2' href='http://opensnow.com'>OpenSnow.com<br/><img src='../images/opensnow_logo.png'/></a>\";    \n        ?>\n    </section>";
  return buffer;
  });

return this["JST"];

});