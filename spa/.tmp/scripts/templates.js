define(['handlebars'], function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["app/scripts/templates/about.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"item-page\">\n\n	<h2>\n			<a href=\"/about\">\n		About</a>\n		</h2>\n<p>It is certainly an exciting time to be a skier and/or snowboarder! In today’s world, technology and data surround and bombard us. Before you go to your local mountain, how many web resources do you look at? &nbsp;Is the next mountain an hour or two further going to be significantly better? &nbsp;Introducing <em>Where Should I Ski</em>. &nbsp;Weather data feeds are automatically retrieved from a variety of sources and provide ratings and a recommendation on where to go and to tell you what kind of skiing conditions to expect. &nbsp;The site will be in beta mode this season - meaning we will be trying out new ideas and will try to adapt quickly to user feedback.</p>\n<h2>Ratings</h2>\n<p>The ratings system is simple - the best rating is five and the worst is one. &nbsp;You can sort by either of these rating systems, as well as narrow down your search based on date, state, or region.</p>\n<h3>Powder&nbsp;<img src=\"/images/snowflake5.png\" border=\"0\" alt=\"\" style=\"cursor: se-resize !important;\"></h3>\n<p>What most everyone cares about! Many times this can simply be \"how much new snow is projected for X date\". However, I believe that measuring a powder day is by a combination of three factors:&nbsp;</p>\n<ul>\n<li>Fresh snow from the past 24 hours</li>\n<li>New snow projected during the day</li>\n<li>Snow from the last 72 hours</li>\n</ul>\n<p>The rating is calculated by a combination of these factors, weighting fresh snow at 60% and new snow / previous snow at 20% each. In general, a rating of 1 star corresponds to no new snow and a rating of 5 stars means the above three factors average to over ten inches of new snow. Do you have an opinion on how powder should be measured? Give some&nbsp;<a href=\"/feedback\">feedback</a>!</p>\n<p>Bottom line, if you see five flakes, you should definitely bring your powder skis/board.&nbsp;</p>\n<h3>Bluebird&nbsp;<img src=\"/images/bluebird5.png\" border=\"0\" alt=\"\" style=\"cursor: se-resize !important;\"></h3>\n<p>This rates the forecasted weather on how much of a clear/sunny day it is expected to be. For example, sunny Lake Tahoe will get many of these where the cloudy/gloomy Pacific Northwest will not get much. Why do we have this? Well, if there is going to be now new snow, will it at least be a nice day out? Plus, on some lucky days we can be fortunate to have a great powder day plus a bluebird day.</p>\n<p>Bottom line, if you see five suns, you better pack some sunscreen.</p>\n<h2>The Team&nbsp;</h2>\n<h4><img src=\"/images/profile-med.jpg\" border=\"0\" style=\"float: left; padding-right: 10px;\">Eric Fahsl, Founder</h4>\n<p>\n \n </span></p>\n<p>Eric has been skiing since childhood and has a deep passion for skiing and web development while possessing a strong analytical background. His day job is a technology consultant for a large global firm working on a recommendations engine for an electronics retailer. Based in Washington State, he designed and built&nbsp;<em>Where Should I Ski&nbsp;</em>as a side project to see if he can help fellow skiers have a better experience on the mountains. &nbsp;</p>\n<p>&nbsp;</p> \n	\n</div>";
  });

this["JST"]["app/scripts/templates/feedback.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h2>Feedback</h2>\n\n<p>Have you enjoyed Where Should I Ski? &nbsp;Have some ideas on future enhancements? &nbsp;Want to contribute? &nbsp;Provide some feedback! &nbsp;Where Should I Ski is in BETA mode which means we are focused on proving out new concepts for enhancing in the future. &nbsp;Please e-mail me at eric@whereshouldiski.com, I'd love to hear from you!\n</p>\n<p><br>Regards,<br>Eric<br>Founder, WhereShouldISki.com</p> \n	\n";
  });

this["JST"]["app/scripts/templates/reccDetailsView.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<h2>";
  if (stack1 = helpers.resort_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.resort_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ", ";
  if (stack1 = helpers.state) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.state; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h2>\n<p class='nomarginbottom'><a target='new' href='\" . $resortInfo->{'resort_website'} . \"'>\" . $resortInfo->{'resort_website'} . \"</a></p>\n\n<section class=\"smallRightPad\">\n    <h3 class=\"minPhoneWidth\">Ratings for ";
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers.dateFormat || depth0.dateFormat),stack1 ? stack1.call(depth0, depth0.date, options) : helperMissing.call(depth0, "dateFormat", depth0.date, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</h3>\n    <div class=\"smallItalic\">Generated on ";
  if (stack2 = helpers.createdOn) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.createdOn; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " PST</div>\n    <span class=\"ital\"><a href=\"/resorts?resort=<?= $resort ?>&date=<?= $previousDate ?>\">Previous Day</a></span> |\n    <span class=\"ital\"><a href=\"/resorts?resort=<?= $resort ?>&date=<?= $nextDate ?>\">Next Day</a></span>\n\n    <table cellpadding=\"3\" id=\"resortDetailRatings\">\n    <tr>\n        <td><h4>Powder</h4></td>\n        <td><h6><?= $powderRating ?></h6></td>\n        <td><?php printSnowFlakes($powderRating, True); ?></td>\n    </tr>\n    <tr>\n        <td><h4>Snow Quality</h4></td>\n        <td><h6><?php echo $parsedJson->{'snow_quality'}->{'rating'}; ?></h6></td>\n        <td><?php printStars($parsedJson->{'snow_quality'}->{'rating'}, True); ?></td>\n    </tr>\n    <tr>\n        <td><h4>Bluebird</h4></td>\n        <td><h6><?php echo $parsedJson->{'bluebird'}->{'rating'}; ?></h6></td>\n        <td><?php printSuns($parsedJson->{'bluebird'}->{'rating'}, True); ?></td>\n    </tr>\n    <tr>\n        <td><h5>Freezing <br/> Level</h5></td>\n        <td><h6><?php\n            echo $parsedJson->{'freezing_level'}->{'freezing_level_avg'};\n            if ($isDomestic) {\n                echo \" ft\";\n            } else {\n                echo \" m\";\n            }\n        ?></h6></td>\n        <td><?php printFreezingLevel($parsedJson->{'freezing_level'}->{'rating'}, $parsedJson->{'freezing_level'}->{'freezing_level_avg'}, True); ?></td>\n    </tr>\n    </table>\n\n</section>";
  return buffer;
  });

return this["JST"];

});