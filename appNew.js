// append ids to the dropdown   
d3.json('samples.json').then((data)=>{
    var id=data.names;
    console.log(data.metadata);
    var select=d3.selectAll('#selDataset');
    Object.entries(id).forEach(([i,v])=>{
        select.append('option').text(v);
    })
})
    
function getData(getId){
    d3.json('samples.json').then((data)=>{
        // This is the array
        var samples=data.samples;
        var testNum=samples.map(row=>row.id).indexOf(getId);

        
        // bar chart
        var topTenotuvalue=samples.map(row=>row.sample_values);
        var topTenotuvalue=topTenotuvalue[testNum].slice(0,10).reverse();
        var topTenotuID=samples.map(row=>row.otu_ids);
        var topTenotuID=topTenotuID[testNum].slice(0,10);
        var topTenotulabel=samples.map(row=>row.otu_labels); 
        var topTenotulabel=topTenotulabel[testNum].slice(0,10); 
        var trace={
            x: topTenotuvalue,
            y: topTenotuID.map(r=>`UTO ${r}`),
            text: topTenotulabel,
            type:'bar',
            orientation:'h'
        }
        Plotly.newPlot('bar',[trace]);
        // bubble chart
        var otuValue=samples.map(row=>row.sample_values);
        var otuValue=otuValue[testNum];
        var otuId=samples.map(row=>row.otu_ids);
        var otuId=otuId[testNum];
        var otuLabel=samples.map(row=>row.otu_labels); 
        var otuLabel=otuLabel[testNum];
        var minIds=d3.min(otuId);
        var maxIds=d3.max(otuId);
        var mapNr = d3.scaleLinear().domain([minIds, maxIds]).range([0, 1]);
        var bubbleColors = otuId.map( val => d3.interpolateRgbBasis(["royalblue", "greenyellow", "goldenrod"])(mapNr(val)));
        var trace1={
            x: otuId,
            y: otuValue,
            text: otuLabel,
            mode: 'markers',
            marker: {
                color: bubbleColors,
                size: otuValue.map(x=>x*10),
                sizemode: 'area'
            }
        };
        var data1=[trace1];
        var bubbleLayout={
            xaxis:{
                autochange: true,
                height: 600,
                width: 1000,
                title: {
                    text: 'OTU ID'
                }
            },
        };
        Plotly.newPlot('bubble',data1,bubbleLayout);   

        // display meta info
        var meta=data.metadata;
        var metadata=d3.select('#sample-metadata');
        metadata.html('');
        Object.entries(meta[testNum]).forEach(([k,v])=>{
            metadata.append('p').text(`${k.toUpperCase()}:\n${v}`);
        })

        // gauge chart 

        trace1={
        hole: 0.4, 
        type: 'pie', 
        marker: {
            colors: ['', '', '', '', '', '', '', '', '', 'white'], 
            hoverinfo: 'label', 
            labelssrc: 'bigpimpatl:3:6a9398', 
            labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9']
            }, 
            textsrc: 'bigpimpatl:3:3b66ba', 
            text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'], 
            rotation: 90, 
            textinfo: 'text', 
            direction: 'clockwise', 
            valuessrc: 'bigpimpatl:3:05daaa', 
            values: [9, 9, 9, 9, 9, 9, 9, 9, 9, 81], 
            showlegend: false, 
            textposition: 'inside'
          };
          data2 = [trace1];
          layout = {
            title: 'Washing Frequency', 
            xaxis: {
              range: [-1, 1], 
              visible: false
            }, 
            yaxis: {
              range: [-1, 1], 
              visible: false
            }, 
            shapes: [
              {
                x0: 0.5, 
                x1: 0.6, 
                y0: 0.5, 
                y1: 0.6, 
                line: {
                  color: 'black', 
                  width: 3
                }, 
                type: 'line'
              }
            ], 
            autosize: true
          };
          Plotly.plot('gauge', {
            data: data2,
            layout: layout
          });

    })
}
// Submit Button handler
function optionChanged(newId) {
    // Select the input value from the form
    getData(newId);
}
  
  