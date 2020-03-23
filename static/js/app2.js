function buildCharts(sample) {
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then(function(data) {
      // Grab values from the response json object to build the plots
       var names = data.names
       console.log(names);
        
    // set init index of currentSelection to 0 
   currentSelection = names.indexOf(sample);
   console.log(currentSelection); 

    //Create dictionary of data for bar chart
   var dict = []; 
   for(var i = 0; i < data.samples[currentSelection].sample_values.length; i++) {
   var obj = {};

    obj['SampleValue'] = data.samples[currentSelection].sample_values[i];
    obj['OTUID'] = "OTU " + data.samples[currentSelection].otu_ids[i];
    obj['OTULabel'] = data.samples[currentSelection].otu_labels[i];
    dict.push(obj);
}

//Sort dictionary descending
dict.sort(function(a, b){return b - a});
console.log(dict[0].SampleValue);

//Push first 10 X values
var x = []; 
   for(var i = 0; i < 10; i++) {     
    x.push(dict[i].SampleValue);
}

//Push first 10 Y values
var y = []; 
   for(var i = 0; i < 10; i++) {
   y.push(dict[i].OTUID);
}

//Push first 10 Hover Text Values
var hoverText = []; 
   for(var i = 0; i < 10; i++) {
   hoverText.push(dict[i].OTULabel);
}

// Create initial plot 
var barData = [{
  x: x.reverse(),
  y: y.reverse(),
  type: 'bar',
  hovertext: hoverText.reverse(),
  orientation: 'h'
    
}];

Plotly.newPlot('bar', barData);
   
      // buildMetadata(firstSample);

      // Loop through sampleNames to add "option" elements to the selector
      
      
      //Plot Bubble Chart

      //Gather data for Bubble Chart
      var xval = data.samples[currentSelection].otu_ids;
      var yval = data.samples[currentSelection].sample_values;
      var msize = data.samples[currentSelection].sample_values;
      var mcolor = data.samples[currentSelection].otu_ids;
      var tval = data.samples[currentSelection].otu_labels;
      
      var trace1 ={
        x:xval,
        y:yval,
        text:tval,
        mode:'markers',
        marker:{
          color:mcolor,
          size:msize,
          colorscale:"Rainbow" 
        }
      };
      var bubbledata = [trace1];
      
      var bubblelayout = {
        title: 'OTU ID',
              };
      
      Plotly.newPlot('bubble', bubbledata, bubblelayout); 

    });


    
};

function buildMetadata(sample) {
    // Make an API call to gather all data and then reduce to matching the sample selected
    d3.json("samples.json").then(function(data) { 

    currentSelection = data.names.indexOf(sample);
          
    pbodyContent = data.metadata[currentSelection]

    console.log(pbodyContent)
       
    var list = d3.select(".panel-body");

    // remove any children from the list to
    list.html("");

    // append stats to the list
    list.append("p").text(`Id: ${pbodyContent.id}`);
    list.append("p").text(`Ethnicity: ${pbodyContent.ethnicity}`);
    list.append("p").text(`Gender: ${pbodyContent.gender}`);
    list.append("p").text(`Age: ${pbodyContent.age}`);
    list.append("p").text(`Location: ${pbodyContent.location}`);
    list.append("p").text(`Bellybutton Type: ${pbodyContent.bbtype}`);
    list.append("p").text(`Washing Freq: ${pbodyContent.wfreq}`);

       
        });


};



function init() {
    
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);

      // Loop through sampleNames to add "option" elements to the selector
      //TODO: 
      sampleNames.forEach(sample => {
        var x = document.getElementById("selDataset");
        var option = document.createElement("option");
        option.text = sample;
        x.add(option);
      });

    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    d3.select("#selDataset").on("change", handleSubmit); 
    // Submit Button handler
        function handleSubmit() {
        // Prevent the page from refreshing
        d3.event.preventDefault();

        // Select the input value from the form
        var currentSelection = d3.select("#selDataset").node().value;
        console.log(currentSelection)
      };

    buildCharts(newSample);
    buildMetadata(newSample);
  };
  
  // Initialize the dashboard
  init();