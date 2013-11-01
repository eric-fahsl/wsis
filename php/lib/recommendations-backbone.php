
<script type="text/template" id="recc-date-template">
    <div style="clear:both;"></div>
    <h5><a href="<%=url%>"><%=prettyDate%></a></h5>

</script>


<script type="text/template" id="recc-template">
    <div class="span2 recresultLanding">
        <div class="recheader">
            <a href="resorts?resort=<%=fields.resort%>&amp;date=<%=fields.date%>"><%=fields.resort_name%></a></div>
        <span><%=fields.state_full%></span><br>
        <h6>Powder:</h6>
        <div class="flakes" style="width: <%=fields['powder.rating'] * 30 %>px" title="Rating: <%=fields['powder.rating']%> / 5"></div>
        <h6>Bluebird:</h6>
        <div class="suns" style="width: <%=fields['bluebird.rating'] * 30 %>px" title="Rating: <%=fields['bluebird.rating']%> / 5"></div>
        <h6>Freezing Level:</h6>
        <div class="mtnContainer"><div class="mtnShading" style="background-position-y: <%= fields['freezing_level.offset']%>px" ></div></div></div>
</script>

<script type="text/template" id="facet-template">
    <span><a href="<%=url%>"><%=displayValue%></a>
    <div class="x" id="X_<%=term%>">X</div>
    </span>
</script>

<script type="text/template" id="facet-sort">
<%= displayValue %>
</script>

<section id="searchContainer">
<button class="button visible-phone" id="toggleFilters">Filter</button>
<section id="facets" class="hidden-phone span2">
    <div class="header">
        <h3>Date</h3>
    </div>
    <ol id="dateFacets"></ol>
    <div class="header" id="distanceHeader">
        <h3>Distance</h3>
    </div>
    <ol id="distanceFacets"></ol>
    <div class="header">
        <h3>Region</h3>
    </div>
    <ol id="regionFacets"></ol>
    <div class="header">
        <h3>State</h3>
    </div>
    <ol id="stateFacets"></ol>
    <div style="clear:both;"></div>
</section>
<section id="recommendations">
<section id="results">
    <div id="resultsHeader">
        <p id="number_results">Hint: use filters <span class="hidden-phone">on the left </span>to narrow your results<br/>
            Learn about our <a target="new" href="/about">rating system</a>.</p>


        <div id="sort">

            <label for="sort">Sort By: </label>
            <select id="search_sort" name="sort">

            </select>
        </div>

        </p>
    </div>
    <section id="searchResults">

    </section>


</section>
</section>
</section>

<script src="/js/lib/underscore-min.js"></script>
<script src="/js/lib/backbone-min.js"></script>
<script src="/js/models/models.min.js"></script>
<script src="/js/collections/collections.min.js"></script>
<script src="/js/views/views.min.js"></script>
<script src="/js/app.js"></script>
<script src="/js/routers/router.js"></script>
<script src="/js/jquery.cookie.min.js"></script>
