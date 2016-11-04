var Entities = require('html-entities').AllHtmlEntities;
 
entities = new Entities();
 
console.log(entities.encode('<>"&©®∆')); // &lt;&gt;&quot;&amp;&copy;&reg;∆ 
console.log(entities.encodeNonUTF('<>"&©®∆')); // &lt;&gt;&quot;&amp;&copy;&reg;&#8710; 
console.log(entities.encodeNonASCII('<>"&©®∆')); // <>"&©®&#8710; 
console.log(entities.decode('&lt;&gt;&quot;&amp;&copy;&reg;')); // <>"&©® 

console.log(entities.decode("/lib/reccapi.php?fields=t&date=2016-02-08&coords=49.7383%2C-125.299&size=7&sort=distance"));
console.log("/lib/reccapi.php?fields=t&date=2016-02-08&coords=49.7383%2C-125.299&size=7&sort=distance".replace('%2C',','));