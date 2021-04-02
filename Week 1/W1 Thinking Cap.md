I found this interesting web map exploring how the population of Manhattan changes by the hour, daily, and is broken up block-by-block.

![Screen Shot 2021-03-31 at 9 38 50 PM](https://user-images.githubusercontent.com/62718306/113231632-ac9b1c80-9269-11eb-9c5a-d3c0cb47075e.png)
http://manpopex.us/

The site aims to provide a visualization of what it means to be the most densely-populated county in the United States. In addition, the site also shows that this label is not one that remains immutable–– Manhattan also has the largest daytime-to-nighttime population ratio (about 2:1). 

I appreciated the spatial factor to data visualization that was incorporated into this site. Instead of mapping in a two-dimensional space directly onto a base map, the use of height and altitude to convey population density was especially effective. The use of a color gradient to differentiate dense blocks from less-dense blocks further enhanced the accessibility of the data being presented.

In order to most accurately and effectively approximate a granular population distribution across Manhattan, this map uses the MTA's turnstile database and another GIS-format dataset of subway routes in NYC. The subway is considered a ubiquitous form of travel for a majority of those in Manhattan, and the stations themselves are relatively uniformly spread. As a result, the subway traffic could act as a proxy for population changes on the island throughout the day. In my opinion, the use of MTA turnstile data to approximate populations definitely works and is a creative solution to solving a question with no clear solution. However, I do not think it captures the full picture of population changes in the city, as it neglects to include those who might commute by car, bike, or walk to their destination.

The web map uses mapbox to produce its map. It also uses D3.js to visualize data via graphs.

One aspect of the map that is difficult to see is the block locations of low population density. Because of how the altitude feature is designed to correlate to population level, blocks with high population levels sometimes obscure blocks that are less densely-populated. Having the ability to change the pitch and angle of the view, as well as the color difference, definitely helps in making the distinction more clear. However, having the ability to change transparencies of the visualized towers or toggle the visibility of the towers by population level could make the data more accessible.
